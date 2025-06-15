
import { useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

interface DeveloperProfileData {
  githubHandle: string;
  profileDataCID: string;
}

export const useDeveloperProfile = () => {
  const { marketFactory, isReady } = useContract();
  const { address } = useWallet();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const createProfile = async (profileData: DeveloperProfileData) => {
    if (!marketFactory || !isReady || !address) {
      toast({
        title: "Error",
        description: "Wallet not connected or contracts not ready",
        variant: "destructive"
      });
      return false;
    }

    setIsCreating(true);
    try {
      const tx = await marketFactory.createProfile(
        profileData.githubHandle,
        profileData.profileDataCID
      );
      
      await tx.wait();
      
      toast({
        title: "Profile Created",
        description: `Developer profile created for ${profileData.githubHandle}`
      });
      
      setHasProfile(true);
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error Creating Profile",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const checkProfile = async () => {
    if (!marketFactory || !address) return false;
    
    try {
      const profileAddress = await marketFactory.profileOf(address);
      const hasExistingProfile = profileAddress !== ethers.ZeroAddress;
      setHasProfile(hasExistingProfile);
      return hasExistingProfile;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  return {
    createProfile,
    checkProfile,
    hasProfile,
    isCreating
  };
};
