
import { useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useDeveloperVerification } from './useDeveloperVerification';
import { useStaking } from './useStaking';
import { ipfsService } from '@/services/ipfs';
import { useToast } from '@/hooks/use-toast';

interface MarketCreationData {
  projectTitle: string;
  description: string;
  amount: string;
  interestRate: string;
  tenor: string;
  tags: string[];
  additionalData?: any;
}

interface MarketCreationState {
  isCreating: boolean;
  currentStep: string;
  progress: number;
}

export const useMarketCreation = () => {
  const { toast } = useToast();
  const { address, isConnected, isOnCorrectNetwork } = useWallet();
  const { marketFactory } = useContract();
  const { isVerified } = useDeveloperVerification();
  const { isStaked } = useStaking();
  
  const [creationState, setCreationState] = useState<MarketCreationState>({
    isCreating: false,
    currentStep: '',
    progress: 0
  });

  const createMarket = async (marketData: MarketCreationData): Promise<boolean> => {
    if (!address || !isConnected || !isOnCorrectNetwork) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to Core Testnet",
        variant: "destructive"
      });
      return false;
    }

    if (!isVerified) {
      toast({
        title: "Developer Verification Required",
        description: "You need to be a verified developer to create markets.",
        variant: "destructive"
      });
      return false;
    }

    if (!isStaked) {
      toast({
        title: "Staking Required",
        description: "You need to stake tCORE before creating a market.",
        variant: "destructive"
      });
      return false;
    }

    if (!marketFactory) {
      toast({
        title: "Contract Error",
        description: "Market factory contract not available",
        variant: "destructive"
      });
      return false;
    }

    setCreationState({
      isCreating: true,
      currentStep: 'Preparing project data...',
      progress: 10
    });

    try {
      // Step 1: Prepare project data for IPFS
      const projectData = {
        title: marketData.projectTitle,
        description: marketData.description,
        tags: marketData.tags,
        creator: address,
        timestamp: Date.now(),
        additionalData: marketData.additionalData || {}
      };

      console.log('Creating market with data:', {
        ...marketData,
        projectData
      });

      setCreationState(prev => ({
        ...prev,
        currentStep: 'Uploading to IPFS...',
        progress: 30
      }));

      // Step 2: Upload project data to IPFS
      const ipfsResult = await ipfsService.uploadJSON(projectData);
      
      if (!ipfsResult.success || !ipfsResult.hash) {
        throw new Error(ipfsResult.error || 'Failed to upload project data to IPFS');
      }

      const projectDataCID = ipfsResult.hash;

      setCreationState(prev => ({
        ...prev,
        currentStep: 'Creating market contract...',
        progress: 60
      }));

      // Step 3: Call createMarket on MarketFactory
      const loanAmount = ethers.parseUnits(marketData.amount, 6); // sUSDT has 6 decimals
      const interestRateBps = Math.round(Number(marketData.interestRate) * 100); // Convert % to basis points
      const tenorSeconds = Number(marketData.tenor) * 30 * 24 * 60 * 60; // Convert months to seconds

      console.log('Contract parameters:', {
        loanAmount: loanAmount.toString(),
        interestRateBps,
        tenorSeconds,
        projectDataCID
      });

      const tx = await marketFactory.createMarket(
        loanAmount,
        interestRateBps,
        tenorSeconds,
        projectDataCID
      );

      setCreationState(prev => ({
        ...prev,
        currentStep: 'Confirming transaction...',
        progress: 80
      }));

      const receipt = await tx.wait();
      
      // Extract market address from events
      const marketCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = marketFactory.interface.parseLog(log);
          return parsed && parsed.name === 'MarketCreated';
        } catch {
          return false;
        }
      });

      let marketAddress = 'Unknown';
      if (marketCreatedEvent) {
        const parsed = marketFactory.interface.parseLog(marketCreatedEvent);
        marketAddress = parsed?.args[1] || 'Unknown';
      }

      setCreationState(prev => ({
        ...prev,
        currentStep: 'Market created successfully!',
        progress: 100
      }));

      toast({
        title: "Market Created Successfully! 🎉",
        description: `Your loan request for $${Number(marketData.amount).toLocaleString()} has been created and is now seeking funding.`
      });

      console.log('Market created:', {
        marketAddress,
        projectDataCID,
        transactionHash: tx.hash
      });

      // Reset state after a short delay
      setTimeout(() => {
        setCreationState({
          isCreating: false,
          currentStep: '',
          progress: 0
        });
      }, 2000);

      return true;

    } catch (error: any) {
      console.error('Error creating market:', error);
      
      setCreationState({
        isCreating: false,
        currentStep: '',
        progress: 0
      });

      toast({
        title: "Market Creation Failed",
        description: error.message || "Failed to create market",
        variant: "destructive"
      });

      return false;
    }
  };

  return {
    ...creationState,
    createMarket
  };
};
