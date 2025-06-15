
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

  // Check if current user is admin with multiple methods
  const checkAdminRole = useCallback(async (): Promise<boolean> => {
    if (!address || !marketFactory || !isReady) {
      console.log('Admin check failed - missing requirements');
      return false;
    }

    try {
      console.log('Checking admin role for:', address);

      // Method 1: Check DEFAULT_ADMIN_ROLE
      try {
        const DEFAULT_ADMIN_ROLE = await marketFactory.DEFAULT_ADMIN_ROLE();
        const hasAdminRole = await marketFactory.hasRole(DEFAULT_ADMIN_ROLE, address);
        console.log('hasRole(DEFAULT_ADMIN_ROLE):', hasAdminRole);
        if (hasAdminRole) return true;
      } catch (error) {
        console.log('DEFAULT_ADMIN_ROLE check failed:', error);
      }

      // Method 2: Check owner
      try {
        const owner = await marketFactory.owner();
        const isOwner = owner.toLowerCase() === address.toLowerCase();
        console.log('owner check:', { owner, address, isOwner });
        if (isOwner) return true;
      } catch (error) {
        console.log('Owner check failed:', error);
      }

      // Method 3: Check PAUSER_ROLE
      try {
        const PAUSER_ROLE = await marketFactory.PAUSER_ROLE();
        const hasPauserRole = await marketFactory.hasRole(PAUSER_ROLE, address);
        console.log('hasRole(PAUSER_ROLE):', hasPauserRole);
        if (hasPauserRole) return true;
      } catch (error) {
        console.log('PAUSER_ROLE check failed:', error);
      }

      console.log('No admin role found for address:', address);
      return false;
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
      console.log('Granting developer role to:', userAddress);

      toast({
        title: "Granting Developer Role",
        description: `Granting developer role to ${userAddress.slice(0, 8)}...`
      });

      const tx = await marketFactory.grantDeveloperRole(userAddress);
      console.log('Grant role transaction:', tx.hash);
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
      console.log('Revoking developer role from:', userAddress);

      // Try different method names that might exist in the contract
      let tx;
      try {
        tx = await marketFactory.revokeDeveloperRole(userAddress);
      } catch (error) {
        // If revokeDeveloperRole doesn't exist, try revokeRole with DEVELOPER_ROLE
        const DEVELOPER_ROLE = await marketFactory.DEVELOPER_ROLE();
        tx = await marketFactory.revokeRole(DEVELOPER_ROLE, userAddress);
      }

      console.log('Revoke role transaction:', tx.hash);
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
      console.log('Toggling platform pause state...');

      const isPaused = systemSettings.isPaused;
      const tx = isPaused 
        ? await marketFactory.unpause()
        : await marketFactory.pause();
      
      console.log('Toggle pause transaction:', tx.hash);
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
      console.log('Updating platform fee to:', newFee);

      // Convert percentage to basis points (e.g., 2.5% = 250 basis points)
      const feeInBasisPoints = Math.round(newFee * 100);
      
      // Try different method names that might exist
      let tx;
      try {
        tx = await marketFactory.setPlatformFee(feeInBasisPoints);
      } catch (error) {
        // Try alternative method name
        tx = await marketFactory.updatePlatformFee(feeInBasisPoints);
      }

      console.log('Update fee transaction:', tx.hash);
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
    if (!marketFactory || !isReady) {
      console.log('Cannot fetch stats - contract not ready');
      return;
    }

    try {
      console.log('Fetching system stats...');
      
      // Fetch various system statistics with error handling for each
      const [isPausedResult, platformFeeResult, totalMarketsResult] = await Promise.allSettled([
        marketFactory.paused(),
        marketFactory.platformFee ? marketFactory.platformFee() : Promise.resolve(250),
        marketFactory.totalMarkets ? marketFactory.totalMarkets() : Promise.resolve(0)
      ]);

      const isPaused = isPausedResult.status === 'fulfilled' ? isPausedResult.value : false;
      const platformFee = platformFeeResult.status === 'fulfilled' ? Number(platformFeeResult.value) : 250;
      const totalMarkets = totalMarketsResult.status === 'fulfilled' ? Number(totalMarketsResult.value) : 0;

      console.log('System stats:', { isPaused, platformFee, totalMarkets });

      setSystemSettings(prev => ({
        ...prev,
        isPaused,
        platformFee: platformFee / 100, // Convert basis points to percentage
        totalUsers: totalMarkets * 2 // Mock calculation
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
