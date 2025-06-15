
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  PieChart
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface PortfolioTrackerProps {
  lenderId?: string;
}

const PortfolioTracker = ({ lenderId = "default" }: PortfolioTrackerProps) => {
  // Sample portfolio data
  const portfolioOverview = {
    totalInvested: 75000,
    totalReturned: 68500,
    activeLoans: 12,
    completedLoans: 28,
    avgReturn: 13.2,
    portfolioHealth: 88
  };

  const monthlyReturns = [
    { month: 'Jan', invested: 10000, returned: 9500, netReturn: 8.5 },
    { month: 'Feb', invested: 12000, returned: 11800, netReturn: 12.2 },
    { month: 'Mar', invested: 8000, returned: 8400, netReturn: 15.1 },
    { month: 'Apr', invested: 15000, returned: 14200, netReturn: 11.8 },
    { month: 'May', invested: 18000, returned: 17100, netReturn: 13.5 },
    { month: 'Jun', invested: 12000, returned: 12900, netReturn: 14.2 }
  ];

  const riskDistribution = [
    { risk: 'Low Risk', amount: 25000, percentage: 33.3, color: '#10B981' },
    { risk: 'Medium Risk', amount: 35000, percentage: 46.7, color: '#F59E0B' },
    { risk: 'High Risk', amount: 15000, percentage: 20.0, color: '#EF4444' }
  ];

  const activeLoans = [
    {
      id: 'L001',
      borrower: 'Tech Startup Alpha',
      amount: 25000,
      interestRate: 12.5,
      duration: '12 months',
      progress: 65,
      status: 'active',
      riskLevel: 'medium',
      nextPayment: '2024-07-15'
    },
    {
      id: 'L002',
      borrower: 'DeFi Protocol Beta',
      amount: 15000,
      interestRate: 15.2,
      duration: '6 months',
      progress: 30,
      status: 'active',
      riskLevel: 'high',
      nextPayment: '2024-07-20'
    },
    {
      id: 'L003',
      borrower: 'AI Development Co',
      amount: 35000,
      interestRate: 10.8,
      duration: '18 months',
      progress: 85,
      status: 'active',
      riskLevel: 'low',
      nextPayment: '2024-07-12'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioOverview.totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {portfolioOverview.activeLoans} active loans</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioOverview.totalReturned.toLocaleString()}</div>
            <p className="text-xs text-green-600">+{portfolioOverview.avgReturn}% avg return</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Health</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioOverview.portfolioHealth}%</div>
            <Progress value={portfolioOverview.portfolioHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Loans</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioOverview.completedLoans}</div>
            <p className="text-xs text-muted-foreground">Successful completions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'netReturn' ? `${value}%` : `$${value.toLocaleString()}`,
                        name === 'netReturn' ? 'Net Return' : name === 'invested' ? 'Invested' : 'Returned'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="invested" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="returned" 
                      stackId="2" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Active Loan Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeLoans.map((loan) => (
                <div key={loan.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{loan.borrower}</h4>
                      <p className="text-sm text-muted-foreground">Loan ID: {loan.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">${loan.amount.toLocaleString()}</div>
                      <Badge variant="outline" className={getRiskColor(loan.riskLevel)}>
                        {loan.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <span className="ml-2 font-medium">{loan.interestRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-2 font-medium">{loan.duration}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Payment:</span>
                      <span className="ml-2 font-medium">{loan.nextPayment}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{loan.progress}%</span>
                    </div>
                    <Progress value={loan.progress} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Return Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Net Return']} />
                  <Line 
                    type="monotone" 
                    dataKey="netReturn" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Risk Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskDistribution.map((risk) => (
                  <div key={risk.risk} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: risk.color }}
                      />
                      <span className="font-medium">{risk.risk}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${risk.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{risk.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Risk Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Diversification Opportunity</p>
                    <p className="text-sm text-muted-foreground">
                      Consider reducing high-risk exposure from 20% to 15%
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Balanced Portfolio</p>
                    <p className="text-sm text-muted-foreground">
                      Your medium-risk allocation is optimal for growth
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Growth Potential</p>
                    <p className="text-sm text-muted-foreground">
                      Consider adding 5% more low-risk investments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioTracker;
