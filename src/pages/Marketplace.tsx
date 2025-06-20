
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoanMarketCard from "@/components/LoanMarketCard";
import CreateMarketModal from "@/components/CreateMarketModal";
import AdvancedSearch from "@/components/AdvancedSearch";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { NotificationSystem } from "@/components/notifications/NotificationSystem";
import { TransactionGate } from "@/components/TransactionGate";
import { BrowseModeIndicator } from "@/components/BrowseModeIndicator";
import { 
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Plus,
  RefreshCw,
  Wifi,
  Shield,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { useEnhancedMarketData } from "@/hooks/useEnhancedMarketData";
import { useWallet } from "@/hooks/useWallet";
import { LoanMarket } from "@/types/market";

const Marketplace = () => {
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [isOnline] = useState(true);
  const { markets, loading, error, marketStats, refetchMarkets, filterMarkets } = useEnhancedMarketData();
  const { isConnected } = useWallet();

  // Transform enhanced market data to LoanMarketCard format
  const transformMarketData = useCallback((market: LoanMarket) => {
    const fundedPercentage = (market.totalDeposited / market.loanAmount) * 100;
    
    // Properly type the status based on market state
    const getStatus = (state: number): 'funding' | 'active' | 'repaid' | 'defaulted' => {
      switch (state) {
        case 0: return 'funding';
        case 1: return 'active';
        case 2: return 'repaid';
        case 3: return 'defaulted';
        default: return 'defaulted';
      }
    };
    
    return {
      id: market.id,
      borrower: {
        name: market.borrowerProfile.githubHandle || 'Unknown Developer',
        githubHandle: `@${market.borrowerProfile.githubHandle}`,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face`,
        trustScore: market.borrowerProfile.trustScore,
        trustBreakdown: {
          github: Math.floor(market.borrowerProfile.trustScore * 0.3),
          codeQuality: Math.floor(market.borrowerProfile.trustScore * 0.25),
          community: Math.floor(market.borrowerProfile.trustScore * 0.25),
          onChain: Math.floor(market.borrowerProfile.trustScore * 0.2)
        }
      },
      project: {
        title: market.projectData.title,
        description: market.projectData.description,
        tags: market.projectData.tags
      },
      loan: {
        amount: market.loanAmount,
        interestRate: market.suggestedInterestRate,
        tenor: `${Math.floor(market.tenorSeconds / 86400)} days`,
        tenorDays: Math.floor(market.tenorSeconds / 86400),
        funded: fundedPercentage,
        target: market.loanAmount,
        status: getStatus(market.currentState),
        timeLeft: market.currentState === 0 ? `${Math.floor((market.fundingDeadline - Date.now()) / (1000 * 60 * 60 * 24))} days` : undefined,
        startDate: market.currentState >= 1 ? new Date(market.createdAt).toLocaleDateString() : undefined,
        dueDate: market.currentState >= 1 ? new Date(market.createdAt + market.tenorSeconds * 1000).toLocaleDateString() : undefined
      }
    };
  }, []);

  // Memoized filtered markets
  const filteredMarkets = useMemo(() => {
    if (Object.keys(searchFilters).length === 0) {
      return markets;
    }

    return markets.filter(market => {
      try {
        let matches = true;
        
        if (searchFilters.query) {
          const query = searchFilters.query.toLowerCase();
          matches = matches && (
            market.borrowerProfile.githubHandle.toLowerCase().includes(query) ||
            market.projectData.title.toLowerCase().includes(query) ||
            market.projectData.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        if (searchFilters.minAmount) {
          matches = matches && market.loanAmount >= searchFilters.minAmount;
        }
        
        if (searchFilters.maxAmount) {
          matches = matches && market.loanAmount <= searchFilters.maxAmount;
        }
        
        if (searchFilters.minTrustScore) {
          matches = matches && market.borrowerProfile.trustScore >= searchFilters.minTrustScore;
        }
        
        if (searchFilters.riskCategory && searchFilters.riskCategory.length > 0) {
          matches = matches && searchFilters.riskCategory.includes(market.borrowerProfile.riskCategory);
        }
        
        if (searchFilters.status && searchFilters.status.length > 0) {
          const statusMap = { 'funding': 0, 'active': 1, 'repaid': 2, 'defaulted': 3 };
          matches = matches && searchFilters.status.some((status: string) => 
            statusMap[status as keyof typeof statusMap] === market.currentState
          );
        }
        
        return matches;
      } catch (error) {
        console.error('Error filtering market:', error, market);
        return false;
      }
    });
  }, [markets, searchFilters]);

  const handleFiltersChange = useCallback(async (filters: any) => {
    console.log('Enhanced filters changed:', filters);
    setSearchFilters(filters);
  }, []);

  const handleFiltersReset = useCallback(() => {
    console.log('Enhanced filters reset');
    setSearchFilters({});
  }, []);

  // Show loading state with skeleton
  if (loading && markets.length === 0) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-50">
          {/* Navigation */}
          <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CD</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900">CoreDev Zero</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <NotificationSystem />
                  <WalletConnect />
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Enhanced Loan Marketplace</h1>
              <div className="flex items-center space-x-2">
                <p className="text-slate-600">Loading markets...</p>
                <Wifi className="h-4 w-4 text-green-600" />
              </div>
            </div>
            
            <SkeletonLoader type="dashboard" />
            <div className="mt-8">
              <SkeletonLoader type="market" count={3} />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Show error state
  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-50">
          {/* Navigation */}
          <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CD</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900">CoreDev Zero</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <NotificationSystem />
                  <WalletConnect />
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <p className="text-red-600 mb-4">Error loading markets: {error}</p>
              <Button onClick={refetchMarkets} className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </Button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CD</span>
                </div>
                <span className="text-xl font-bold text-slate-900">CoreDev Zero</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Dashboard
                </Link>
                <NotificationSystem />
                <WalletConnect />
                <TransactionGate action="Create Market" description="To create a lending market, you need to connect your wallet.">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Market
                  </Button>
                </TransactionGate>
              </div>
            </div>
          </div>
        </nav>

        {/* Browse Mode Indicator */}
        <BrowseModeIndicator />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Enhanced Loan Marketplace</h1>
                <p className="text-slate-600">
                  AI-powered risk assessment • Trust-based lending • NFT positions • Secondary trading
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {loading && (
                  <div className="flex items-center text-sm text-blue-600">
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Loading...
                  </div>
                )}
                <Wifi className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          {/* Advanced Search */}
          <div className="mb-8">
            <AdvancedSearch 
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
            />
          </div>

          {/* Enhanced Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketStats.activeMarkets}</div>
                <p className="text-xs text-muted-foreground">
                  {marketStats.fundingMarkets} seeking funding
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(marketStats.totalRequested / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">
                  ${(marketStats.totalStaked / 1000).toFixed(0)}K staked as collateral
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Trust Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketStats.avgTrustScore.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground">
                  {marketStats.avgInterestRate.toFixed(1)}% avg interest rate
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketStats.successRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Loan repayment success rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Loan Markets */}
          <div className="space-y-6">
            {loading && filteredMarkets.length > 0 && (
              <div className="text-center py-2">
                <div className="inline-flex items-center text-sm text-blue-600">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing enhanced market data...
                </div>
              </div>
            )}
            
            {filteredMarkets.map((market) => (
              <LoanMarketCard 
                key={market.id} 
                market={transformMarketData(market)}
                userRole="lender"
              />
            ))}
          </div>

          {filteredMarkets.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-slate-500 mb-4">
                {markets.length === 0 
                  ? "No enhanced markets available" 
                  : "No markets found matching your criteria"
                }
              </div>
              <div className="space-x-2">
                {markets.length === 0 ? (
                  <Button onClick={refetchMarkets} className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Markets</span>
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleFiltersReset}>Clear Filters</Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Marketplace;
