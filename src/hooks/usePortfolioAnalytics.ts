import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useMarketData } from './useMarketData';
import { useLoanPositionNFT } from './useLoanPositionNFT';

interface LendingPosition {
  marketAddress: string;
  depositAmount: number;
  currentValue: number;
  interestEarned: number;
  status: 'active' | 'completed' | 'defaulted';
  startDate: Date;
  maturityDate?: Date;
  borrowerProfile: {
    name: string;
    trustScore: number;
  };
}

interface BorrowingPosition {
  marketAddress: string;
  borrowedAmount: number;
  interestRate: number;
  repaidAmount: number;
  remainingAmount: number;
  status: 'active' | 'completed' | 'overdue';
  startDate: Date;
  dueDate: Date;
}

interface PortfolioMetrics {
  totalLent: number;
  totalBorrowed: number;
  totalInterestEarned: number;
  totalInterestPaid: number;
  activeLendingPositions: number;
  activeBorrowingPositions: number;
  avgLendingReturn: number;
  avgBorrowingRate: number;
  trustScore: number;
  riskScore: number;
}

interface TransactionHistory {
  hash: string;
  type: 'deposit' | 'withdraw' | 'borrow' | 'repay';
  amount: number;
  marketAddress: string;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
}

export const usePortfolioAnalytics = () => {
  const { address, isConnected, provider } = useWallet();
  const { getMarketContract } = useContract();
  const { markets } = useMarketData();
  const { positions: nftPositions, fetchUserPositions } = useLoanPositionNFT();
  
  const [lendingPositions, setLendingPositions] = useState<LendingPosition[]>([]);
  const [borrowingPositions, setBorrowingPositions] = useState<BorrowingPosition[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalLent: 0,
    totalBorrowed: 0,
    totalInterestEarned: 0,
    totalInterestPaid: 0,
    activeLendingPositions: 0,
    activeBorrowingPositions: 0,
    avgLendingReturn: 0,
    avgBorrowingRate: 0,
    trustScore: 88,
    riskScore: 25
  });
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchingRef = useRef(false);

  // Stable reference for markets to prevent loops
  const stableMarkets = useMemo(() => markets, [markets.length, markets.map(m => m.id).join(',')]);
  
  // Stable reference for NFT positions
  const stableNftPositions = useMemo(() => nftPositions, [nftPositions.length, nftPositions.map(p => p.tokenId).join(',')]);

  // Enhanced lending positions fetch using NFT positions
  const fetchLendingPositions = useCallback(async (): Promise<LendingPosition[]> => {
    if (!address || !provider || stableMarkets.length === 0 || stableNftPositions.length === 0) {
      return [];
    }

    console.log('Fetching lending positions for', stableNftPositions.length, 'NFT positions');

    const positions: LendingPosition[] = [];

    try {
      for (const nftPosition of stableNftPositions) {
        const market = stableMarkets.find(m => m.contractAddress === nftPosition.marketAddress);
        if (!market) {
          console.log('Market not found for NFT position:', nftPosition.marketAddress);
          continue;
        }

        const marketContract = getMarketContract(nftPosition.marketAddress);
        if (!marketContract) {
          console.log('Market contract not available:', nftPosition.marketAddress);
          continue;
        }

        try {
          const [currentState, interestRateBps] = await Promise.allSettled([
            marketContract.currentState(),
            marketContract.interestRateBps()
          ]);

          const state = currentState.status === 'fulfilled' ? Number(currentState.value) : 0;
          const rate = interestRateBps.status === 'fulfilled' ? Number(interestRateBps.value) : 0;
          const interestRate = rate / 10000;

          let interestEarned = 0;
          let status: 'active' | 'completed' | 'defaulted' = 'active';
          let currentValue = nftPosition.principalAmount;

          if (state === 2) { // Completed
            status = 'completed';
            interestEarned = nftPosition.principalAmount * interestRate;
            currentValue = nftPosition.principalAmount + interestEarned;
          } else if (state === 1) { // Active/Funded
            status = 'active';
            // Calculate accrued interest (simplified)
            const timeElapsed = 30; // Mock days
            interestEarned = nftPosition.principalAmount * interestRate * (timeElapsed / 365);
            currentValue = nftPosition.principalAmount + interestEarned;
          }

          positions.push({
            marketAddress: nftPosition.marketAddress,
            depositAmount: nftPosition.principalAmount,
            currentValue,
            interestEarned,
            status,
            startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            maturityDate: status === 'active' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
            borrowerProfile: {
              name: market.borrowerProfile?.name || 'Unknown',
              trustScore: market.borrowerProfile?.trustScore || 50
            }
          });
        } catch (error) {
          console.error('Error processing NFT position:', nftPosition.tokenId, error);
        }
      }
    } catch (error) {
      console.error('Error fetching lending positions:', error);
    }

    console.log('Fetched', positions.length, 'lending positions');
    return positions;
  }, [address, provider, stableMarkets, stableNftPositions, getMarketContract]);

  // Fetch user's borrowing positions
  const fetchBorrowingPositions = useCallback(async (): Promise<BorrowingPosition[]> => {
    if (!address || !provider || stableMarkets.length === 0) {
      return [];
    }

    console.log('Fetching borrowing positions...');

    const positions: BorrowingPosition[] = [];

    try {
      for (const market of stableMarkets) {
        // Check if user is the borrower
        if (market.borrower.toLowerCase() === address.toLowerCase()) {
          const borrowedAmount = Number(market.loanAmount);
          const interestRate = market.interestRateBps / 10000;
          const currentState = market.currentState;

          let status: 'active' | 'completed' | 'overdue' = 'active';
          let repaidAmount = 0;
          let remainingAmount = borrowedAmount * (1 + interestRate);

          if (currentState === 2) { // Completed
            status = 'completed';
            repaidAmount = remainingAmount;
            remainingAmount = 0;
          } else if (currentState === 1) { // Active
            status = 'active';
            // Mock partial repayments
            repaidAmount = Math.random() * remainingAmount * 0.3;
            remainingAmount = remainingAmount - repaidAmount;
          }

          positions.push({
            marketAddress: market.contractAddress,
            borrowedAmount,
            interestRate: interestRate * 100,
            repaidAmount,
            remainingAmount,
            status,
            startDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
        }
      }
    } catch (error) {
      console.error('Error fetching borrowing positions:', error);
    }

    console.log('Fetched', positions.length, 'borrowing positions');
    return positions;
  }, [address, provider, stableMarkets]);

  // Calculate portfolio metrics
  const calculateMetrics = useCallback((
    lendingPos: LendingPosition[], 
    borrowingPos: BorrowingPosition[]
  ): PortfolioMetrics => {
    const totalLent = lendingPos.reduce((sum, pos) => sum + pos.depositAmount, 0);
    const totalBorrowed = borrowingPos.reduce((sum, pos) => sum + pos.borrowedAmount, 0);
    const totalInterestEarned = lendingPos.reduce((sum, pos) => sum + pos.interestEarned, 0);
    const totalInterestPaid = borrowingPos.reduce((sum, pos) => sum + pos.repaidAmount - pos.borrowedAmount, 0);
    
    const activeLendingPositions = lendingPos.filter(pos => pos.status === 'active').length;
    const activeBorrowingPositions = borrowingPos.filter(pos => pos.status === 'active').length;
    
    const avgLendingReturn = totalLent > 0 ? (totalInterestEarned / totalLent) * 100 : 0;
    const avgBorrowingRate = borrowingPos.length > 0 
      ? borrowingPos.reduce((sum, pos) => sum + pos.interestRate, 0) / borrowingPos.length 
      : 0;

    // Calculate trust score based on performance
    let trustScore = 50; // Base score
    if (borrowingPos.length > 0) {
      const completedLoans = borrowingPos.filter(pos => pos.status === 'completed').length;
      const completionRate = completedLoans / borrowingPos.length;
      trustScore += completionRate * 40;
    }
    if (lendingPos.length > 0) {
      trustScore += Math.min(lendingPos.length * 2, 10); // Bonus for lending activity
    }

    // Calculate risk score (inverse of trust)
    const riskScore = Math.max(5, 100 - trustScore);

    return {
      totalLent,
      totalBorrowed,
      totalInterestEarned,
      totalInterestPaid,
      activeLendingPositions,
      activeBorrowingPositions,
      avgLendingReturn,
      avgBorrowingRate,
      trustScore: Math.min(100, trustScore),
      riskScore
    };
  }, []);

  // Fetch transaction history from blockchain events
  const fetchTransactionHistory = useCallback(async (): Promise<TransactionHistory[]> => {
    if (!address || !provider) return [];

    try {
      // Mock transaction history for now
      const mockTransactions: TransactionHistory[] = [
        {
          hash: '0x1234...5678',
          type: 'deposit',
          amount: 1000,
          marketAddress: stableMarkets[0]?.contractAddress || '0x...',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          hash: '0x2345...6789',
          type: 'borrow',
          amount: 5000,
          marketAddress: stableMarkets[1]?.contractAddress || '0x...',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ];

      return mockTransactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }, [address, provider, stableMarkets]);

  // Main data fetching function with proper error handling
  const fetchPortfolioData = useCallback(async () => {
    if (!address || !isConnected || fetchingRef.current) {
      console.log('Skipping portfolio fetch - conditions not met');
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    
    try {
      console.log('Starting portfolio data fetch...');
      
      // Fetch NFT positions first, but don't wait indefinitely
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('NFT fetch timeout')), 10000)
      );

      try {
        await Promise.race([fetchUserPositions(), timeoutPromise]);
      } catch (error) {
        console.warn('NFT positions fetch failed or timed out:', error);
        // Continue with available data
      }

      const [lendingPos, borrowingPos, txHistory] = await Promise.allSettled([
        fetchLendingPositions(),
        fetchBorrowingPositions(),
        fetchTransactionHistory()
      ]);

      const lendingPositions = lendingPos.status === 'fulfilled' ? lendingPos.value : [];
      const borrowingPositions = borrowingPos.status === 'fulfilled' ? borrowingPos.value : [];
      const transactionHistory = txHistory.status === 'fulfilled' ? txHistory.value : [];

      setLendingPositions(lendingPositions);
      setBorrowingPositions(borrowingPositions);
      setTransactionHistory(transactionHistory);
      setPortfolioMetrics(calculateMetrics(lendingPositions, borrowingPositions));

      console.log('Portfolio data fetch completed successfully');

    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [address, isConnected, fetchUserPositions, fetchLendingPositions, fetchBorrowingPositions, fetchTransactionHistory, calculateMetrics]);

  // Stable effect that only runs when necessary
  useEffect(() => {
    if (isConnected && stableMarkets.length > 0 && !fetchingRef.current) {
      console.log('Portfolio effect triggered');
      // Add a small delay to prevent rapid re-fetching
      const timeoutId = setTimeout(fetchPortfolioData, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, stableMarkets.length > 0]); // Only depend on stable values

  return {
    lendingPositions,
    borrowingPositions,
    portfolioMetrics,
    transactionHistory,
    nftPositions: stableNftPositions,
    loading,
    refreshPortfolio: fetchPortfolioData
  };
};
