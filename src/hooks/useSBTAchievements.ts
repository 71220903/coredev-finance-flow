
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';
import { ipfsService } from '@/services/ipfs';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "trust" | "lending" | "community" | "milestone";
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  reward: string;
  sbtTokenId?: string;
  onChain?: boolean;
}

export const useSBTAchievements = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const { reputationSBT, isReady } = useContract();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userSBTs, setUserSBTs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Define available achievements
  const availableAchievements: Omit<Achievement, 'progress' | 'unlocked' | 'sbtTokenId' | 'onChain'>[] = [
    {
      id: "first-loan",
      title: "First Steps",
      description: "Complete your first loan successfully",
      category: "milestone",
      rarity: "common",
      maxProgress: 1,
      reward: "Trust Score +5"
    },
    {
      id: "trust-builder",
      title: "Trust Builder",
      description: "Reach Trust Score of 80+",
      category: "trust",
      rarity: "rare",
      maxProgress: 80,
      reward: "Lower Interest Rates"
    },
    {
      id: "serial-borrower",
      title: "Serial Borrower",
      description: "Complete 5 successful loans",
      category: "lending",
      rarity: "epic",
      maxProgress: 5,
      reward: "Exclusive Borrower Badge"
    },
    {
      id: "community-champion",
      title: "Community Champion",
      description: "Help 10 developers with code reviews",
      category: "community",
      rarity: "rare",
      maxProgress: 10,
      reward: "Special Forum Badge"
    },
    {
      id: "whale-borrower",
      title: "Whale Borrower",
      description: "Borrow over $100,000 total",
      category: "lending",
      rarity: "legendary",
      maxProgress: 100000,
      reward: "VIP Support Access"
    }
  ];

  // Check user's SBT ownership
  const checkUserSBTs = useCallback(async () => {
    if (!address || !reputationSBT || !isReady) return;

    try {
      const balance = await reputationSBT.balanceOf(address);
      const sbtCount = Number(balance);
      
      const sbtTokenIds: string[] = [];
      
      // Get all token URIs (simplified - in production you'd use tokenOfOwnerByIndex)
      for (let i = 0; i < sbtCount; i++) {
        try {
          // This is a simplified approach - actual implementation would differ
          const tokenId = i + 1;
          const tokenURI = await reputationSBT.tokenURI(tokenId);
          sbtTokenIds.push(tokenId.toString());
        } catch (error) {
          // Token doesn't exist or not owned by user
          continue;
        }
      }

      setUserSBTs(sbtTokenIds);
      console.log('User SBTs:', sbtTokenIds);

    } catch (error) {
      console.error('Error checking user SBTs:', error);
    }
  }, [address, reputationSBT, isReady]);

  // Calculate achievement progress based on user data
  const calculateProgress = useCallback((achievementId: string): number => {
    // This would integrate with real user data from contracts
    // For now, using mock progress calculation
    switch (achievementId) {
      case "first-loan":
        return 1; // Assume user has completed first loan
      case "trust-builder":
        return 88; // Mock trust score
      case "serial-borrower":
        return 2; // Mock completed loans
      case "community-champion":
        return 7; // Mock community contributions
      case "whale-borrower":
        return 65000; // Mock total borrowed amount
      default:
        return 0;
    }
  }, []);

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

  // Mint SBT for achievement
  const mintAchievementSBT = async (achievement: Achievement): Promise<boolean> => {
    if (!address || !reputationSBT || !isReady) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to mint SBT",
        variant: "destructive"
      });
      return false;
    }

    if (!achievement.unlocked) {
      toast({
        title: "Achievement Not Unlocked",
        description: "You must complete the achievement first",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      // Create metadata for the SBT
      const metadata = {
        name: achievement.title,
        description: achievement.description,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${achievement.id}`,
        attributes: [
          { trait_type: "Category", value: achievement.category },
          { trait_type: "Rarity", value: achievement.rarity },
          { trait_type: "Achievement ID", value: achievement.id }
        ]
      };

      // Upload metadata to IPFS
      const ipfsResult = await ipfsService.uploadJSON(metadata);
      if (!ipfsResult.success || !ipfsResult.hash) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      const tokenURI = `ipfs://${ipfsResult.hash}`;

      // Mint the SBT
      const tx = await reputationSBT.mintAchievement(address, tokenURI);
      
      toast({
        title: "Minting SBT...",
        description: "Your achievement SBT is being minted"
      });

      const receipt = await tx.wait();
      
      toast({
        title: "SBT Minted Successfully! 🏆",
        description: `Your "${achievement.title}" Soul-Bound Token has been minted!`
      });

      // Refresh SBT data
      await checkUserSBTs();
      
      return true;

    } catch (error: any) {
      console.error('Error minting SBT:', error);
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint achievement SBT",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

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
