
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWallet } from './useWallet';
import { useMarketData } from './useMarketData';

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

  // Fetch user's lending positions
  const fetchLendingPositions = useCallback(async () => {
    if (!address || !provider || markets.length === 0) return [];

    const positions: LendingPosition[] = [];

    try {
      for (const market of markets) {
        const marketContract = getMarketContract(market.contractAddress);
        if (!marketContract) continue;

        // Check if user has deposits in this market
        const userDeposit = await marketContract.depositsOf(address);
        const depositAmount = Number(ethers.formatUnits(userDeposit, 6));

        if (depositAmount > 0) {
          // Calculate interest earned based on market state and time
          const currentState = Number(await marketContract.currentState());
          const interestRateBps = Number(await marketContract.interestRateBps());
          const interestRate = interestRateBps / 10000;

          let interestEarned = 0;
          let status: 'active' | 'completed' | 'defaulted' = 'active';
          let currentValue = depositAmount;

          if (currentState === 2) { // Completed
            status = 'completed';
            interestEarned = depositAmount * interestRate;
            currentValue = depositAmount + interestEarned;
          } else if (currentState === 1) { // Active/Funded
            status = 'active';
            // Calculate accrued interest (simplified)
            const timeElapsed = 30; // Mock days
            interestEarned = depositAmount * interestRate * (timeElapsed / 365);
            currentValue = depositAmount + interestEarned;
          }

          positions.push({
            marketAddress: market.contractAddress,
            depositAmount,
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
        }
      }
    } catch (error) {
      console.error('Error fetching lending positions:', error);
    }

    return positions;
  }, [address, provider, markets, getMarketContract]);

  // Fetch user's borrowing positions
  const fetchBorrowingPositions = useCallback(async () => {
    if (!address || !provider || markets.length === 0) return [];

    const positions: BorrowingPosition[] = [];

    try {
      for (const market of markets) {
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

    return positions;
  }, [address, provider, markets]);

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
      // In a real implementation, you would query blockchain events
      // For now, generating mock transaction history
      const mockTransactions: TransactionHistory[] = [
        {
          hash: '0x1234...5678',
          type: 'deposit',
          amount: 1000,
          marketAddress: markets[0]?.contractAddress || '0x...',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        },
        {
          hash: '0x2345...6789',
          type: 'borrow',
          amount: 5000,
          marketAddress: markets[1]?.contractAddress || '0x...',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'confirmed'
        }
      ];

      return mockTransactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }, [address, provider, markets]);

  // Main data fetching function
  const fetchPortfolioData = useCallback(async () => {
    if (!address || !isConnected) return;

    setLoading(true);
    try {
      const [lendingPos, borrowingPos, txHistory] = await Promise.all([
        fetchLendingPositions(),
        fetchBorrowingPositions(),
        fetchTransactionHistory()
      ]);

      setLendingPositions(lendingPos);
      setBorrowingPositions(borrowingPos);
      setTransactionHistory(txHistory);
      setPortfolioMetrics(calculateMetrics(lendingPos, borrowingPos));

    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, fetchLendingPositions, fetchBorrowingPositions, fetchTransactionHistory, calculateMetrics]);

  // Effects
  useEffect(() => {
    if (isConnected && markets.length > 0) {
      fetchPortfolioData();
    }
  }, [isConnected, markets.length, fetchPortfolioData]);

  return {
    lendingPositions,
    borrowingPositions,
    portfolioMetrics,
    transactionHistory,
    loading,
    refreshPortfolio: fetchPortfolioData
  };
};
