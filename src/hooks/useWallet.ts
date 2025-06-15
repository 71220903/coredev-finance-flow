
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CORE_TESTNET_CONFIG } from '@/config/contracts';
import { useToast } from '@/hooks/use-toast';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  balance: string;
}

export const useWallet = () => {
  const { toast } = useToast();
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    provider: null,
    signer: null,
    chainId: null,
    balance: '0'
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) {
      console.log('No ethereum provider found');
      return;
    }

    try {
      console.log('Checking wallet connection...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        console.log('Wallet already connected, getting signer...');
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(address);

        console.log('Wallet connected:', {
          address,
          chainId: Number(network.chainId),
          balance: ethers.formatEther(balance)
        });

        setWalletState({
          address,
          isConnected: true,
          provider,
          signer,
          chainId: Number(network.chainId),
          balance: ethers.formatEther(balance)
        });
      } else {
        console.log('No accounts connected');
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);

    try {
      console.log('Requesting account access...');
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      console.log('Wallet connected successfully:', {
        address,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance)
      });

      setWalletState({
        address,
        isConnected: true,
        provider,
        signer,
        chainId: Number(network.chainId),
        balance: ethers.formatEther(balance)
      });

      // Check if we're on the correct network
      if (Number(network.chainId) !== CORE_TESTNET_CONFIG.chainId) {
        console.log('Wrong network detected, switching to Core Testnet...');
        await switchToCore();
      }

      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
      });

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToCore = async () => {
    if (!window.ethereum) return;

    try {
      console.log('Switching to Core Testnet...');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CORE_TESTNET_CONFIG.chainId.toString(16)}` }],
      });
      console.log('Successfully switched to Core Testnet');
    } catch (switchError: any) {
      console.log('Switch error, attempting to add network...', switchError);
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${CORE_TESTNET_CONFIG.chainId.toString(16)}`,
              chainName: CORE_TESTNET_CONFIG.chainName,
              rpcUrls: [CORE_TESTNET_CONFIG.rpcUrl],
              nativeCurrency: CORE_TESTNET_CONFIG.nativeCurrency,
              blockExplorerUrls: [CORE_TESTNET_CONFIG.blockExplorer]
            }],
          });
          console.log('Successfully added Core Testnet to wallet');
        } catch (addError) {
          console.error('Error adding Core network:', addError);
          toast({
            title: "Network Error",
            description: "Failed to add Core Testnet to wallet",
            variant: "destructive"
          });
        }
      }
    }
  };

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...');
    setWalletState({
      address: null,
      isConnected: false,
      provider: null,
      signer: null,
      chainId: null,
      balance: '0'
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected"
    });
  };

  const handleAccountsChanged = (accounts: string[]) => {
    console.log('Accounts changed:', accounts);
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      checkConnection();
    }
  };

  const handleChainChanged = (chainId: string) => {
    console.log('Chain changed:', chainId);
    window.location.reload();
  };

  const updateBalance = useCallback(async () => {
    if (walletState.provider && walletState.address) {
      try {
        console.log('Updating balance...');
        const balance = await walletState.provider.getBalance(walletState.address);
        setWalletState(prev => ({
          ...prev,
          balance: ethers.formatEther(balance)
        }));
        console.log('Balance updated:', ethers.formatEther(balance));
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    }
  }, [walletState.provider, walletState.address]);

  const isOnCorrectNetwork = walletState.chainId === CORE_TESTNET_CONFIG.chainId;

  return {
    ...walletState,
    isConnecting,
    isOnCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToCore,
    updateBalance
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
