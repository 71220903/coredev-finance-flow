
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

  // Enhanced admin role check with multiple methods
  const checkAdminRole = useCallback(async (): Promise<boolean> => {
    if (!address || !marketFactory || !isReady) {
      console.log('Admin role check failed - missing requirements');
      return false;
    }

    try {
      console.log('Checking admin role for:', address);

      // Method 1: Check DEFAULT_ADMIN_ROLE (0x00)
      try {
        const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
        const hasAdminRole = await marketFactory.hasRole(DEFAULT_ADMIN_ROLE, address);
        console.log('Admin role check via DEFAULT_ADMIN_ROLE (0x00):', hasAdminRole);
        if (hasAdminRole) return true;
      } catch (error) {
        console.log('DEFAULT_ADMIN_ROLE not available:', error);
      }

      // Method 2: Check owner
      try {
        const owner = await marketFactory.owner();
        const isOwner = owner.toLowerCase() === address.toLowerCase();
        console.log('Admin role check via owner:', { owner, address, isOwner });
        if (isOwner) return true;
      } catch (error) {
        console.log('Owner method not available:', error);
      }

      // Method 3: Check ADMIN_ROLE if available
      try {
        const ADMIN_ROLE = await marketFactory.ADMIN_ROLE();
        const hasAdminRole = await marketFactory.hasRole(ADMIN_ROLE, address);
        console.log('Admin role check via ADMIN_ROLE:', hasAdminRole);
        if (hasAdminRole) return true;
      } catch (error) {
        console.log('ADMIN_ROLE not available:', error);
      }

      // Method 4: Check deployer if available
      try {
        const deployer = await marketFactory.getDeployer();
        const isDeployer = deployer.toLowerCase() === address.toLowerCase();
        console.log('Admin role check via deployer:', isDeployer);
        if (isDeployer) return true;
      } catch (error) {
        console.log('Deployer method not available:', error);
      }

      return false;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }, [address, marketFactory, isReady]);

  // Pause the platform
  const pausePlatform = useCallback(async (): Promise<boolean> => {
    if (!marketFactory || !isReady) {
      console.log('Cannot pause - contract not ready');
      return false;
    }

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
      console.log('Attempting to pause platform...');

      const tx = await marketFactory.pause();
      console.log('Pause transaction submitted:', tx.hash);
      
      toast({
        title: "Pausing Platform...",
        description: "Platform access is being restricted"
      });

      await tx.wait();
      console.log('Platform paused successfully');

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
    if (!marketFactory || !isReady) {
      console.log('Cannot unpause - contract not ready');
      return false;
    }

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
      console.log('Attempting to unpause platform...');

      const tx = await marketFactory.unpause();
      console.log('Unpause transaction submitted:', tx.hash);
      
      toast({
        title: "Resuming Platform...",
        description: "Platform access is being restored"
      });

      await tx.wait();
      console.log('Platform unpaused successfully');

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

  // Grant developer role with proper ABI method
  const grantDeveloperRole = useCallback(async (userAddress: string): Promise<boolean> => {
    if (!marketFactory || !isReady) {
      console.log('Cannot grant role - contract not ready');
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
      console.log('Attempting to grant developer role to:', userAddress);

      // Try different methods to grant developer role
      let tx;
      try {
        // Method 1: Use grantDeveloperRole if available
        tx = await marketFactory.grantDeveloperRole(userAddress);
      } catch (error) {
        console.log('grantDeveloperRole not available, trying grantRole...');
        // Method 2: Use grantRole with DEVELOPER_ROLE
        try {
          const DEVELOPER_ROLE = await marketFactory.DEVELOPER_ROLE();
          tx = await marketFactory.grantRole(DEVELOPER_ROLE, userAddress);
        } catch (roleError) {
          console.error('Both grant methods failed:', error, roleError);
          throw new Error('Developer role granting not supported by contract');
        }
      }

      console.log('Grant role transaction submitted:', tx.hash);
      
      toast({
        title: "Granting Developer Role...",
        description: `Processing role for ${userAddress.slice(0, 8)}...`
      });

      await tx.wait();
      console.log('Developer role granted successfully');

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

  // Check platform status with proper error handling
  const fetchPlatformStatus = useCallback(async () => {
    if (!marketFactory || !isReady) {
      console.log('Cannot fetch status - contracts not ready');
      return;
    }

    try {
      console.log('Fetching platform status...');
      
      // Use Promise.allSettled to handle potential method failures
      const [pausedResult, stakedResult] = await Promise.allSettled([
        marketFactory.paused(),
        stakingVault ? stakingVault.totalSupply().catch(() => '0') : Promise.resolve('0')
      ]);

      const isPaused = pausedResult.status === 'fulfilled' ? pausedResult.value : false;
      const totalStaked = stakedResult.status === 'fulfilled' ? stakedResult.value.toString() : '0';

      console.log('Platform status fetched:', { isPaused, totalStaked });

      setSystemStatus({
        isPaused,
        totalMarkets: 0, // Will be updated when we have a way to count markets
        totalStaked
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
