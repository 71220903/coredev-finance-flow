
import { useState, useEffect, useCallback } from 'react';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useStaking } from './useStaking';
import { useToast } from '@/hooks/use-toast';
import { useDelegationData, DelegationInfo } from './useDelegationData';
import { mockValidators } from '@/config/validators';

interface HybridStakingState {
  totalStaked: number;
  directStake: number;
  delegatedStake: number;
  totalRewards: number;
  delegations: DelegationInfo[];
  apy: number;
  isLoading: boolean;
}

export const useHybridStaking = () => {
  const { toast } = useToast();
  const { address, isConnected, provider } = useWallet();
  const { stakingVault } = useContract();
  const { currentStake, refreshStatus } = useStaking();
  const { fetchDelegationData } = useDelegationData();
  
  const [hybridState, setHybridState] = useState<HybridStakingState>({
    totalStaked: 0,
    directStake: 0,
    delegatedStake: 0,
    totalRewards: 0,
    delegations: [],
    apy: 8.5,
    isLoading: false
  });

  // Calculate total rewards from various sources
  const calculateTotalRewards = useCallback((delegations: DelegationInfo[]): number => {
    const delegationRewards = delegations.reduce((sum, del) => sum + del.rewards, 0);
    const directStakeRewards = currentStake * 0.085 * (30 / 365);
    return delegationRewards + directStakeRewards;
  }, [currentStake]);

  // Fetch all hybrid staking data
  const fetchHybridStakingData = useCallback(async () => {
    if (!address || !isConnected) return;

    setHybridState(prev => ({ ...prev, isLoading: true }));

    try {
      const delegations = await fetchDelegationData(address);
      const delegatedStake = delegations.reduce((sum, del) => sum + del.amount, 0);
      const totalRewards = calculateTotalRewards(delegations);

      setHybridState({
        totalStaked: currentStake + delegatedStake,
        directStake: currentStake,
        delegatedStake,
        totalRewards,
        delegations,
        apy: 8.5,
        isLoading: false
      });

    } catch (error) {
      console.error('Error fetching hybrid staking data:', error);
      setHybridState(prev => ({ ...prev, isLoading: false }));
    }
  }, [address, isConnected, currentStake, fetchDelegationData, calculateTotalRewards]);

  // Delegate to Core validator (mock implementation)
  const delegateToValidator = async (validatorAddress: string, amount: number): Promise<boolean> => {
    if (!address || !isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to delegate",
        variant: "destructive"
      });
      return false;
    }

    try {
      setHybridState(prev => ({ ...prev, isLoading: true }));

      toast({
        title: "Delegating to Validator",
        description: `Delegating ${amount} tCORE to validator...`
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Delegation Successful! 🎯",
        description: `Successfully delegated ${amount} tCORE to validator`
      });

      await fetchHybridStakingData();
      return true;

    } catch (error: any) {
      console.error('Error delegating to validator:', error);
      toast({
        title: "Delegation Failed",
        description: error.message || "Failed to delegate to validator",
        variant: "destructive"
      });
      return false;
    } finally {
      setHybridState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Claim rewards from delegations
  const claimRewards = async (): Promise<boolean> => {
    if (!address || !isConnected) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive"
      });
      return false;
    }

    try {
      setHybridState(prev => ({ ...prev, isLoading: true }));

      toast({
        title: "Claiming Rewards",
        description: "Claiming your staking rewards..."
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const totalRewards = hybridState.totalRewards;
      
      toast({
        title: "Rewards Claimed! 💰",
        description: `Successfully claimed ${totalRewards.toFixed(4)} tCORE in rewards`
      });

      await fetchHybridStakingData();
      return true;

    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      toast({
        title: "Claim Failed",
        description: error.message || "Failed to claim rewards",
        variant: "destructive"
      });
      return false;
    } finally {
      setHybridState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchHybridStakingData();
    }
  }, [isConnected, fetchHybridStakingData]);

  return {
    ...hybridState,
    delegateToValidator,
    claimRewards,
    refreshData: fetchHybridStakingData,
    validators: mockValidators
  };
};
