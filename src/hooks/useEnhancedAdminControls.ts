
import { useState, useCallback } from 'react';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedAdminControls = () => {
  const { toast } = useToast();
  const { address, isConnected } = useWallet();
  const { marketFactory, stakingVault, reputationSBT, isReady } = useContract();
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    isPaused: false,
    totalMarkets: 0,
    totalStaked: '0'
  });

  // Check if current user has admin role
  const checkAdminRole = useCallback(async (): Promise<boolean> => {
    if (!address || !marketFactory || !isReady) return false;

    try {
      const DEFAULT_ADMIN_ROLE = await marketFactory.DEFAULT_ADMIN_ROLE();
      const hasAdminRole = await marketFactory.hasRole(DEFAULT_ADMIN_ROLE, address);
      return hasAdminRole;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }, [address, marketFactory, isReady]);

  // Pause the platform
  const pausePlatform = useCallback(async (): Promise<boolean> => {
    if (!marketFactory || !isReady) return false;

    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admin can pause the platform",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      const tx = await marketFactory.pause();
      
      toast({
        title: "Pausing Platform...",
        description: "Platform access is being restricted"
      });

      await tx.wait();

      setSystemStatus(prev => ({ ...prev, isPaused: true }));

      toast({
        title: "Platform Paused ⏸️",
        description: "All platform operations have been suspended"
      });

      return true;

    } catch (error: any) {
      console.error('Error pausing platform:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to pause platform",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [marketFactory, isReady, checkAdminRole, toast]);

  // Unpause the platform
  const unpausePlatform = useCallback(async (): Promise<boolean> => {
    if (!marketFactory || !isReady) return false;

    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admin can unpause the platform",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);

      const tx = await marketFactory.unpause();
      
      toast({
        title: "Resuming Platform...",
        description: "Platform access is being restored"
      });

      await tx.wait();

      setSystemStatus(prev => ({ ...prev, isPaused: false }));

      toast({
        title: "Platform Resumed ▶️",
        description: "All platform operations are now active"
      });

      return true;

    } catch (error: any) {
      console.error('Error unpausing platform:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to unpause platform",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [marketFactory, isReady, checkAdminRole, toast]);

  // Grant developer role
  const grantDeveloperRole = useCallback(async (userAddress: string): Promise<boolean> => {
    if (!marketFactory || !isReady) return false;

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

      const tx = await marketFactory.grantDeveloperRole(userAddress);
      
      toast({
        title: "Granting Developer Role...",
        description: `Processing role for ${userAddress.slice(0, 8)}...`
      });

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
  }, [marketFactory, isReady, checkAdminRole, toast]);

  // Check platform status
  const fetchPlatformStatus = useCallback(async () => {
    if (!marketFactory || !stakingVault || !isReady) return;

    try {
      const [isPaused, totalStaked] = await Promise.all([
        marketFactory.paused(),
        stakingVault.totalStakedInVault()
      ]);

      setSystemStatus({
        isPaused,
        totalMarkets: 0, // Will be updated when we have a way to count markets
        totalStaked: totalStaked.toString()
      });

    } catch (error) {
      console.error('Error fetching platform status:', error);
    }
  }, [marketFactory, stakingVault, isReady]);

  // Toggle pause/unpause
  const togglePlatformPause = useCallback(async (): Promise<boolean> => {
    return systemStatus.isPaused ? await unpausePlatform() : await pausePlatform();
  }, [systemStatus.isPaused, unpausePlatform, pausePlatform]);

  return {
    loading,
    systemStatus,
    checkAdminRole,
    pausePlatform,
    unpausePlatform,
    togglePlatformPause,
    grantDeveloperRole,
    fetchPlatformStatus
  };
};
