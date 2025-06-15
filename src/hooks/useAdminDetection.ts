
import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useContract } from '@/hooks/useContract';

export const useAdminDetection = () => {
  const { address, isConnected } = useWallet();
  const { setIsAdmin } = useUserRole();
  const { marketFactory, isReady } = useContract();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isConnected || !address || !marketFactory || !isReady) {
        console.log('Admin check skipped - requirements not met:', { 
          isConnected, 
          address: !!address, 
          marketFactory: !!marketFactory, 
          isReady 
        });
        setIsAdmin(false);
        return;
      }

      try {
        console.log('Checking admin status for address:', address);
        
        // Method 1: Check if address has DEFAULT_ADMIN_ROLE (0x00)
        try {
          const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
          const hasAdminRole = await marketFactory.hasRole(DEFAULT_ADMIN_ROLE, address);
          console.log('DEFAULT_ADMIN_ROLE check (0x00):', { hasAdminRole });
          
          if (hasAdminRole) {
            setIsAdmin(true);
            console.log('✅ Admin role confirmed via DEFAULT_ADMIN_ROLE');
            return;
          }
        } catch (error) {
          console.log('DEFAULT_ADMIN_ROLE method failed:', error);
        }

        // Method 2: Check if address is the owner using Ownable pattern
        try {
          const owner = await marketFactory.owner();
          const isOwner = owner.toLowerCase() === address.toLowerCase();
          console.log('Owner check:', { owner, address, isOwner });
          
          if (isOwner) {
            setIsAdmin(true);
            console.log('✅ Admin role confirmed via owner check');
            return;
          }
        } catch (error) {
          console.log('Owner method failed:', error);
        }

        // Method 3: Check ADMIN_ROLE if it exists
        try {
          const ADMIN_ROLE = await marketFactory.ADMIN_ROLE();
          const hasAdminRole = await marketFactory.hasRole(ADMIN_ROLE, address);
          console.log('ADMIN_ROLE check:', { ADMIN_ROLE, hasAdminRole });
          
          if (hasAdminRole) {
            setIsAdmin(true);
            console.log('✅ Admin role confirmed via ADMIN_ROLE');
            return;
          }
        } catch (error) {
          console.log('ADMIN_ROLE method not available:', error);
        }

        // Method 4: Check if deployer (first check if getDeployer exists)
        try {
          const deployer = await marketFactory.getDeployer();
          const isDeployer = deployer.toLowerCase() === address.toLowerCase();
          console.log('Deployer check:', { deployer, address, isDeployer });
          
          if (isDeployer) {
            setIsAdmin(true);
            console.log('✅ Admin role confirmed via deployer check');
            return;
          }
        } catch (error) {
          console.log('Deployer method not available:', error);
        }

        // If none of the methods work, set admin to false
        console.log('❌ No admin role found for address:', address);
        setIsAdmin(false);

      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    // Add a small delay to ensure contracts are fully loaded
    const timeoutId = setTimeout(checkAdminStatus, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [address, isConnected, marketFactory, isReady, setIsAdmin]);
};
