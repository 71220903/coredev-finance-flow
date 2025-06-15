
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  ExternalLink,
  Github,
  Plus,
  Activity,
  BarChart,
  ShieldCheck,
  Lock,
  Unlock,
  BarChart3,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import AchievementsWidget from "@/components/AchievementsWidget";
import EnhancedStakingWidget from "@/components/EnhancedStakingWidget";
import MobileNavigation from "@/components/MobileNavigation";
import { usePortfolioAnalytics } from "@/hooks/usePortfolioAnalytics";
import { useHybridStaking } from "@/hooks/useHybridStaking";

const Dashboard = () => {
  const { 
    portfolioMetrics, 
    lendingPositions, 
    borrowingPositions, 
    loading: portfolioLoading 
  } = usePortfolioAnalytics();
  
  const { 
    totalStaked, 
    totalRewards, 
    apy, 
    isLoading: stakingLoading 
  } = useHybridStaking();

  const [userProfile] = useState({
    name: "Alex Rodriguez",
    githubHandle: "@alexcoder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
  });

  const statsCards = [
    { 
      title: "Total Lent", 
      value: portfolioLoading ? "..." : `$${portfolioMetrics.totalLent.toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-green-600",
      change: portfolioMetrics.avgLendingReturn > 0 ? `+${portfolioMetrics.avgLendingReturn.toFixed(1)}% APY` : "No activity"
    },
    { 
      title: "Total Borrowed", 
      value: portfolioLoading ? "..." : `$${portfolioMetrics.totalBorrowed.toLocaleString()}`, 
      icon: Lock, 
      color: "text-purple-600",
      change: portfolioMetrics.avgBorrowingRate > 0 ? `${portfolioMetrics.avgBorrowingRate.toFixed(1)}% avg rate` : "No loans"
    },
    { 
      title: "Interest Earned", 
      value: portfolioLoading ? "..." : `$${portfolioMetrics.totalInterestEarned.toLocaleString()}`, 
      icon: TrendingUp, 
      color: "text-blue-600",
      change: `${portfolioMetrics.activeLendingPositions} active positions`
    },
    { 
      title: "Trust Score", 
      value: portfolioLoading ? "..." : portfolioMetrics.trustScore.toString(), 
      icon: ShieldCheck, 
      color: "text-yellow-600",
      change: portfolioMetrics.trustScore >= 80 ? "Excellent" : portfolioMetrics.trustScore >= 60 ? "Good" : "Building"
    }
  ];

  const recentActivity = [
    ...lendingPositions.slice(0, 2).map(pos => ({
      type: "lending",
      date: pos.startDate.toISOString().split('T')[0],
      description: `Deposited $${pos.depositAmount.toLocaleString()} to market`,
      status: pos.status
    })),
    ...borrowingPositions.slice(0, 2).map(pos => ({
      type: "borrowing", 
      date: pos.startDate.toISOString().split('T')[0],
      description: `Borrowed $${pos.borrowedAmount.toLocaleString()} from market`,
      status: pos.status
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-b border-slate-200">
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
              <Link to="/analytics" className="text-slate-600 hover:text-slate-900 transition-colors">
                Analytics
              </Link>
              <Button>Create Market</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {userProfile.name}!
          </h1>
          <p className="text-slate-600">
            Here's an overview of your developer activity and portfolio performance
          </p>
        </div>

        {/* Enhanced Stats Cards with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card 
              key={card.title} 
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {portfolioLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Staking Widget with Hybrid Features */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Hybrid Staking Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {stakingLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${totalStaked.toFixed(2)}`}
                    </div>
                    <div className="text-sm text-blue-600">Total Staked (tCORE)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stakingLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${totalRewards.toFixed(4)}`}
                    </div>
                    <div className="text-sm text-green-600">Total Rewards</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {apy.toFixed(1)}%
                    </div>
                    <div className="text-sm text-purple-600">Current APY</div>
                  </div>
                </div>
                <EnhancedStakingWidget />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Loan Market
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Existing Markets
                </Button>
                <Button variant="secondary" className="w-full justify-start" asChild>
                  <Link to="/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity with Real Data */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading activity...</span>
                  </div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {activity.description}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-2">
                          <span>{activity.date}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Performance Chart */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                  <BarChart className="h-8 w-8" />
                  Chart Placeholder - Real data integration ready
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Overview with Real Trust Score */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-medium text-slate-900">
                      {userProfile.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {userProfile.githubHandle}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-900">
                      Trust Score
                    </div>
                    <Badge variant="secondary">
                      {portfolioLoading ? "..." : portfolioMetrics.trustScore}
                    </Badge>
                  </div>
                  <Progress 
                    value={portfolioLoading ? 0 : portfolioMetrics.trustScore} 
                    max={100} 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4 text-slate-500" />
                  <a
                    href={`https://github.com/${userProfile.githubHandle.substring(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View GitHub Profile
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Achievements Widget */}
            <AchievementsWidget />

            {/* Active Positions Summary */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolioLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-900">
                        Lending Positions
                      </div>
                      <Badge variant="outline">{portfolioMetrics.activeLendingPositions}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-900">
                        Borrowing Positions  
                      </div>
                      <Badge variant="outline">{portfolioMetrics.activeBorrowingPositions}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
