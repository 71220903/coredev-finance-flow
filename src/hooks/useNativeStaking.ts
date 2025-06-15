
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { useContract } from './useContract';
import { useToast } from '@/hooks/use-toast';

export const useNativeStaking = () => {
  const { address, isConnected, provider } = useWallet();
  const { stakingVault } = useContract();
  const { toast } = useToast();
  
  const [stakedAmount, setStakedAmount] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [nativeBalance, setNativeBalance] = useState('0');

  const fetchStakedAmount = useCallback(async () => {
    if (!stakingVault || !address) return;
    
    try {
      const staked = await stakingVault.stakesOf(address);
      setStakedAmount(Number(ethers.formatEther(staked)));
    } catch (error) {
      console.error('Error fetching staked amount:', error);
    }
  }, [stakingVault, address]);

  const fetchNativeBalance = useCallback(async () => {
    if (!provider || !address) return;
    
    try {
      const balance = await provider.getBalance(address);
      setNativeBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching native balance:', error);
    }
  }, [provider, address]);

  const stake = async (amount: string) => {
    if (!stakingVault || !amount) {
      toast({
        title: "Error",
        description: "Invalid amount or contract not available",
        variant: "destructive"
      });
      return false;
    }

    setIsStaking(true);
    try {
      const valueInWei = ethers.parseEther(amount);
      
      // Call stake() function with value (native token)
      const tx = await stakingVault.stake({ value: valueInWei });
      await tx.wait();
      
      toast({
        title: "Staking Successful",
        description: `Successfully staked ${amount} tCORE`
      });
      
      // Refresh balances
      await Promise.all([fetchStakedAmount(), fetchNativeBalance()]);
      return true;
    } catch (error) {
      console.error('Error staking:', error);
      toast({
        title: "Staking Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsStaking(false);
    }
  };

  const unstake = async (amount: string) => {
    if (!stakingVault || !amount) {
      toast({
        title: "Error",
        description: "Invalid amount or contract not available",
        variant: "destructive"
      });
      return false;
    }

    setIsUnstaking(true);
    try {
      const valueInWei = ethers.parseEther(amount);
      const tx = await stakingVault.unstake(valueInWei);
      await tx.wait();
      
      toast({
        title: "Unstaking Successful",
        description: `Successfully unstaked ${amount} tCORE`
      });
      
      // Refresh balances
      await Promise.all([fetchStakedAmount(), fetchNativeBalance()]);
      return true;
    } catch (error) {
      console.error('Error unstaking:', error);
      toast({
        title: "Unstaking Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUnstaking(false);
    }
  };

  // Effects
  useEffect(() => {
    if (isConnected) {
      fetchStakedAmount();
      fetchNativeBalance();
    }
  }, [isConnected, fetchStakedAmount, fetchNativeBalance]);

  return {
    stakedAmount,
    nativeBalance,
    isStaking,
    isUnstaking,
    stake,
    unstake,
    refreshBalances: () => Promise.all([fetchStakedAmount(), fetchNativeBalance()])
  };
};
