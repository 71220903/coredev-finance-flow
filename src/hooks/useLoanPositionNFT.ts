
import { useState, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import { useToast } from '@/hooks/use-toast';
import { CONTRACTS, LOAN_POSITION_NFT } from '@/config/contracts';

interface LoanPosition {
  tokenId: number;
  marketAddress: string;
  principalAmount: number;
}

export const useLoanPositionNFT = () => {
  const { provider, signer, address, isConnected } = useWallet();
  const { toast } = useToast();
  const [positions, setPositions] = useState<LoanPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);

  const getLoanPositionContract = useCallback(() => {
    if (!signer || !isConnected) {
      console.log('No signer or not connected for loan position contract');
      return null;
    }
    try {
      return new ethers.Contract(CONTRACTS.LOAN_POSITION_NFT, LOAN_POSITION_NFT, signer);
    } catch (error) {
      console.error('Error creating loan position contract:', error);
      return null;
    }
  }, [signer, isConnected]);

  const fetchUserPositions = useCallback(async () => {
    if (!address || !provider || fetchingRef.current) {
      console.log('Skipping NFT fetch - conditions not met');
      return [];
    }

    fetchingRef.current = true;
    setLoading(true);
    
    try {
      console.log('Fetching user NFT positions...');
      
      const contract = getLoanPositionContract();
      if (!contract) {
        console.log('No loan position contract available');
        return [];
      }

      // First try to get balance with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Balance fetch timeout')), 5000)
      );

      let balance;
      try {
        balance = await Promise.race([contract.balanceOf(address), timeoutPromise]);
        console.log('User NFT balance:', balance.toString());
      } catch (error) {
        console.error('Error getting NFT balance:', error);
        return [];
      }

      const balanceNumber = Number(balance);
      if (balanceNumber === 0) {
        console.log('User has no NFT positions');
        setPositions([]);
        return [];
      }

      const userPositions: LoanPosition[] = [];
      
      // Try to fetch positions with limited attempts to prevent infinite loops
      const maxAttempts = Math.min(balanceNumber, 20); // Cap at reasonable number
      
      for (let i = 0; i < maxAttempts; i++) {
        try {
          // This is a simplified approach - in production you'd use tokenOfOwnerByIndex
          const tokenId = i + 1;
          const position = await contract.positions(tokenId);
          
          // Verify this position belongs to the user
          const owner = await contract.ownerOf(tokenId);
          if (owner.toLowerCase() === address.toLowerCase()) {
            userPositions.push({
              tokenId,
              marketAddress: position.marketAddress,
              principalAmount: Number(ethers.formatUnits(position.principalAmount, 6))
            });
          }
        } catch (error) {
          // Token might not exist or not owned by user - this is expected
          console.log(`Token ${i + 1} not found or not owned by user`);
          continue;
        }
      }

      console.log(`Found ${userPositions.length} NFT positions for user`);
      setPositions(userPositions);
      return userPositions;
      
    } catch (error) {
      console.error('Error fetching loan positions:', error);
      return [];
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [address, provider, getLoanPositionContract]);

  const burnPosition = async (tokenId: number) => {
    const contract = getLoanPositionContract();
    if (!contract) {
      toast({
        title: "Error",
        description: "Contract not available",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Burning position NFT:', tokenId);
      const tx = await contract.burnPosition(tokenId);
      await tx.wait();
      
      toast({
        title: "Position Burned",
        description: `Loan position NFT #${tokenId} has been burned`
      });
      
      // Refresh positions after burn
      await fetchUserPositions();
      return true;
    } catch (error) {
      console.error('Error burning position:', error);
      toast({
        title: "Error Burning Position",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    positions,
    loading,
    fetchUserPositions,
    burnPosition
  };
};
