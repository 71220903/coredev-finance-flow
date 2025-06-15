
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoanMarketCard from "@/components/LoanMarketCard";
import CreateMarketModal from "@/components/CreateMarketModal";
import { 
  Search, 
  Filter, 
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Enhanced mock data with complete loan lifecycle
  const loanMarkets = [
    {
      id: "1",
      borrower: {
        name: "Alex Rodriguez",
        githubHandle: "@alexcoder",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        trustScore: 88,
        trustBreakdown: { github: 35, codeQuality: 28, community: 20, onChain: 5 }
      },
      project: {
        title: "AI-Powered SaaS Platform for SMBs",
        description: "Building a comprehensive business management platform using React, Node.js, and PostgreSQL with AI automation features. Already have MVP with 100+ beta users showing strong product-market fit.",
        tags: ["React", "Node.js", "AI/ML", "SaaS", "B2B"]
      },
      loan: {
        amount: 50000,
        interestRate: 12.5,
        tenor: "12 months",
        tenorDays: 365,
        funded: 65,
        target: 50000,
        status: "funding" as const,
        timeLeft: "5 days"
      }
    },
    {
      id: "2",
      borrower: {
        name: "Sarah Chen",
        githubHandle: "@sarahml",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332db29?w=50&h=50&fit=crop&crop=face",
        trustScore: 92,
        trustBreakdown: { github: 38, codeQuality: 29, community: 22, onChain: 3 }
      },
      project: {
        title: "AI Code Review Tool",
        description: "Developing an AI tool that automatically reviews code for bugs and optimization opportunities using advanced machine learning algorithms. Built with Python, TensorFlow, and cloud infrastructure.",
        tags: ["Python", "AI/ML", "DevTools", "TensorFlow", "Cloud"]
      },
      loan: {
        amount: 25000,
        interestRate: 10.8,
        tenor: "8 months",
        tenorDays: 240,
        funded: 100,
        target: 25000,
        status: "active" as const,
        startDate: "Jan 15, 2024",
        dueDate: "Sep 15, 2024"
      }
    },
    {
      id: "3",
      borrower: {
        name: "Mike Johnson",
        githubHandle: "@mobiledev",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        trustScore: 76,
        trustBreakdown: { github: 30, codeQuality: 22, community: 18, onChain: 6 }
      },
      project: {
        title: "Local Services Marketplace App",
        description: "Creating a React Native marketplace app connecting local service providers with customers. Includes real-time messaging, payment processing, and review system.",
        tags: ["React Native", "Mobile", "E-commerce", "Marketplace"]
      },
      loan: {
        amount: 15000,
        interestRate: 14.2,
        tenor: "6 months",
        tenorDays: 180,
        funded: 100,
        target: 15000,
        status: "repaid" as const,
        startDate: "Aug 1, 2023",
        dueDate: "Feb 1, 2024"
      }
    },
    {
      id: "4",
      borrower: {
        name: "Emma Wilson",
        githubHandle: "@emmaweb3",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        trustScore: 85,
        trustBreakdown: { github: 33, codeQuality: 26, community: 21, onChain: 5 }
      },
      project: {
        title: "DeFi Analytics Dashboard",
        description: "Building a comprehensive DeFi analytics platform with real-time data visualization, portfolio tracking, and yield farming optimization tools.",
        tags: ["React", "DeFi", "Web3", "Analytics", "TypeScript"]
      },
      loan: {
        amount: 35000,
        interestRate: 11.5,
        tenor: "10 months",
        tenorDays: 300,
        funded: 30,
        target: 35000,
        status: "funding" as const,
        timeLeft: "12 days"
      }
    }
  ];

  const filteredMarkets = loanMarkets.filter(market => {
    const matchesSearch = market.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "funding") return matchesSearch && market.loan.status === "funding";
    if (filterBy === "active") return matchesSearch && market.loan.status === "active";
    if (filterBy === "high-trust") return matchesSearch && market.borrower.trustScore >= 85;
    return matchesSearch;
  });

  // Calculate stats
  const totalRequested = loanMarkets.reduce((sum, market) => sum + market.loan.amount, 0);
  const avgInterestRate = loanMarkets.reduce((sum, market) => sum + market.loan.interestRate, 0) / loanMarkets.length;
  const successRate = Math.round((loanMarkets.filter(m => m.loan.status === 'repaid').length / loanMarkets.length) * 100);

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
              <CreateMarketModal 
                trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Market
                  </Button>
                }
                isStaked={true}
                stakeAmount={1}
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
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by developer, project, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="funding">Seeking Funding</SelectItem>
                <SelectItem value="active">Active Loans</SelectItem>
                <SelectItem value="high-trust">High Trust Score</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="amount-high">Highest Amount</SelectItem>
                <SelectItem value="amount-low">Lowest Amount</SelectItem>
                <SelectItem value="interest-high">Highest Interest</SelectItem>
                <SelectItem value="trust-score">Trust Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loanMarkets.length}</div>
              <p className="text-xs text-muted-foreground">
                {loanMarkets.filter(m => m.loan.status === 'funding').length} seeking funding
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

        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">No markets found matching your criteria</div>
            <Button variant="outline">Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
