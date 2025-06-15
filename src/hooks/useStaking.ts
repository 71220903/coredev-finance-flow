
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

interface StakingState {
  currentStake: number;
  isStaked: boolean;
  totalVaultStaked: number;
  isLoading: boolean;
}

export const useStaking = () => {
  const { toast } = useToast();
  const { address, isConnected, isOnCorrectNetwork, updateBalance } = useWallet();
  const { stakingVault } = useContract();
  
  const [stakingState, setStakingState] = useState<StakingState>({
    currentStake: 0,
    isStaked: false,
    totalVaultStaked: 0,
    isLoading: false
  });

  // Check staking status
  const checkStakingStatus = async () => {
    if (!address || !isConnected || !isOnCorrectNetwork || !stakingVault) {
      setStakingState({
        currentStake: 0,
        isStaked: false,
        totalVaultStaked: 0,
        isLoading: false
      });
      return;
    }

    setStakingState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get user's stake amount
      const userStake = await stakingVault.stakesOf(address);
      const stakeAmount = Number(ethers.formatEther(userStake));
      
      // Get total vault stake
      const totalStaked = await stakingVault.totalStakedInVault();
      const totalAmount = Number(ethers.formatEther(totalStaked));

      setStakingState({
        currentStake: stakeAmount,
        isStaked: stakeAmount > 0,
        totalVaultStaked: totalAmount,
        isLoading: false
      });

      console.log('Staking status:', {
        address,
        userStake: stakeAmount,
        totalStaked: totalAmount,
        isStaked: stakeAmount > 0
      });

    } catch (error: any) {
      console.error('Error checking staking status:', error);
      setStakingState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Staking Check Failed",
        description: "Failed to check staking status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Stake tCORE
  const stake = async (amount: number) => {
    if (!address || !isOnCorrectNetwork || !stakingVault) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to Core Testnet",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Staking amount:', amount);
      
      const stakeValue = ethers.parseEther(amount.toString());
      const tx = await stakingVault.stake({ value: stakeValue });
      
      toast({
        title: "Transaction Submitted",
        description: "Staking your tCORE..."
      });

      await tx.wait();
      
      toast({
        title: "Staking Successful! 🎉",
        description: `You have successfully staked ${amount} tCORE. Market creation is now enabled!`
      });

      // Refresh staking status and wallet balance
      await Promise.all([checkStakingStatus(), updateBalance()]);
      
      return true;
    } catch (error: any) {
      console.error('Error staking:', error);
      toast({
        title: "Staking Failed",
        description: error.message || "Failed to stake tCORE",
        variant: "destructive"
      });
      return false;
    }
  };

  // Unstake tCORE
  const unstake = async (amount: number) => {
    if (!address || !isOnCorrectNetwork || !stakingVault) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to Core Testnet",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Unstaking amount:', amount);
      
      const unstakeValue = ethers.parseEther(amount.toString());
      const tx = await stakingVault.unstake(unstakeValue);
      
      toast({
        title: "Transaction Submitted",
        description: "Unstaking your tCORE..."
      });

      await tx.wait();
      
      toast({
        title: "Unstaking Successful! ✅",
        description: `${amount} tCORE has been returned to your wallet.`
      });

      // Refresh staking status and wallet balance
      await Promise.all([checkStakingStatus(), updateBalance()]);
      
      return true;
    } catch (error: any) {
      console.error('Error unstaking:', error);
      toast({
        title: "Unstaking Failed",
        description: error.message || "Failed to unstake tCORE",
        variant: "destructive"
      });
      return false;
    }
  };

  // Auto-check when wallet connection changes
  useEffect(() => {
    checkStakingStatus();
  }, [address, isConnected, isOnCorrectNetwork]);

  return {
    ...stakingState,
    stake,
    unstake,
    refreshStatus: checkStakingStatus
  };
};
