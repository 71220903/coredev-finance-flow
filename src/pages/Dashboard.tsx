
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanMarketCard from "@/components/LoanMarketCard";
import StakingWidget from "@/components/StakingWidget";
import CreateMarketModal from "@/components/CreateMarketModal";
import TrustScoreWidget from "@/components/TrustScoreWidget";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Target,
  Plus,
  User,
  Wallet,
  History,
  Settings,
  Percent
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<'borrower' | 'lender'>('borrower');
  const [currentStake, setCurrentStake] = useState(1);
  const [isStaked, setIsStaked] = useState(true);

  // Mock user data
  const userData = {
    borrower: {
      name: "Alex Rodriguez",
      githubHandle: "@alexcoder",
      trustScore: 88,
      trustBreakdown: { github: 35, codeQuality: 28, community: 20, onChain: 5 },
      totalBorrowed: 75000,
      activeLoans: 1,
      completedLoans: 2,
      markets: [
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
            description: "Building a comprehensive business management platform with AI automation.",
            tags: ["React", "Node.js", "AI/ML", "SaaS"]
          },
          loan: {
            amount: 50000,
            interestRate: 12.5,
            tenor: "12 months",
            tenorDays: 365,
            funded: 100,
            target: 50000,
            status: "active" as const,
            startDate: "Jan 15, 2024",
            dueDate: "Jan 15, 2025"
          }
        }
      ]
    },
    lender: {
      name: "Lisa Investor",
      totalInvested: 125000,
      activeInvestments: 3,
      totalReturns: 15600,
      avgReturn: 12.4,
      investments: [
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
            description: "AI tool for automated code review and optimization.",
            tags: ["Python", "AI/ML", "DevTools"]
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
          },
          investment: {
            amount: 5000,
            expectedReturn: 540,
            dueDate: "Sep 15, 2024"
          }
        }
      ]
    }
  };

  const handleStakeChange = (amount: number, staked: boolean) => {
    setCurrentStake(amount);
    setIsStaked(staked);
  };

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
              <Link to="/marketplace" className="text-slate-600 hover:text-slate-900 transition-colors">
                Marketplace
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Role Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">
              {userRole === 'borrower' ? 'Manage your loan markets and borrowing activity' : 'Track your investments and lending portfolio'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <Button
                variant={userRole === 'borrower' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserRole('borrower')}
              >
                Borrower
              </Button>
              <Button
                variant={userRole === 'lender' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setUserRole('lender')}
              >
                Lender
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="markets">
              {userRole === 'borrower' ? 'My Markets' : 'My Investments'}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            {userRole === 'borrower' && <TabsTrigger value="staking">Staking</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {userRole === 'borrower' ? (
              <>
                {/* Borrower Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${userData.borrower.totalBorrowed.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.borrower.activeLoans}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completed Loans</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.borrower.completedLoans}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{userData.borrower.trustScore}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Active Markets</CardTitle>
                        <CreateMarketModal 
                          trigger={
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Create Market
                            </Button>
                          }
                          isStaked={isStaked}
                          stakeAmount={currentStake}
                        />
                      </CardHeader>
                      <CardContent>
                        {userData.borrower.markets.length > 0 ? (
                          <div className="space-y-4">
                            {userData.borrower.markets.map((market) => (
                              <LoanMarketCard 
                                key={market.id} 
                                market={market}
                                userRole="borrower"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            No active markets. Create your first loan market to get started.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <TrustScoreWidget 
                      score={userData.borrower.trustScore}
                      breakdown={userData.borrower.trustBreakdown}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Lender Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${userData.lender.totalInvested.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.lender.activeInvestments}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">${userData.lender.totalReturns.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{userData.lender.avgReturn}%</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Active Investments</CardTitle>
                    <Link to="/marketplace">
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Find Opportunities
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {userData.lender.investments.length > 0 ? (
                      <div className="space-y-4">
                        {userData.lender.investments.map((investment) => (
                          <div key={investment.id} className="border rounded-lg p-4">
                            <LoanMarketCard 
                              market={investment}
                              userRole="lender"
                            />
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-slate-600">Your Investment:</span>
                                  <div className="font-medium">${investment.investment.amount.toLocaleString()}</div>
                                </div>
                                <div>
                                  <span className="text-slate-600">Expected Return:</span>
                                  <div className="font-medium text-green-600">
                                    ${investment.investment.expectedReturn.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-slate-600">Due Date:</span>
                                  <div className="font-medium">{investment.investment.dueDate}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        No active investments. Browse the marketplace to find opportunities.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="markets">
            <Card>
              <CardHeader>
                <CardTitle>
                  {userRole === 'borrower' ? 'My Loan Markets' : 'My Investment Portfolio'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  Detailed {userRole === 'borrower' ? 'market management' : 'investment tracking'} interface coming soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  Transaction history and analytics coming soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {userRole === 'borrower' && (
            <TabsContent value="staking">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StakingWidget
                  currentStake={currentStake}
                  isStaked={isStaked}
                  onStakeChange={handleStakeChange}
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Staking Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Market Creation Access</div>
                          <div className="text-sm text-slate-600">
                            Staking tCORE allows you to create isolated lending markets
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Trust Signal</div>
                          <div className="text-sm text-slate-600">
                            Demonstrates commitment and increases lender confidence
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Future Yield</div>
                          <div className="text-sm text-slate-600">
                            Staked tCORE will earn native staking rewards (coming soon)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
