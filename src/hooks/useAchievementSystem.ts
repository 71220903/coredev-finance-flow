
import { useState, useCallback } from 'react';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';
import { ipfsService } from '@/services/ipfs';

interface AchievementMetadata {
  name: string;
  description: string;
  image: string;
  category: string;
  rarity: string;
  achievementId: string;
}

interface UserSBT {
  tokenId: string;
  tokenURI: string;
  metadata?: AchievementMetadata;
}

export const useAchievementSystem = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const { reputationSBT, isReady } = useContract();
  const [loading, setLoading] = useState(false);
  const [userSBTs, setUserSBTs] = useState<UserSBT[]>([]);

  // Mint achievement SBT with full metadata
  const mintAchievementSBT = useCallback(async (
    developerAddress: string,
    achievementData: AchievementMetadata
  ): Promise<string | null> => {
    if (!reputationSBT || !isReady) {
      toast({
        title: "Contract Not Ready",
        description: "Please ensure wallet is connected",
        variant: "destructive"
      });
      return null;
    }

    try {
      setLoading(true);

      // Create complete metadata
      const metadata = {
        name: achievementData.name,
        description: achievementData.description,
        image: achievementData.image,
        attributes: [
          { trait_type: "Category", value: achievementData.category },
          { trait_type: "Rarity", value: achievementData.rarity },
          { trait_type: "Achievement ID", value: achievementData.achievementId },
          { trait_type: "Minted At", value: new Date().toISOString() }
        ]
      };

      // Upload metadata to IPFS
      const ipfsResult = await ipfsService.uploadJSON(metadata);
      if (!ipfsResult.success || !ipfsResult.hash) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      const tokenURI = `ipfs://${ipfsResult.hash}`;

      toast({
        title: "Minting Achievement SBT...",
        description: "Creating your achievement token"
      });

      // Mint the SBT
      const tx = await reputationSBT.mintAchievement(developerAddress, tokenURI);
      const receipt = await tx.wait();

      // Extract token ID from events
      const transferEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = reputationSBT.interface.parseLog(log);
          return parsed && parsed.name === 'Transfer';
        } catch {
          return false;
        }
      });

      let tokenId = 'Unknown';
      if (transferEvent) {
        const parsed = reputationSBT.interface.parseLog(transferEvent);
        tokenId = parsed?.args[2]?.toString() || 'Unknown';
      }

      toast({
        title: "Achievement SBT Minted! 🏆",
        description: `Your "${achievementData.name}" Soul-Bound Token has been created!`
      });

      return tokenId;

    } catch (error: any) {
      console.error('Error minting achievement SBT:', error);
      toast({
        title: "Minting Failed",
        description: error.message || "Failed to mint achievement SBT",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [reputationSBT, isReady, toast]);

  // Get all user's SBTs with metadata
  const fetchUserSBTs = useCallback(async (userAddress?: string): Promise<UserSBT[]> => {
    const targetAddress = userAddress || address;
    if (!reputationSBT || !targetAddress || !isReady) return [];

    try {
      const balance = await reputationSBT.balanceOf(targetAddress);
      const sbtCount = Number(balance);
      
      const sbts: UserSBT[] = [];
      
      // Note: This is a simplified approach. In a real implementation,
      // you'd need to track token IDs properly or use events
      for (let i = 1; i <= sbtCount; i++) {
        try {
          const owner = await reputationSBT.ownerOf(i);
          if (owner.toLowerCase() === targetAddress.toLowerCase()) {
            const tokenURI = await reputationSBT.tokenURI(i);
            
            sbts.push({
              tokenId: i.toString(),
              tokenURI,
              // Metadata would be fetched from IPFS in a real implementation
            });
          }
        } catch (error) {
          // Token might not exist, continue
          continue;
        }
      }

      setUserSBTs(sbts);
      return sbts;

    } catch (error) {
      console.error('Error fetching user SBTs:', error);
      return [];
    }
  }, [reputationSBT, address, isReady]);

  // Check if user owns a specific achievement
  const hasAchievement = useCallback(async (
    achievementId: string,
    userAddress?: string
  ): Promise<boolean> => {
    const targetAddress = userAddress || address;
    if (!targetAddress) return false;

    const sbts = await fetchUserSBTs(targetAddress);
    
    // This would require fetching and parsing metadata from IPFS
    // For now, we'll use a simplified check
    return sbts.length > 0; // Placeholder implementation
  }, [address, fetchUserSBTs]);

  // Get SBT metadata from IPFS
  const getSBTMetadata = useCallback(async (tokenURI: string): Promise<AchievementMetadata | null> => {
    try {
      if (tokenURI.startsWith('ipfs://')) {
        const hash = tokenURI.replace('ipfs://', '');
        // In a real implementation, you'd fetch from IPFS gateway
        // const response = await fetch(`https://ipfs.io/ipfs/${hash}`);
        // return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching SBT metadata:', error);
      return null;
    }
  }, []);

  return {
    loading,
    userSBTs,
    mintAchievementSBT,
    fetchUserSBTs,
    hasAchievement,
    getSBTMetadata
  };
};
