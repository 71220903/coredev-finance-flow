
import { useEffect, useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';

interface NotificationEvent {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: number;
  txHash?: string;
  blockNumber?: number;
  read: boolean;
}

export const useNotificationSystem = () => {
  const { toast } = useToast();
  const { address } = useWallet();
  const { marketFactory, stakingVault, reputationSBT, provider } = useContract();
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add notification to state
  const addNotification = useCallback((notification: Omit<NotificationEvent, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationEvent = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only last 50
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.description,
      variant: notification.type === 'error' ? 'destructive' : 'default'
    });
  }, [toast]);

  // Market Factory Events
  const setupMarketFactoryListeners = useCallback(() => {
    if (!marketFactory || !provider) return;

    console.log('Setting up Market Factory event listeners...');

    const handleMarketCreated = (borrower: string, marketAddress: string, projectCID: string, event: any) => {
      console.log('Market Created Event:', { borrower, marketAddress, projectCID });
      
      addNotification({
        type: 'success',
        title: '🏗️ New Market Created',
        description: `Developer ${borrower.slice(0, 8)}... created a new funding market`,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      });
    };

    const handleDeveloperRoleGranted = (user: string, event: any) => {
      console.log('Developer Role Granted:', { user });
      
      addNotification({
        type: 'info',
        title: '👨‍💻 Developer Role Granted',
        description: `New developer role granted to ${user.slice(0, 8)}...`,
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      });
    };

    const handlePlatformPaused = (event: any) => {
      addNotification({
        type: 'warning',
        title: '⏸️ Platform Paused',
        description: 'Platform has been paused by admin',
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      });
    };

    const handlePlatformUnpaused = (event: any) => {
      addNotification({
        type: 'success',
        title: '▶️ Platform Resumed',
        description: 'Platform has been resumed by admin',
        txHash: event.transactionHash,
        blockNumber: event.blockNumber
      });
    };

    // Set up event listeners
    marketFactory.on('MarketCreated', handleMarketCreated);
    marketFactory.on('DeveloperRoleGranted', handleDeveloperRoleGranted);
    marketFactory.on('Paused', handlePlatformPaused);
    marketFactory.on('Unpaused', handlePlatformUnpaused);

    return () => {
      marketFactory.off('MarketCreated', handleMarketCreated);
      marketFactory.off('DeveloperRoleGranted', handleDeveloperRoleGranted);
      marketFactory.off('Paused', handlePlatformPaused);
      marketFactory.off('Unpaused', handlePlatformUnpaused);
    };
  }, [marketFactory, provider, addNotification]);

  // Staking Events
  const setupStakingListeners = useCallback(() => {
    if (!stakingVault || !provider || !address) return;

    console.log('Setting up Staking event listeners...');

    const handleStakeDeposited = (user: string, amount: ethers.BigNumberish, event: any) => {
      if (user.toLowerCase() === address.toLowerCase()) {
        const amountFormatted = ethers.formatEther(amount);
        addNotification({
          type: 'success',
          title: '💰 Stake Deposited',
          description: `Successfully staked ${parseFloat(amountFormatted).toFixed(4)} tokens`,
          txHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      }
    };

    const handleStakeWithdrawn = (user: string, amount: ethers.BigNumberish, event: any) => {
      if (user.toLowerCase() === address.toLowerCase()) {
        const amountFormatted = ethers.formatEther(amount);
        addNotification({
          type: 'info',
          title: '📤 Stake Withdrawn',
          description: `Withdrawn ${parseFloat(amountFormatted).toFixed(4)} tokens from staking`,
          txHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      }
    };

    const handleRewardsDistributed = (user: string, amount: ethers.BigNumberish, event: any) => {
      if (user.toLowerCase() === address.toLowerCase()) {
        const amountFormatted = ethers.formatEther(amount);
        addNotification({
          type: 'success',
          title: '🎁 Rewards Earned',
          description: `Earned ${parseFloat(amountFormatted).toFixed(4)} tokens in staking rewards`,
          txHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      }
    };

    // Note: These events would need to be added to the StakingVault contract
    stakingVault.on('StakeDeposited', handleStakeDeposited);
    stakingVault.on('StakeWithdrawn', handleStakeWithdrawn);
    stakingVault.on('RewardsDistributed', handleRewardsDistributed);

    return () => {
      stakingVault.off('StakeDeposited', handleStakeDeposited);
      stakingVault.off('StakeWithdrawn', handleStakeWithdrawn);
      stakingVault.off('RewardsDistributed', handleRewardsDistributed);
    };
  }, [stakingVault, provider, address, addNotification]);

  // SBT Events
  const setupSBTListeners = useCallback(() => {
    if (!reputationSBT || !provider || !address) return;

    console.log('Setting up SBT event listeners...');

    const handleSBTMinted = (to: string, tokenId: ethers.BigNumberish, event: any) => {
      if (to.toLowerCase() === address.toLowerCase()) {
        addNotification({
          type: 'success',
          title: '🏆 Achievement Unlocked',
          description: `New Soul-Bound Token #${tokenId.toString()} minted!`,
          txHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      }
    };

    // Listen for Transfer events where from address is zero (minting)
    const transferFilter = reputationSBT.filters.Transfer(ethers.ZeroAddress, address);
    reputationSBT.on(transferFilter, handleSBTMinted);

    return () => {
      reputationSBT.off(transferFilter, handleSBTMinted);
    };
  }, [reputationSBT, provider, address, addNotification]);

  // Transaction Status Monitoring
  const monitorTransaction = useCallback(async (txHash: string, description: string) => {
    if (!provider) return;

    try {
      addNotification({
        type: 'info',
        title: '⏳ Transaction Pending',
        description: `${description} - Waiting for confirmation...`,
        txHash
      });

      const receipt = await provider.waitForTransaction(txHash);
      
      if (receipt?.status === 1) {
        addNotification({
          type: 'success',
          title: '✅ Transaction Confirmed',
          description: `${description} completed successfully`,
          txHash,
          blockNumber: receipt.blockNumber
        });
      } else {
        addNotification({
          type: 'error',
          title: '❌ Transaction Failed',
          description: `${description} failed`,
          txHash,
          blockNumber: receipt?.blockNumber
        });
      }
    } catch (error) {
      console.error('Error monitoring transaction:', error);
      addNotification({
        type: 'error',
        title: '❌ Transaction Error',
        description: `${description} encountered an error`,
        txHash
      });
    }
  }, [provider, addNotification]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Setup all event listeners
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    const setupListeners = async () => {
      const marketCleanup = setupMarketFactoryListeners();
      const stakingCleanup = setupStakingListeners();
      const sbtCleanup = setupSBTListeners();

      if (marketCleanup) cleanupFunctions.push(marketCleanup);
      if (stakingCleanup) cleanupFunctions.push(stakingCleanup);
      if (sbtCleanup) cleanupFunctions.push(sbtCleanup);
    };

    setupListeners();

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [setupMarketFactoryListeners, setupStakingListeners, setupSBTListeners]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    monitorTransaction
  };
};
