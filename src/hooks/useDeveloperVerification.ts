
import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { CONTRACTS, MARKET_FACTORY_ABI } from '@/config/contracts';
import { useToast } from '@/hooks/use-toast';

interface DeveloperProfile {
  profileAddress: string | null;
  hasProfile: boolean;
  hasDeveloperRole: boolean;
  isVerified: boolean;
  isLoading: boolean;
}

export const useDeveloperVerification = () => {
  const { toast } = useToast();
  const { address, isConnected, isOnCorrectNetwork } = useWallet();
  const { marketFactory } = useContract();
  
  const [profileData, setProfileData] = useState<DeveloperProfile>({
    profileAddress: null,
    hasProfile: false,
    hasDeveloperRole: false,
    isVerified: false,
    isLoading: false
  });

  // Check developer profile and role
  const checkDeveloperStatus = async () => {
    if (!address || !isConnected || !isOnCorrectNetwork) {
      setProfileData({
        profileAddress: null,
        hasProfile: false,
        hasDeveloperRole: false,
        isVerified: false,
        isLoading: false
      });
      return;
    }

    setProfileData(prev => ({ ...prev, isLoading: true }));

    try {
      if (!marketFactory) {
        throw new Error('Market factory contract not available');
      }

      // Check if user has a profile
      const profileAddress = await marketFactory.profileOf(address);
      const hasProfile = profileAddress !== '0x0000000000000000000000000000000000000000';
      
      // Check if user has developer role
      const developerRole = await marketFactory.DEVELOPER_ROLE();
      const hasDeveloperRole = await marketFactory.hasRole(developerRole, address);
      
      const isVerified = hasProfile && hasDeveloperRole;

      setProfileData({
        profileAddress: hasProfile ? profileAddress : null,
        hasProfile,
        hasDeveloperRole,
        isVerified,
        isLoading: false
      });

      console.log('Developer verification status:', {
        address,
        profileAddress,
        hasProfile,
        hasDeveloperRole,
        isVerified
      });

    } catch (error: any) {
      console.error('Error checking developer status:', error);
      setProfileData(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Verification Error",
        description: "Failed to verify developer status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Create developer profile
  const createProfile = async (githubHandle: string, profileDataCID: string) => {
    if (!address || !isOnCorrectNetwork) {
      toast({
        title: "Connection Required",
        description: "Please connect your wallet to Core Testnet",
        variant: "destructive"
      });
      return false;
    }

    try {
      if (!marketFactory) {
        throw new Error('Market factory contract not available');
      }

      console.log('Creating profile:', { githubHandle, profileDataCID });
      
      const tx = await marketFactory.createProfile(githubHandle, profileDataCID);
      
      toast({
        title: "Transaction Submitted",
        description: "Creating your developer profile..."
      });

      await tx.wait();
      
      toast({
        title: "Profile Created!",
        description: "Your developer profile has been created successfully."
      });

      // Refresh verification status
      await checkDeveloperStatus();
      
      return true;
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Profile Creation Failed",
        description: error.message || "Failed to create developer profile",
        variant: "destructive"
      });
      return false;
    }
  };

  // Auto-check when wallet connection changes
  useEffect(() => {
    checkDeveloperStatus();
  }, [address, isConnected, isOnCorrectNetwork]);

  return {
    ...profileData,
    createProfile,
    refreshStatus: checkDeveloperStatus
  };
};
