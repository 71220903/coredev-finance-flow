
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const fetchingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const fetchMarketDetails = useCallback(async (marketAddress: string): Promise<MarketData | null> => {
    try {
      const marketContract = getMarketContract(marketAddress);
      if (!marketContract) {
        console.log('Market contract not available for:', marketAddress);
        return null;
      }

      console.log('Fetching market details for:', marketAddress);

      // Use Promise.allSettled to handle individual failures
      const results = await Promise.allSettled([
        marketContract.borrower(),
        marketContract.loanAmount(),
        marketContract.interestRateBps(),
        marketContract.tenorSeconds(),
        marketContract.totalDeposited(),
        marketContract.currentState(),
        marketContract.projectDataCID()
      ]);

      // Check if any critical calls failed
      const [borrowerResult, loanAmountResult, interestRateResult, tenorResult, totalDepositedResult, currentStateResult, projectDataResult] = results;

      if (borrowerResult.status === 'rejected' || loanAmountResult.status === 'rejected') {
        console.error('Critical market data fetch failed for:', marketAddress);
        return null;
      }

      const borrower = borrowerResult.value;
      const loanAmount = loanAmountResult.value;
      const interestRateBps = interestRateResult.status === 'fulfilled' ? interestRateResult.value : 0;
      const tenorSeconds = tenorResult.status === 'fulfilled' ? tenorResult.value : 0;
      const totalDeposited = totalDepositedResult.status === 'fulfilled' ? totalDepositedResult.value : 0;
      const currentState = currentStateResult.status === 'fulfilled' ? currentStateResult.value : 0;
      const projectDataCID = projectDataResult.status === 'fulfilled' ? projectDataResult.value : '';

      // Fetch project data from IPFS with timeout
      let projectData;
      try {
        if (projectDataCID) {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('IPFS timeout')), 5000)
          );
          
          projectData = await Promise.race([
            ipfsService.fetchFromIPFS(projectDataCID),
            timeoutPromise
          ]);
        }
      } catch (ipfsError) {
        console.warn('Failed to fetch project data from IPFS:', ipfsError);
        // Continue without IPFS data rather than failing
      }

      return {
        id: marketAddress,
        contractAddress: marketAddress,
        borrower,
        loanAmount: ethers.formatUnits(loanAmount, 6),
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
      console.error('Error fetching market details for', marketAddress, ':', error);
      return null;
    }
  }, [getMarketContract]);

  const fetchAllMarkets = useCallback(async () => {
    if (!marketFactory || !isReady || fetchingRef.current) {
      console.log('Skipping fetch - conditions not met:', { marketFactory: !!marketFactory, isReady, fetching: fetchingRef.current });
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log('Starting to fetch all markets...');

      // Get market count first to avoid infinite loop
      let marketCount = 0;
      try {
        // Try to get market count if available
        marketCount = await marketFactory.getMarketCount();
        console.log('Market count:', marketCount);
      } catch (error) {
        console.log('No getMarketCount function, using fallback method');
        // Fallback: try to estimate by querying with limited attempts
        const maxAttempts = 50; // Reasonable limit to prevent infinite loops
        
        for (let i = 0; i < maxAttempts; i++) {
          try {
            await marketFactory.allMarkets(i);
            marketCount = i + 1;
          } catch (error) {
            break; // End of array reached
          }
        }
      }

      console.log(`Found ${marketCount} markets to fetch`);

      if (marketCount === 0) {
        setMarkets([]);
        return;
      }

      // Fetch market addresses with controlled concurrency
      const marketAddresses: string[] = [];
      const batchSize = 5; // Process in batches to avoid overwhelming the RPC

      for (let i = 0; i < marketCount; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, marketCount); j++) {
          batch.push(marketFactory.allMarkets(j));
        }

        try {
          const batchResults = await Promise.allSettled(batch);
          batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              marketAddresses.push(result.value);
            } else {
              console.warn(`Failed to fetch market address at index ${i + index}:`, result.reason);
            }
          });
        } catch (error) {
          console.error('Error fetching market addresses batch:', error);
        }

        // Small delay between batches to prevent rate limiting
        if (i + batchSize < marketCount) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      console.log(`Fetched ${marketAddresses.length} market addresses`);

      // Fetch details for each market with controlled concurrency
      const marketPromises = marketAddresses.map(address => fetchMarketDetails(address));
      const marketResults = await Promise.allSettled(marketPromises);
      
      const validMarkets = marketResults
        .filter((result): result is PromiseFulfilledResult<MarketData> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      console.log(`Successfully processed ${validMarkets.length} valid markets`);
      setMarkets(validMarkets);
      retryCountRef.current = 0; // Reset retry count on success

    } catch (error: any) {
      console.error('Error fetching markets:', error);
      
      retryCountRef.current++;
      if (retryCountRef.current <= maxRetries) {
        console.log(`Retrying fetch (attempt ${retryCountRef.current}/${maxRetries})...`);
        // Exponential backoff
        setTimeout(() => {
          fetchingRef.current = false;
          fetchAllMarkets();
        }, Math.pow(2, retryCountRef.current) * 1000);
        return;
      }

      setError(error.message || 'Failed to fetch markets');
      toast({
        title: "Error",
        description: "Failed to fetch market data. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [marketFactory, isReady, fetchMarketDetails, toast]);

  const refreshMarket = useCallback(async (marketAddress: string) => {
    try {
      const updatedMarket = await fetchMarketDetails(marketAddress);
      if (updatedMarket) {
        setMarkets(prev => prev.map(market => 
          market.contractAddress === marketAddress ? updatedMarket : market
        ));
      }
    } catch (error) {
      console.error('Error refreshing market:', error);
    }
  }, [fetchMarketDetails]);

  // Stable effect that only runs when necessary
  useEffect(() => {
    if (isReady && marketFactory && !fetchingRef.current) {
      console.log('Effect triggered - fetching markets');
      fetchAllMarkets();
    }
  }, [isReady, !!marketFactory]); // Only depend on boolean values to prevent loops

  return {
    markets,
    loading,
    error,
    refreshMarket,
    refetchMarkets: fetchAllMarkets
  };
};
