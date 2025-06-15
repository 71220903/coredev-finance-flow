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
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import AchievementsWidget from "@/components/AchievementsWidget";
import EnhancedStakingWidget from "@/components/EnhancedStakingWidget";
import MobileNavigation from "@/components/MobileNavigation";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState({
    name: "Alex Rodriguez",
    githubHandle: "@alexcoder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    trustScore: 88,
    trustBreakdown: { github: 35, codeQuality: 28, community: 20, onChain: 5 },
    staking: {
      amount: 5.25,
      isActive: true
    },
    portfolio: {
      totalBorrowed: 75000,
      totalRepaid: 50000,
      activeLoans: 2,
      avgInterestRate: 11.5
    },
    recentActivity: [
      { type: "loan-created", date: "2024-01-20", description: "Created a new loan market for $50,000" },
      { type: "loan-funded", date: "2024-01-18", description: "Loan market successfully funded by lenders" },
      { type: "repayment", date: "2024-01-15", description: "Received repayment of $5,000 from loan #123" }
    ],
    activeMarkets: [
      { id: "1", title: "AI-Powered SaaS Platform", status: "funding", progress: 65 },
      { id: "2", title: "DeFi Analytics Dashboard", status: "active", progress: 100 }
    ]
  });

  const statsCards = [
    { title: "Total Borrowed", value: "$75,000", icon: DollarSign, color: "text-green-600" },
    { title: "Total Repaid", value: "$50,000", icon: Unlock, color: "text-blue-600" },
    { title: "Active Loans", value: "2", icon: Lock, color: "text-purple-600" },
    { title: "Avg. Interest Rate", value: "11.5%", icon: TrendingUp, color: "text-yellow-600" }
  ];

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

        {/* Enhanced Stats Cards with Animations */}
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
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  Updated every 5 minutes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Staking Widget */}
            <EnhancedStakingWidget
              currentStake={userProfile.staking.amount}
              isStaked={userProfile.staking.isActive}
              onStakeChange={(amount, isStaked) => {
                console.log("Stake changed:", amount, isStaked);
              }}
            />

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

            {/* Recent Activity */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {activity.description}
                      </div>
                      <div className="text-xs text-slate-500">
                        {activity.date} • {activity.type}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
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
                  Chart Placeholder
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Overview */}
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
                    <Badge variant="secondary">{userProfile.trustScore}</Badge>
                  </div>
                  <Progress value={userProfile.trustScore} max={100} />
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

            {/* Achievements Widget */}
            <AchievementsWidget />

            {/* Active Markets */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Active Markets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.activeMarkets.map((market) => (
                  <div key={market.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {market.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        Status: {market.status}
                      </div>
                    </div>
                    <Progress value={market.progress} className="w-24 h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trust Score Breakdown */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Trust Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900">
                    GitHub Activity
                  </div>
                  <span className="text-xs text-slate-500">
                    {userProfile.trustBreakdown.github}
                  </span>
                </div>
                <Progress value={userProfile.trustBreakdown.github} max={100} />

                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900">
                    Code Quality
                  </div>
                  <span className="text-xs text-slate-500">
                    {userProfile.trustBreakdown.codeQuality}
                  </span>
                </div>
                <Progress value={userProfile.trustBreakdown.codeQuality} max={100} />

                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900">
                    Community Engagement
                  </div>
                  <span className="text-xs text-slate-500">
                    {userProfile.trustBreakdown.community}
                  </span>
                </div>
                <Progress value={userProfile.trustBreakdown.community} max={100} />

                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900">
                    On-Chain Activity
                  </div>
                  <span className="text-xs text-slate-500">
                    {userProfile.trustBreakdown.onChain}
                  </span>
                </div>
                <Progress value={userProfile.trustBreakdown.onChain} max={100} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
