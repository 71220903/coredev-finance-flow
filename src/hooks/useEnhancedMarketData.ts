
import { useState, useEffect, useCallback } from 'react';
import { LoanMarket } from '@/types/market';
import { EnhancedMockDataService } from '@/services/enhancedMockData';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedMarketData = () => {
  const [markets, setMarkets] = useState<LoanMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching enhanced market data...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const enhancedMarkets = EnhancedMockDataService.generateEnhancedMarkets();
      setMarkets(enhancedMarkets);
      
      console.log(`Loaded ${enhancedMarkets.length} enhanced markets with full trust scoring`);
    } catch (error: any) {
      console.error('Error fetching enhanced markets:', error);
      setError(error.message || 'Failed to fetch markets');
      toast({
        title: "Error",
        description: "Failed to fetch enhanced market data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterMarkets = useCallback(async (filters: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Filtering enhanced markets with:', filters);
      
      const allMarkets = EnhancedMockDataService.generateEnhancedMarkets();
      
      const filteredMarkets = allMarkets.filter(market => {
        let matches = true;
        
        if (filters.query) {
          const query = filters.query.toLowerCase();
          matches = matches && (
            market.borrowerProfile.githubHandle.toLowerCase().includes(query) ||
            market.projectData.title.toLowerCase().includes(query) ||
            market.projectData.tags.some((tag: string) => tag.toLowerCase().includes(query))
          );
        }
        
        if (filters.minAmount) {
          matches = matches && market.loanAmount >= filters.minAmount;
        }
        
        if (filters.maxAmount) {
          matches = matches && market.loanAmount <= filters.maxAmount;
        }
        
        if (filters.minTrustScore) {
          matches = matches && market.borrowerProfile.trustScore >= filters.minTrustScore;
        }
        
        if (filters.riskCategory && filters.riskCategory.length > 0) {
          matches = matches && filters.riskCategory.includes(market.borrowerProfile.riskCategory);
        }
        
        if (filters.status && filters.status.length > 0) {
          const statusMap = {
            'funding': 0,
            'active': 1,
            'repaid': 2,
            'defaulted': 3
          };
          matches = matches && filters.status.some((status: string) => 
            statusMap[status as keyof typeof statusMap] === market.currentState
          );
        }
        
        return matches;
      });
      
      setMarkets(filteredMarkets);
      console.log(`Found ${filteredMarkets.length} filtered enhanced markets`);
    } catch (error: any) {
      console.error('Error filtering enhanced markets:', error);
      setError(error.message || 'Failed to filter markets');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMarket = useCallback(async (marketId: string) => {
    try {
      console.log(`Refreshing enhanced market ${marketId}`);
      // In a real implementation, this would fetch updated data from the blockchain
      // For now, we'll simulate an update
      const updatedMarkets = EnhancedMockDataService.generateEnhancedMarkets();
      const updatedMarket = updatedMarkets.find(m => m.id === marketId);
      
      if (updatedMarket) {
        setMarkets(prev => prev.map(market => 
          market.id === marketId ? updatedMarket : market
        ));
      }
    } catch (error) {
      console.error('Error refreshing enhanced market:', error);
    }
  }, []);

  // Calculate platform statistics
  const getMarketStats = useCallback(() => {
    if (markets.length === 0) {
      return {
        totalRequested: 0,
        avgInterestRate: 0,
        avgTrustScore: 0,
        successRate: 0,
        activeMarkets: 0,
        fundingMarkets: 0,
        totalStaked: 0
      };
    }

    const totalRequested = markets.reduce((sum, market) => sum + market.loanAmount, 0);
    const avgInterestRate = markets.reduce((sum, market) => sum + (market.interestRateBps / 100), 0) / markets.length;
    const avgTrustScore = markets.reduce((sum, market) => sum + market.borrowerProfile.trustScore, 0) / markets.length;
    
    const successfulLoans = markets.reduce((sum, market) => sum + market.borrowerProfile.successfulLoans, 0);
    const totalLoans = markets.reduce((sum, market) => 
      sum + market.borrowerProfile.successfulLoans + market.borrowerProfile.defaultedLoans, 0
    );
    const successRate = totalLoans > 0 ? (successfulLoans / totalLoans) * 100 : 0;
    
    const totalStaked = markets.reduce((sum, market) => sum + market.actualStaked, 0);
    
    return {
      totalRequested,
      avgInterestRate,
      avgTrustScore,
      successRate,
      activeMarkets: markets.length,
      fundingMarkets: markets.filter(m => m.currentState === 0).length,
      totalStaked
    };
  }, [markets]);

  // Initial load
  useEffect(() => {
    fetchAllMarkets();
  }, [fetchAllMarkets]);

  return {
    markets,
    loading,
    error,
    marketStats: getMarketStats(),
    refreshMarket,
    refetchMarkets: fetchAllMarkets,
    filterMarkets
  };
};
