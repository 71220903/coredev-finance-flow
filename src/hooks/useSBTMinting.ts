
import { useState } from 'react';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';
import { ipfsService } from '@/services/ipfs';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: string;
  unlocked: boolean;
}

export const useSBTMinting = () => {
  const { toast } = useToast();
  const { address } = useWallet();
  const { reputationSBT, isReady } = useContract();
  const [loading, setLoading] = useState(false);

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

      await tx.wait();
      
      toast({
        title: "SBT Minted Successfully! 🏆",
        description: `Your "${achievement.title}" Soul-Bound Token has been minted!`
      });

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

  return { mintAchievementSBT, loading };
};
