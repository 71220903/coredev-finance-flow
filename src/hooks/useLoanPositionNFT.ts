
import { useState, useCallback } from 'react';
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

  const getLoanPositionContract = useCallback(() => {
    if (!signer || !isConnected) return null;
    return new ethers.Contract(CONTRACTS.LOAN_POSITION_NFT, LOAN_POSITION_NFT, signer);
  }, [signer, isConnected]);

  const fetchUserPositions = useCallback(async () => {
    if (!address || !provider) return [];

    setLoading(true);
    try {
      const contract = getLoanPositionContract();
      if (!contract) return [];

      const balance = await contract.balanceOf(address);
      const userPositions: LoanPosition[] = [];

      // Note: This is a simplified approach. In a real implementation,
      // you'd need to track tokenIds more efficiently (events, subgraph, etc.)
      for (let i = 0; i < Number(balance); i++) {
        try {
          // This would need proper token enumeration in the contract
          // For now, we'll use a mock approach
          const tokenId = i + 1;
          const position = await contract.positions(tokenId);
          
          userPositions.push({
            tokenId,
            marketAddress: position.marketAddress,
            principalAmount: Number(ethers.formatUnits(position.principalAmount, 6))
          });
        } catch (error) {
          // Token might not exist or not owned by user
          continue;
        }
      }

      setPositions(userPositions);
      return userPositions;
    } catch (error) {
      console.error('Error fetching loan positions:', error);
      return [];
    } finally {
      setLoading(false);
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
      const tx = await contract.burnPosition(tokenId);
      await tx.wait();
      
      toast({
        title: "Position Burned",
        description: `Loan position NFT #${tokenId} has been burned`
      });
      
      // Refresh positions
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
