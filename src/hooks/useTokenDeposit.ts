
import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

export const useTokenDeposit = (marketAddress?: string) => {
  const { sUSDT, getMarketContract } = useContract();
  const { address, updateBalance } = useWallet();
  const { toast } = useToast();

  const [balance, setBalance] = useState('0');
  const [allowance, setAllowance] = useState('0');
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  // Fetch user's sUSDT balance
  const fetchBalance = useCallback(async () => {
    if (!sUSDT || !address) return;

    try {
      const userBalance = await sUSDT.balanceOf(address);
      setBalance(ethers.formatUnits(userBalance, 6));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [sUSDT, address]);

  // Fetch allowance for the market contract
  const fetchAllowance = useCallback(async () => {
    if (!sUSDT || !address || !marketAddress) return;

    try {
      const userAllowance = await sUSDT.allowance(address, marketAddress);
      setAllowance(ethers.formatUnits(userAllowance, 6));
    } catch (error) {
      console.error('Error fetching allowance:', error);
    }
  }, [sUSDT, address, marketAddress]);

  // Approve sUSDT spending
  const approveTokens = useCallback(async (amount: string) => {
    if (!sUSDT || !marketAddress) {
      toast({
        title: "Error",
        description: "Contract not ready",
        variant: "destructive"
      });
      return false;
    }

    setIsApproving(true);

    try {
      const amountWei = ethers.parseUnits(amount, 6);
      const tx = await sUSDT.approve(marketAddress, amountWei);
      
      toast({
        title: "Approval Sent",
        description: "Waiting for confirmation..."
      });

      await tx.wait();
      
      toast({
        title: "Approval Confirmed",
        description: `Approved ${amount} sUSDT for market`
      });

      // Refresh allowance
      await fetchAllowance();
      return true;

    } catch (error: any) {
      console.error('Error approving tokens:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve tokens",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsApproving(false);
    }
  }, [sUSDT, marketAddress, toast, fetchAllowance]);

  // Deposit to market
  const depositToMarket = useCallback(async (amount: string) => {
    if (!marketAddress) {
      toast({
        title: "Error",
        description: "No market selected",
        variant: "destructive"
      });
      return false;
    }

    const marketContract = getMarketContract(marketAddress);
    if (!marketContract) {
      toast({
        title: "Error",
        description: "Market contract not found",
        variant: "destructive"
      });
      return false;
    }

    setIsDepositing(true);

    try {
      const amountWei = ethers.parseUnits(amount, 6);
      const tx = await marketContract.deposit(amountWei);
      
      toast({
        title: "Deposit Sent",
        description: "Waiting for confirmation..."
      });

      await tx.wait();
      
      toast({
        title: "Deposit Confirmed",
        description: `Successfully deposited ${amount} sUSDT`
      });

      // Refresh balances
      await Promise.all([fetchBalance(), fetchAllowance(), updateBalance()]);
      return true;

    } catch (error: any) {
      console.error('Error depositing:', error);
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to deposit tokens",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDepositing(false);
    }
  }, [marketAddress, getMarketContract, toast, fetchBalance, fetchAllowance, updateBalance]);

  // Two-step deposit process
  const executeDeposit = useCallback(async (amount: string) => {
    const amountNum = parseFloat(amount);
    const allowanceNum = parseFloat(allowance);

    // Check if approval is needed
    if (allowanceNum < amountNum) {
      const approved = await approveTokens(amount);
      if (!approved) return false;
    }

    // Proceed with deposit
    return await depositToMarket(amount);
  }, [allowance, approveTokens, depositToMarket]);

  // Check if sufficient allowance exists
  const hasSufficientAllowance = useCallback((amount: string) => {
    return parseFloat(allowance) >= parseFloat(amount);
  }, [allowance]);

  // Check if sufficient balance exists
  const hasSufficientBalance = useCallback((amount: string) => {
    return parseFloat(balance) >= parseFloat(amount);
  }, [balance]);

  useEffect(() => {
    fetchBalance();
    fetchAllowance();
  }, [fetchBalance, fetchAllowance]);

  return {
    balance,
    allowance,
    isApproving,
    isDepositing,
    depositAmount,
    setDepositAmount,
    approveTokens,
    depositToMarket,
    executeDeposit,
    hasSufficientAllowance,
    hasSufficientBalance,
    refreshData: () => Promise.all([fetchBalance(), fetchAllowance()])
  };
};
