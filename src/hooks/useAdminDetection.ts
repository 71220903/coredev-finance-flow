
import { useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useUserRole } from '@/contexts/UserRoleContext';
import { CORE_TESTNET_CONFIG } from '@/config/contracts';

export const useAdminDetection = () => {
  const { address, isConnected } = useWallet();
  const { setIsAdmin } = useUserRole();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isConnected || !address) {
        setIsAdmin(false);
        return;
      }

      try {
        // In a real implementation, you would check if the connected address
        // is the owner of the MarketFactory contract
        // For now, we'll use a placeholder admin address from config
        const isAdminAddress = address.toLowerCase() === CORE_TESTNET_CONFIG.adminAddress?.toLowerCase();
        setIsAdmin(isAdminAddress);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [address, isConnected, setIsAdmin]);
};
