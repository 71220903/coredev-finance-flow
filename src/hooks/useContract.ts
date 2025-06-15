
import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { 
  CONTRACTS, 
  MARKET_FACTORY_ABI, 
  STAKING_VAULT_ABI, 
  MARKET_ABI, 
  SUSDT_ABI, 
  REPUTATION_SBT_ABI,
  DEVELOPER_PROFILE_ABI
} from '@/config/contracts';

export const useContract = () => {
  const { provider, signer, isConnected } = useWallet();

  const contracts = useMemo(() => {
    if (!provider || !signer || !isConnected) {
      console.log('Contracts not ready - missing provider, signer, or connection');
      return {};
    }

    try {
      const marketFactory = new ethers.Contract(
        CONTRACTS.MARKET_FACTORY,
        MARKET_FACTORY_ABI,
        signer
      );

      const stakingVault = new ethers.Contract(
        CONTRACTS.STAKING_VAULT,
        STAKING_VAULT_ABI,
        signer
      );

      const reputationSBT = new ethers.Contract(
        CONTRACTS.REPUTATION_SBT,
        REPUTATION_SBT_ABI,
        signer
      );

      const sUSDT = new ethers.Contract(
        CONTRACTS.TESTNET_SUSDT,
        SUSDT_ABI,
        signer
      );

      console.log('Contracts initialized successfully:', {
        marketFactory: marketFactory.target,
        stakingVault: stakingVault.target,
        reputationSBT: reputationSBT.target,
        sUSDT: sUSDT.target
      });

      return {
        marketFactory,
        stakingVault,
        reputationSBT,
        sUSDT
      };
    } catch (error) {
      console.error('Error initializing contracts:', error);
      return {};
    }
  }, [provider, signer, isConnected]);

  const getMarketContract = (marketAddress: string) => {
    if (!signer || !isConnected) {
      console.log('Cannot create market contract - missing signer or connection');
      return null;
    }
    
    try {
      return new ethers.Contract(marketAddress, MARKET_ABI, signer);
    } catch (error) {
      console.error('Error creating market contract:', error);
      return null;
    }
  };

  const getDeveloperProfileContract = (profileAddress: string) => {
    if (!signer || !isConnected) {
      console.log('Cannot create developer profile contract - missing signer or connection');
      return null;
    }
    
    try {
      return new ethers.Contract(profileAddress, DEVELOPER_PROFILE_ABI, signer);
    } catch (error) {
      console.error('Error creating developer profile contract:', error);
      return null;
    }
  };

  const getReadOnlyContract = (contractName: keyof typeof CONTRACTS, abi: any[]) => {
    if (!provider) {
      console.log('Cannot create read-only contract - missing provider');
      return null;
    }

    try {
      return new ethers.Contract(
        CONTRACTS[contractName],
        abi,
        provider
      );
    } catch (error) {
      console.error('Error creating read-only contract:', error);
      return null;
    }
  };

  return {
    ...contracts,
    provider,
    getMarketContract,
    getDeveloperProfileContract,
    getReadOnlyContract,
    isReady: isConnected && !!provider && !!signer && !!contracts.marketFactory
  };
};
