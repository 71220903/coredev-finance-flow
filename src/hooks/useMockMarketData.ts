
import { useState, useEffect, useCallback } from 'react';
import { mockMarketService, MockMarketData, getMarketStats } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

export const useMockMarketData = () => {
  const [markets, setMarkets] = useState<MockMarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllMarkets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching mock market data...');
      const marketData = await mockMarketService.getAllMarkets();
      setMarkets(marketData);
      console.log(`Loaded ${marketData.length} mock markets`);
    } catch (error: any) {
      console.error('Error fetching mock markets:', error);
      setError(error.message || 'Failed to fetch markets');
      toast({
        title: "Error",
        description: "Failed to fetch market data. Please try again.",
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
      console.log('Filtering markets with:', filters);
      const filteredData = await mockMarketService.filterMarkets(filters);
      setMarkets(filteredData);
      console.log(`Found ${filteredData.length} filtered markets`);
    } catch (error: any) {
      console.error('Error filtering markets:', error);
      setError(error.message || 'Failed to filter markets');
    } finally {
      setLoading(false);
    }
  }, []);

  const investInMarket = useCallback(async (marketId: string, amount: number) => {
    try {
      console.log(`Investing $${amount} in market ${marketId}`);
      const result = await mockMarketService.investInMarket(marketId, amount);
      
      if (result.success) {
        toast({
          title: "Investment Successful! 🎉",
          description: result.message,
        });
        // Refresh markets to show updated data
        await fetchAllMarkets();
      } else {
        toast({
          title: "Investment Failed",
          description: result.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      console.error('Error investing in market:', error);
      toast({
        title: "Investment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return { success: false, message: error.message };
    }
  }, [toast, fetchAllMarkets]);

  const refreshMarket = useCallback(async (marketId: string) => {
    try {
      console.log(`Refreshing market ${marketId}`);
      const updatedMarket = await mockMarketService.getMarketById(marketId);
      if (updatedMarket) {
        setMarkets(prev => prev.map(market => 
          market.id === marketId ? updatedMarket : market
        ));
      }
    } catch (error) {
      console.error('Error refreshing market:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllMarkets();
  }, [fetchAllMarkets]);

  // Memoized stats
  const marketStats = getMarketStats();

  return {
    markets,
    loading,
    error,
    marketStats,
    refreshMarket,
    refetchMarkets: fetchAllMarkets,
    filterMarkets,
    investInMarket
  };
};
