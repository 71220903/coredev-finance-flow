
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoanMarketCard from "@/components/LoanMarketCard";
import CreateMarketModal from "@/components/CreateMarketModal";
import AdvancedSearch from "@/components/AdvancedSearch";
import { 
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { useMarketData } from "@/hooks/useMarketData";
import { useMarketEvents } from "@/hooks/useMarketEvents";

const Marketplace = () => {
  const [searchFilters, setSearchFilters] = useState<any>({});
  const { markets, loading, error, refreshMarket, refetchMarkets } = useMarketData();

  // Set up real-time event listeners
  useMarketEvents({
    onMarketCreated: (borrower, marketAddress, projectCID) => {
      console.log('New market created, refreshing data...');
      refetchMarkets();
    },
    onDeposited: (marketAddress, lender, amount) => {
      console.log('Deposit detected, refreshing market...');
      refreshMarket(marketAddress);
    },
    onLoanStarted: (marketAddress, startTime, fundingAmount) => {
      console.log('Loan started, refreshing market...');
      refreshMarket(marketAddress);
    },
    onLoanRepaid: (marketAddress, totalAmount) => {
      console.log('Loan repaid, refreshing market...');
      refreshMarket(marketAddress);
    }
  });

  // Transform contract data to component format
  const transformedMarkets = markets.map(market => ({
    id: market.contractAddress,
    borrower: {
      name: market.borrowerProfile?.name || 'Unknown Developer',
      githubHandle: market.borrowerProfile?.githubHandle || '@unknown',
      avatar: market.borrowerProfile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      trustScore: market.borrowerProfile?.trustScore || 50,
      trustBreakdown: { github: 25, codeQuality: 15, community: 10, onChain: 0 }
    },
    project: {
      title: market.projectData?.title || 'Untitled Project',
      description: market.projectData?.description || 'No description available',
      tags: market.projectData?.tags || ['Development']
    },
    loan: {
      amount: parseFloat(market.loanAmount),
      interestRate: market.interestRateBps / 100, // Convert basis points to percentage
      tenor: `${Math.floor(market.tenorSeconds / (24 * 60 * 60))} days`,
      tenorDays: Math.floor(market.tenorSeconds / (24 * 60 * 60)),
      funded: market.currentState === 0 ? Math.min(100, (parseFloat(market.totalDeposited) / parseFloat(market.loanAmount)) * 100) : 100,
      target: parseFloat(market.loanAmount),
      status: market.currentState === 0 ? 'funding' as const : 
              market.currentState === 1 ? 'active' as const : 
              market.currentState === 2 ? 'repaid' as const : 'defaulted' as const,
      timeLeft: market.currentState === 0 ? 'TBD' : undefined,
      startDate: market.currentState >= 1 ? 'Recently' : undefined,
      dueDate: market.currentState >= 1 ? 'Future' : undefined
    }
  }));

  const filteredMarkets = transformedMarkets.filter(market => {
    // Enhanced filtering logic with advanced search
    let matches = true;
    
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      matches = matches && (
        market.borrower.name.toLowerCase().includes(query) ||
        market.project.title.toLowerCase().includes(query) ||
        market.project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (searchFilters.minAmount) {
      matches = matches && market.loan.amount >= searchFilters.minAmount;
    }
    
    if (searchFilters.maxAmount) {
      matches = matches && market.loan.amount <= searchFilters.maxAmount;
    }
    
    if (searchFilters.minTrustScore) {
      matches = matches && market.borrower.trustScore >= searchFilters.minTrustScore;
    }
    
    if (searchFilters.status && searchFilters.status.length > 0) {
      matches = matches && searchFilters.status.includes(market.loan.status);
    }
    
    if (searchFilters.sectors && searchFilters.sectors.length > 0) {
      matches = matches && searchFilters.sectors.some(sector => 
        market.project.tags.includes(sector)
      );
    }
    
    return matches;
  });

  // Calculate stats from real data
  const totalRequested = transformedMarkets.reduce((sum, market) => sum + market.loan.amount, 0);
  const avgInterestRate = transformedMarkets.length > 0 
    ? transformedMarkets.reduce((sum, market) => sum + market.loan.interestRate, 0) / transformedMarkets.length
    : 0;
  const successRate = transformedMarkets.length > 0
    ? Math.round((transformedMarkets.filter(m => m.loan.status === 'repaid').length / transformedMarkets.length) * 100)
    : 0;

  const handleFiltersChange = (filters: any) => {
    setSearchFilters(filters);
  };

  const handleFiltersReset = () => {
    setSearchFilters({});
  };

  if (loading && markets.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading markets from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading markets: {error}</p>
          <Button onClick={refetchMarkets}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
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
              <WalletConnect />
              <CreateMarketModal 
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Market
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Loan Marketplace</h1>
          <p className="text-slate-600">
            Discover isolated lending markets created by verified developers with fixed rates and clear terms
          </p>
          {loading && (
            <p className="text-sm text-blue-600 mt-2">
              🔄 Syncing with blockchain...
            </p>
          )}
        </div>

        {/* Advanced Search */}
        <div className="mb-8">
          <AdvancedSearch 
            onFiltersChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transformedMarkets.length}</div>
              <p className="text-xs text-muted-foreground">
                {transformedMarkets.filter(m => m.loan.status === 'funding').length} seeking funding
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalRequested / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">
                Across all markets
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgInterestRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Fixed APR
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Successful repayments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loan Markets */}
        <div className="space-y-6">
          {filteredMarkets.map((market) => (
            <LoanMarketCard 
              key={market.id} 
              market={market}
              userRole="lender"
            />
          ))}
        </div>

        {filteredMarkets.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">
              {transformedMarkets.length === 0 
                ? "No markets found on the blockchain" 
                : "No markets found matching your criteria"
              }
            </div>
            <div className="space-x-2">
              {transformedMarkets.length === 0 ? (
                <Button onClick={refetchMarkets}>Refresh from Blockchain</Button>
              ) : (
                <Button variant="outline" onClick={handleFiltersReset}>Clear Filters</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
