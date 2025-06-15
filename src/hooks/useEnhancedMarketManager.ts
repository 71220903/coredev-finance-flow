
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedMarketManager = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const { marketFactory, getMarketContract, isReady } = useContract();
  const [loading, setLoading] = useState(false);

  // Start and borrow loan (for borrowers when market is fully funded)
  const startAndBorrow = useCallback(async (marketAddress: string): Promise<boolean> => {
    if (!isConnected || !isReady) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet",
        variant: "destructive"
      });
      return false;
    }

    const marketContract = getMarketContract(marketAddress);
    if (!marketContract) return false;

    try {
      setLoading(true);

      // Check if market is fully funded and user is borrower
      const [borrower, totalDeposited, loanAmount, currentState] = await Promise.all([
        marketContract.borrower(),
        marketContract.totalDeposited(),
        marketContract.loanAmount(),
        marketContract.currentState()
      ]);

      if (borrower.toLowerCase() !== address?.toLowerCase()) {
        toast({
          title: "Access Denied",
          description: "Only the borrower can start the loan",
          variant: "destructive"
        });
        return false;
      }

      if (currentState !== 0) {
        toast({
          title: "Invalid State",
          description: "Market is not in funding state",
          variant: "destructive"
        });
        return false;
      }

      if (totalDeposited < loanAmount) {
        toast({
          title: "Insufficient Funding",
          description: "Market is not fully funded yet",
          variant: "destructive"
        });
        return false;
      }

      const tx = await marketContract.startAndBorrow();
      
      toast({
        title: "Starting Loan...",
        description: "Your loan is being activated"
      });

      await tx.wait();

      toast({
        title: "Loan Started Successfully! 🎉",
        description: "Funds have been transferred to your wallet"
      });

      return true;

    } catch (error: any) {
      console.error('Error starting loan:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to start loan",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, isReady, getMarketContract, toast]);

  // Mark market as defaulted (for admin/system)
  const markAsDefaulted = useCallback(async (marketAddress: string): Promise<boolean> => {
    if (!isConnected || !isReady) return false;

    const marketContract = getMarketContract(marketAddress);
    if (!marketContract) return false;

    try {
      setLoading(true);

      const tx = await marketContract.markAsDefaulted();
      
      toast({
        title: "Marking as Defaulted...",
        description: "Processing default status"
      });

      await tx.wait();

      toast({
        title: "Market Defaulted",
        description: "Market has been marked as defaulted",
        variant: "destructive"
      });

      return true;

    } catch (error: any) {
      console.error('Error marking as defaulted:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to mark as defaulted",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [isConnected, isReady, getMarketContract, toast]);

  // Get detailed market data including new fields
  const getDetailedMarketData = useCallback(async (marketAddress: string) => {
    const marketContract = getMarketContract(marketAddress);
    if (!marketContract) return null;

    try {
      const [
        borrower,
        loanAmount,
        interestRateBps,
        tenorSeconds,
        totalDeposited,
        currentState,
        projectDataCID,
        fundingDeadline,
        loanStartTime,
        loanDueDate
      ] = await Promise.all([
        marketContract.borrower(),
        marketContract.loanAmount(),
        marketContract.interestRateBps(),
        marketContract.tenorSeconds(),
        marketContract.totalDeposited(),
        marketContract.currentState(),
        marketContract.projectDataCID(),
        marketContract.fundingDeadline().catch(() => 0),
        marketContract.loanStartTime().catch(() => 0),
        marketContract.loanDueDate().catch(() => 0)
      ]);

      return {
        contractAddress: marketAddress,
        borrower,
        loanAmount: ethers.formatUnits(loanAmount, 6),
        interestRateBps: Number(interestRateBps),
        tenorSeconds: Number(tenorSeconds),
        totalDeposited: ethers.formatUnits(totalDeposited, 6),
        currentState: Number(currentState),
        projectDataCID,
        fundingDeadline: Number(fundingDeadline),
        loanStartTime: Number(loanStartTime),
        loanDueDate: Number(loanDueDate),
        fundingProgress: Number(totalDeposited) > 0 ? 
          (Number(ethers.formatUnits(totalDeposited, 6)) / Number(ethers.formatUnits(loanAmount, 6))) * 100 : 0
      };

    } catch (error) {
      console.error('Error fetching detailed market data:', error);
      return null;
    }
  }, [getMarketContract]);

  // Get user's deposits in a specific market
  const getUserDeposits = useCallback(async (marketAddress: string, userAddress?: string): Promise<string> => {
    const marketContract = getMarketContract(marketAddress);
    const targetAddress = userAddress || address;
    
    if (!marketContract || !targetAddress) return '0';

    try {
      const deposits = await marketContract.depositsOf(targetAddress);
      return ethers.formatUnits(deposits, 6);
    } catch (error) {
      console.error('Error fetching user deposits:', error);
      return '0';
    }
  }, [getMarketContract, address]);

  // Award repayment SBT to developer
  const awardRepaymentSBT = useCallback(async (developerAddress: string, tokenId: number): Promise<boolean> => {
    if (!marketFactory || !isReady) return false;

    try {
      setLoading(true);

      const tx = await marketFactory.awardRepaymentSBT(developerAddress, tokenId);
      
      toast({
        title: "Awarding Achievement SBT...",
        description: "Processing repayment achievement"
      });

      await tx.wait();

      toast({
        title: "Achievement SBT Awarded! 🏆",
        description: "Repayment achievement has been recorded on-chain"
      });

      return true;

    } catch (error: any) {
      console.error('Error awarding repayment SBT:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to award SBT",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [marketFactory, isReady, toast]);

  return {
    loading,
    startAndBorrow,
    markAsDefaulted,
    getDetailedMarketData,
    getUserDeposits,
    awardRepaymentSBT
  };
};
