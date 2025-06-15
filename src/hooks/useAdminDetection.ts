
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
        console.log('Admin check skipped - requirements not met:', { isConnected, address: !!address, marketFactory: !!marketFactory, isReady });
        setIsAdmin(false);
        return;
      }

      try {
        console.log('Checking admin status for address:', address);
        
        // Method 1: Check if address has DEFAULT_ADMIN_ROLE
        try {
          const DEFAULT_ADMIN_ROLE = await marketFactory.DEFAULT_ADMIN_ROLE();
          const hasAdminRole = await marketFactory.hasRole(DEFAULT_ADMIN_ROLE, address);
          console.log('DEFAULT_ADMIN_ROLE check:', { DEFAULT_ADMIN_ROLE, hasAdminRole });
          
          if (hasAdminRole) {
            setIsAdmin(true);
            console.log('✅ Admin role confirmed via DEFAULT_ADMIN_ROLE');
            return;
          }
        } catch (error) {
          console.log('DEFAULT_ADMIN_ROLE method not available:', error);
        }

        // Method 2: Check if address is the owner
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
          console.log('Owner method not available:', error);
        }

        // Method 3: Check PAUSER_ROLE (admin usually has this)
        try {
          const PAUSER_ROLE = await marketFactory.PAUSER_ROLE();
          const hasPauserRole = await marketFactory.hasRole(PAUSER_ROLE, address);
          console.log('PAUSER_ROLE check:', { PAUSER_ROLE, hasPauserRole });
          
          if (hasPauserRole) {
            setIsAdmin(true);
            console.log('✅ Admin role confirmed via PAUSER_ROLE');
            return;
          }
        } catch (error) {
          console.log('PAUSER_ROLE method not available:', error);
        }

        // If none of the methods work, set admin to false
        console.log('❌ No admin role found for address:', address);
        setIsAdmin(false);

      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [address, isConnected, marketFactory, isReady, setIsAdmin]);
};
