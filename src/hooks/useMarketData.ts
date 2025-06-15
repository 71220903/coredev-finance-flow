
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { ipfsService } from '@/services/ipfs';
import { useToast } from '@/hooks/use-toast';

export interface MarketData {
  id: string;
  contractAddress: string;
  borrower: string;
  loanAmount: string;
  interestRateBps: number;
  tenorSeconds: number;
  totalDeposited: string;
  currentState: number;
  projectDataCID: string;
  projectData?: {
    title: string;
    description: string;
    tags: string[];
    githubRepo?: string;
  };
  borrowerProfile?: {
    name: string;
    githubHandle: string;
    avatar: string;
    trustScore: number;
  };
}

export const useMarketData = () => {
  const { marketFactory, getMarketContract, isReady } = useContract();
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMarketDetails = useCallback(async (marketAddress: string): Promise<MarketData | null> => {
    try {
      const marketContract = getMarketContract(marketAddress);
      if (!marketContract) return null;

      const [
        borrower,
        loanAmount,
        interestRateBps,
        tenorSeconds,
        totalDeposited,
        currentState,
        projectDataCID
      ] = await Promise.all([
        marketContract.borrower(),
        marketContract.loanAmount(),
        marketContract.interestRateBps(),
        marketContract.tenorSeconds(),
        marketContract.totalDeposited(),
        marketContract.currentState(),
        marketContract.projectDataCID()
      ]);

      // Fetch project data from IPFS
      let projectData;
      try {
        if (projectDataCID) {
          projectData = await ipfsService.fetchFromIPFS(projectDataCID);
        }
      } catch (ipfsError) {
        console.warn('Failed to fetch project data from IPFS:', ipfsError);
      }

      return {
        id: marketAddress,
        contractAddress: marketAddress,
        borrower,
        loanAmount: ethers.formatUnits(loanAmount, 6), // sUSDT has 6 decimals
        interestRateBps: Number(interestRateBps),
        tenorSeconds: Number(tenorSeconds),
        totalDeposited: ethers.formatUnits(totalDeposited, 6),
        currentState: Number(currentState),
        projectDataCID,
        projectData,
        borrowerProfile: {
          name: projectData?.borrowerName || 'Unknown',
          githubHandle: projectData?.githubHandle || '@unknown',
          avatar: projectData?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          trustScore: projectData?.trustScore || 50
        }
      };
    } catch (error) {
      console.error('Error fetching market details:', error);
      return null;
    }
  }, [getMarketContract]);

  const fetchAllMarkets = useCallback(async () => {
    if (!marketFactory || !isReady) return;

    setLoading(true);
    setError(null);

    try {
      // Get all market addresses
      const marketAddresses: string[] = [];
      let index = 0;
      
      while (true) {
        try {
          const marketAddress = await marketFactory.allMarkets(index);
          marketAddresses.push(marketAddress);
          index++;
        } catch (error) {
          // Break when we reach the end of the array
          break;
        }
      }

      console.log(`Found ${marketAddresses.length} markets`);

      // Fetch details for each market
      const marketPromises = marketAddresses.map(fetchMarketDetails);
      const marketResults = await Promise.all(marketPromises);
      
      const validMarkets = marketResults.filter((market): market is MarketData => market !== null);
      setMarkets(validMarkets);

    } catch (error: any) {
      console.error('Error fetching markets:', error);
      setError(error.message || 'Failed to fetch markets');
      toast({
        title: "Error",
        description: "Failed to fetch market data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [marketFactory, isReady, fetchMarketDetails, toast]);

  const refreshMarket = useCallback(async (marketAddress: string) => {
    const updatedMarket = await fetchMarketDetails(marketAddress);
    if (updatedMarket) {
      setMarkets(prev => prev.map(market => 
        market.contractAddress === marketAddress ? updatedMarket : market
      ));
    }
  }, [fetchMarketDetails]);

  useEffect(() => {
    fetchAllMarkets();
  }, [fetchAllMarkets]);

  return {
    markets,
    loading,
    error,
    refreshMarket,
    refetchMarkets: fetchAllMarkets
  };
};
