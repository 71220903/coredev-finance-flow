
import { useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useToast } from '@/hooks/use-toast';

interface MarketEventListeners {
  onMarketCreated?: (borrower: string, marketAddress: string, projectCID: string) => void;
  onDeposited?: (marketAddress: string, lender: string, amount: string) => void;
  onLoanStarted?: (marketAddress: string, startTime: number, fundingAmount: string) => void;
  onLoanRepaid?: (marketAddress: string, totalAmount: string) => void;
}

export const useMarketEvents = (listeners: MarketEventListeners) => {
  const { marketFactory, provider } = useContract();
  const { toast } = useToast();

  const handleMarketCreated = useCallback((borrower: string, marketAddress: string, projectCID: string, event: any) => {
    console.log('Market Created:', { borrower, marketAddress, projectCID });
    
    toast({
      title: "New Market Created",
      description: `Market ${marketAddress.slice(0, 8)}... has been created`
    });

    listeners.onMarketCreated?.(borrower, marketAddress, projectCID);
  }, [listeners, toast]);

  const handleDeposited = useCallback((lender: string, amount: ethers.BigNumberish, event: any) => {
    const amountFormatted = ethers.formatUnits(amount, 6);
    const marketAddress = event.address;
    
    console.log('Deposit made:', { marketAddress, lender, amount: amountFormatted });
    
    toast({
      title: "New Deposit",
      description: `${amountFormatted} sUSDT deposited to market`
    });

    listeners.onDeposited?.(marketAddress, lender, amountFormatted);
  }, [listeners, toast]);

  const handleLoanStarted = useCallback((startTime: ethers.BigNumberish, fundingAmount: ethers.BigNumberish, event: any) => {
    const amountFormatted = ethers.formatUnits(fundingAmount, 6);
    const marketAddress = event.address;
    
    console.log('Loan Started:', { marketAddress, startTime: Number(startTime), fundingAmount: amountFormatted });
    
    toast({
      title: "Loan Started",
      description: `Market has been fully funded and loan started`
    });

    listeners.onLoanStarted?.(marketAddress, Number(startTime), amountFormatted);
  }, [listeners, toast]);

  const handleLoanRepaid = useCallback((totalAmount: ethers.BigNumberish, event: any) => {
    const amountFormatted = ethers.formatUnits(totalAmount, 6);
    const marketAddress = event.address;
    
    console.log('Loan Repaid:', { marketAddress, totalAmount: amountFormatted });
    
    toast({
      title: "Loan Repaid",
      description: `Loan has been successfully repaid`
    });

    listeners.onLoanRepaid?.(marketAddress, amountFormatted);
  }, [listeners, toast]);

  useEffect(() => {
    if (!marketFactory || !provider) return;

    console.log('Setting up market event listeners...');

    // Listen for MarketCreated events
    const marketCreatedFilter = marketFactory.filters.MarketCreated();
    marketFactory.on(marketCreatedFilter, handleMarketCreated);

    // Set up listeners for all market events (we'll need to listen to all markets)
    // For individual market events, we need to listen to all potential market contracts
    // This is a simplified approach - in production, you might want to maintain a list of known markets

    return () => {
      console.log('Cleaning up market event listeners...');
      marketFactory.off(marketCreatedFilter, handleMarketCreated);
    };
  }, [marketFactory, provider, handleMarketCreated]);

  // Method to listen to specific market events
  const listenToMarketEvents = useCallback((marketAddress: string) => {
    if (!provider) return;

    try {
      const marketContract = new ethers.Contract(
        marketAddress,
        [
          "event Deposited(address indexed lender, uint256 amount)",
          "event LoanStarted(uint256 startTime, uint256 fundingAmount)",
          "event LoanRepaid(uint256 totalAmount)"
        ],
        provider
      );

      marketContract.on('Deposited', handleDeposited);
      marketContract.on('LoanStarted', handleLoanStarted);
      marketContract.on('LoanRepaid', handleLoanRepaid);

      return () => {
        marketContract.off('Deposited', handleDeposited);
        marketContract.off('LoanStarted', handleLoanStarted);
        marketContract.off('LoanRepaid', handleLoanRepaid);
      };
    } catch (error) {
      console.error('Error setting up market event listeners:', error);
    }
  }, [provider, handleDeposited, handleLoanStarted, handleLoanRepaid]);

  return {
    listenToMarketEvents
  };
};
