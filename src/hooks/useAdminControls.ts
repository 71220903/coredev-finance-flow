
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  address: string;
  githubHandle: string;
  trustScore: number;
  isDeveloper: boolean;
  isWhitelisted: boolean;
  registrationDate: string;
}

interface SystemSettings {
  isPaused: boolean;
  platformFee: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  developerRoleCount: number;
  totalUsers: number;
}

export const useAdminControls = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const { marketFactory, stakingVault, reputationSBT, isReady } = useContract();
  const [loading, setLoading] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    isPaused: false,
    platformFee: 2.0,
    minLoanAmount: 1000,
    maxLoanAmount: 100000,
    developerRoleCount: 0,
    totalUsers: 0
  });

  // Check if current user is admin
  const checkAdminRole = useCallback(async (): Promise<boolean> => {
    if (!address || !marketFactory || !isReady) return false;

    try {
      // Assuming there's an admin role check function
      // For now, we'll check if the user is the owner
      const owner = await marketFactory.owner();
      return owner.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }, [address, marketFactory, isReady]);

  // Grant developer role to user
  const grantDeveloperRole = async (userAddress: string): Promise<boolean> => {
    if (!marketFactory || !isReady) {
      toast({
        title: "Contract Not Ready",
        description: "Please ensure wallet is connected and contracts are loaded",
        variant: "destructive"
      });
      return false;
    }

    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admin can grant developer roles",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      toast({
        title: "Granting Developer Role",
        description: `Granting developer role to ${userAddress.slice(0, 8)}...`
      });

      // Call the contract function to grant developer role
      const tx = await marketFactory.grantDeveloperRole(userAddress);
      await tx.wait();

      toast({
        title: "Developer Role Granted ✅",
        description: `Successfully granted developer role to ${userAddress.slice(0, 8)}...`
      });

      return true;

    } catch (error: any) {
      console.error('Error granting developer role:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to grant developer role",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Revoke developer role
  const revokeDeveloperRole = async (userAddress: string): Promise<boolean> => {
    if (!marketFactory || !isReady) return false;

    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admin can revoke developer roles",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      const tx = await marketFactory.revokeDeveloperRole(userAddress);
      await tx.wait();

      toast({
        title: "Developer Role Revoked ⚠️",
        description: `Successfully revoked developer role from ${userAddress.slice(0, 8)}...`
      });

      return true;

    } catch (error: any) {
      console.error('Error revoking developer role:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to revoke developer role",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Pause/Unpause platform
  const togglePlatformPause = async (): Promise<boolean> => {
    if (!marketFactory || !isReady) return false;

    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admin can pause/unpause the platform",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      const isPaused = systemSettings.isPaused;
      const tx = isPaused 
        ? await marketFactory.unpause()
        : await marketFactory.pause();
      
      await tx.wait();

      const newState = !isPaused;
      setSystemSettings(prev => ({ ...prev, isPaused: newState }));

      toast({
        title: `Platform ${newState ? 'Paused' : 'Unpaused'} ${newState ? '⏸️' : '▶️'}`,
        description: `Platform is now ${newState ? 'paused' : 'active'}`
      });

      return true;

    } catch (error: any) {
      console.error('Error toggling platform pause:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to toggle platform state",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update platform fee
  const updatePlatformFee = async (newFee: number): Promise<boolean> => {
    if (!marketFactory || !isReady) return false;

    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admin can update platform fee",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      // Convert percentage to basis points (e.g., 2.5% = 250 basis points)
      const feeInBasisPoints = Math.round(newFee * 100);
      const tx = await marketFactory.setPlatformFee(feeInBasisPoints);
      await tx.wait();

      setSystemSettings(prev => ({ ...prev, platformFee: newFee }));

      toast({
        title: "Platform Fee Updated ⚙️",
        description: `Platform fee set to ${newFee}%`
      });

      return true;

    } catch (error: any) {
      console.error('Error updating platform fee:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to update platform fee",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get system stats
  const fetchSystemStats = useCallback(async () => {
    if (!marketFactory || !isReady) return;

    try {
      // Fetch various system statistics
      const [isPaused, platformFee, totalMarkets] = await Promise.all([
        marketFactory.paused().catch(() => false),
        marketFactory.platformFee().catch(() => 250), // Default 2.5%
        marketFactory.totalMarkets().catch(() => 0)
      ]);

      setSystemSettings(prev => ({
        ...prev,
        isPaused,
        platformFee: Number(platformFee) / 100, // Convert basis points to percentage
        totalUsers: Number(totalMarkets) * 2 // Mock calculation
      }));

    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  }, [marketFactory, isReady]);

  return {
    systemSettings,
    loading,
    grantDeveloperRole,
    revokeDeveloperRole,
    togglePlatformPause,
    updatePlatformFee,
    checkAdminRole,
    fetchSystemStats
  };
};
