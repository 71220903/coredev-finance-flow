
import { useState, useEffect, useCallback } from 'react';
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

  const fetchBalance = useCallback(async () => {
    if (!sUSDT || !address) return;
    
    try {
      const bal = await sUSDT.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 6));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [sUSDT, address]);

  const fetchAllowance = useCallback(async () => {
    if (!sUSDT || !address || !marketAddress) return;
    
    try {
      const allow = await sUSDT.allowance(address, marketAddress);
      setAllowance(ethers.formatUnits(allow, 6));
    } catch (error) {
      console.error('Error fetching allowance:', error);
    }
  }, [sUSDT, address, marketAddress]);

  const approveToken = async (amount: string) => {
    if (!sUSDT || !marketAddress) return false;

    setIsApproving(true);
    try {
      const amountInWei = ethers.parseUnits(amount, 6);
      const tx = await sUSDT.approve(marketAddress, amountInWei);
      await tx.wait();
      
      await fetchAllowance();
      return true;
    } catch (error) {
      console.error('Error approving token:', error);
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const executeDeposit = async (amount: string) => {
    if (!isReady || !marketAddress || !amount) return false;

    const marketContract = getMarketContract(marketAddress);
    if (!marketContract) return false;

    // Check and approve if needed
    const amountFloat = parseFloat(amount);
    const allowanceFloat = parseFloat(allowance);
    
    if (allowanceFloat < amountFloat) {
      const approved = await approveToken(amount);
      if (!approved) return false;
    }

    setIsDepositing(true);
    try {
      const amountInWei = ethers.parseUnits(amount, 6);
      
      // Generate NFT metadata (simplified)
      const tokenURI = `{"name":"Loan Position","description":"Position in market ${marketAddress}","amount":"${amount}"}`;
      
      // Call deposit with NFT minting
      const tx = await marketContract.deposit(amountInWei, tokenURI);
      await tx.wait();
      
      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${amount} sUSDT. Loan Position NFT minted.`
      });
      
      // Refresh balances and positions
      await Promise.all([
        fetchBalance(),
        fetchAllowance(),
        fetchUserPositions()
      ]);
      
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
    return parseFloat(balance) >= parseFloat(amount || '0');
  };

  const hasSufficientAllowance = (amount: string) => {
    return parseFloat(allowance) >= parseFloat(amount || '0');
  };

  useEffect(() => {
    if (isReady && address) {
      fetchBalance();
      fetchAllowance();
    }
  }, [isReady, address, fetchBalance, fetchAllowance]);

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
