
import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useLoanPositionNFT } from './useLoanPositionNFT';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedTokenDeposit = (marketAddress: string) => {
  const { sUSDT, getMarketContract, isReady } = useContract();
  const { address } = useWallet();
  const { fetchUserPositions } = useLoanPositionNFT();
  const { toast } = useToast();
  
  const [balance, setBalance] = useState('0');
  const [allowance, setAllowance] = useState('0');
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const fetchingRef = useRef(false);

  const fetchBalance = useCallback(async () => {
    if (!sUSDT || !address || fetchingRef.current) return;
    
    try {
      console.log('Fetching sUSDT balance for:', address);
      const bal = await sUSDT.balanceOf(address);
      const formattedBalance = ethers.formatUnits(bal, 6);
      setBalance(formattedBalance);
      console.log('sUSDT balance:', formattedBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('0');
    }
  }, [sUSDT, address]);

  const fetchAllowance = useCallback(async () => {
    if (!sUSDT || !address || !marketAddress || fetchingRef.current) return;
    
    try {
      console.log('Fetching allowance for market:', marketAddress);
      const allow = await sUSDT.allowance(address, marketAddress);
      const formattedAllowance = ethers.formatUnits(allow, 6);
      setAllowance(formattedAllowance);
      console.log('Allowance:', formattedAllowance);
    } catch (error) {
      console.error('Error fetching allowance:', error);
      setAllowance('0');
    }
  }, [sUSDT, address, marketAddress]);

  const approveToken = async (amount: string) => {
    if (!sUSDT || !marketAddress) {
      console.error('Cannot approve - missing sUSDT or marketAddress');
      return false;
    }

    setIsApproving(true);
    try {
      console.log('Approving', amount, 'sUSDT for market:', marketAddress);
      const amountInWei = ethers.parseUnits(amount, 6);
      const tx = await sUSDT.approve(marketAddress, amountInWei);
      console.log('Approval transaction:', tx.hash);
      await tx.wait();
      
      await fetchAllowance();
      console.log('Approval successful');
      return true;
    } catch (error) {
      console.error('Error approving token:', error);
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const executeDeposit = async (amount: string) => {
    if (!isReady || !marketAddress || !amount) {
      console.error('Cannot deposit - missing requirements');
      return false;
    }

    const marketContract = getMarketContract(marketAddress);
    if (!marketContract) {
      console.error('Cannot get market contract for:', marketAddress);
      return false;
    }

    // Check and approve if needed
    const amountFloat = parseFloat(amount);
    const allowanceFloat = parseFloat(allowance);
    
    if (allowanceFloat < amountFloat) {
      console.log('Insufficient allowance, requesting approval...');
      const approved = await approveToken(amount);
      if (!approved) {
        console.error('Approval failed, cannot proceed with deposit');
        return false;
      }
    }

    setIsDepositing(true);
    try {
      console.log('Starting deposit of', amount, 'sUSDT...');
      const amountInWei = ethers.parseUnits(amount, 6);
      
      // Generate NFT metadata (simplified)
      const tokenURI = JSON.stringify({
        name: "Loan Position",
        description: `Position in market ${marketAddress}`,
        amount: amount,
        market: marketAddress,
        timestamp: Date.now()
      });
      
      // Call deposit with NFT minting
      const tx = await marketContract.deposit(amountInWei, tokenURI);
      console.log('Deposit transaction:', tx.hash);
      await tx.wait();
      
      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${amount} sUSDT. Loan Position NFT minted.`
      });
      
      // Refresh balances and positions with delay to ensure blockchain state is updated
      setTimeout(async () => {
        await Promise.allSettled([
          fetchBalance(),
          fetchAllowance(),
          fetchUserPositions()
        ]);
      }, 2000);
      
      console.log('Deposit completed successfully');
      return true;
    } catch (error) {
      console.error('Error depositing:', error);
      toast({
        title: "Deposit Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDepositing(false);
    }
  };

  const hasSufficientBalance = (amount: string) => {
    const balanceNum = parseFloat(balance);
    const amountNum = parseFloat(amount || '0');
    return balanceNum >= amountNum;
  };

  const hasSufficientAllowance = (amount: string) => {
    const allowanceNum = parseFloat(allowance);
    const amountNum = parseFloat(amount || '0');
    return allowanceNum >= amountNum;
  };

  // Stable effect to prevent loops
  useEffect(() => {
    if (isReady && address && !fetchingRef.current) {
      fetchingRef.current = true;
      
      Promise.allSettled([fetchBalance(), fetchAllowance()])
        .finally(() => {
          fetchingRef.current = false;
        });
    }
  }, [isReady, !!address, !!marketAddress]); // Only depend on boolean values

  return {
    balance,
    allowance,
    isApproving,
    isDepositing,
    executeDeposit,
    hasSufficientBalance,
    hasSufficientAllowance
  };
};
