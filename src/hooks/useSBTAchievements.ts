
import { useState, useEffect, useCallback } from 'react';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { availableAchievements, Achievement as BaseAchievement } from '@/config/achievements';
import { useAchievementProgress } from './useAchievementProgress';
import { useSBTMinting } from './useSBTMinting';

export interface Achievement extends BaseAchievement {
  progress: number;
  unlocked: boolean;
  sbtTokenId?: string;
  onChain?: boolean;
}

export const useSBTAchievements = () => {
  const { address, isConnected } = useWallet();
  const { reputationSBT, isReady } = useContract();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userSBTs, setUserSBTs] = useState<string[]>([]);
  
  const { calculateProgress } = useAchievementProgress();
  const { mintAchievementSBT, loading } = useSBTMinting();

  // Check user's SBT ownership
  const checkUserSBTs = useCallback(async () => {
    if (!address || !reputationSBT || !isReady) return;

    try {
      const balance = await reputationSBT.balanceOf(address);
      const sbtCount = Number(balance);
      
      const sbtTokenIds: string[] = [];
      
      for (let i = 0; i < sbtCount; i++) {
        try {
          const tokenId = i + 1;
          const tokenURI = await reputationSBT.tokenURI(tokenId);
          sbtTokenIds.push(tokenId.toString());
        } catch (error) {
          continue;
        }
      }

      setUserSBTs(sbtTokenIds);
      console.log('User SBTs:', sbtTokenIds);

    } catch (error) {
      console.error('Error checking user SBTs:', error);
    }
  }, [address, reputationSBT, isReady]);

  // Update achievements with progress and SBT status
  const updateAchievements = useCallback(() => {
    const updatedAchievements = availableAchievements.map(achievement => {
      const progress = calculateProgress(achievement.id);
      const unlocked = progress >= achievement.maxProgress;
      const sbtTokenId = userSBTs.find(id => id.includes(achievement.id));
      const onChain = !!sbtTokenId;

      return {
        ...achievement,
        progress,
        unlocked,
        sbtTokenId,
        onChain
      };
    });

    setAchievements(updatedAchievements);
  }, [calculateProgress, userSBTs]);

  // Initialize data
  useEffect(() => {
    if (isConnected && isReady) {
      checkUserSBTs();
    }
  }, [isConnected, isReady, checkUserSBTs]);

  useEffect(() => {
    updateAchievements();
  }, [updateAchievements]);

  return {
    achievements,
    userSBTs,
    loading,
    mintAchievementSBT,
    refreshSBTs: checkUserSBTs
  };
};
