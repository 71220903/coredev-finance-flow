
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
      return {};
    }

    return {
      marketFactory: new ethers.Contract(
        CONTRACTS.MARKET_FACTORY,
        MARKET_FACTORY_ABI,
        signer
      ),
      stakingVault: new ethers.Contract(
        CONTRACTS.STAKING_VAULT,
        STAKING_VAULT_ABI,
        signer
      ),
      reputationSBT: new ethers.Contract(
        CONTRACTS.REPUTATION_SBT,
        REPUTATION_SBT_ABI,
        signer
      ),
      sUSDT: new ethers.Contract(
        CONTRACTS.TESTNET_SUSDT,
        SUSDT_ABI,
        signer
      )
    };
  }, [provider, signer, isConnected]);

  const getMarketContract = (marketAddress: string) => {
    if (!signer || !isConnected) return null;
    
    return new ethers.Contract(marketAddress, MARKET_ABI, signer);
  };

  const getDeveloperProfileContract = (profileAddress: string) => {
    if (!signer || !isConnected) return null;
    
    return new ethers.Contract(profileAddress, DEVELOPER_PROFILE_ABI, signer);
  };

  const getReadOnlyContract = (contractName: keyof typeof CONTRACTS, abi: any[]) => {
    if (!provider) return null;

    return new ethers.Contract(
      CONTRACTS[contractName],
      abi,
      provider
    );
  };

  return {
    ...contracts,
    provider,
    getMarketContract,
    getDeveloperProfileContract,
    getReadOnlyContract,
    isReady: isConnected && !!provider && !!signer
  };
};
