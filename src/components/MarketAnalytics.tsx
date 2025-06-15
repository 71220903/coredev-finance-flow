
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight
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

const MarketAnalytics = () => {
  // Sample data for different charts
  const loanPerformanceData = [
    { month: 'Jan', funded: 125000, repaid: 110000, defaulted: 5000 },
    { month: 'Feb', funded: 150000, repaid: 135000, defaulted: 8000 },
    { month: 'Mar', funded: 180000, repaid: 165000, defaulted: 6000 },
    { month: 'Apr', funded: 200000, repaid: 185000, defaulted: 10000 },
    { month: 'May', funded: 220000, repaid: 200000, defaulted: 12000 },
    { month: 'Jun', funded: 250000, repaid: 230000, defaulted: 8000 }
  ];

  const marketTrendsData = [
    { date: '2024-01', avgInterest: 12.5, totalVolume: 450000, activeUsers: 156 },
    { date: '2024-02', avgInterest: 11.8, totalVolume: 520000, activeUsers: 189 },
    { date: '2024-03', avgInterest: 12.2, totalVolume: 610000, activeUsers: 215 },
    { date: '2024-04', avgInterest: 11.9, totalVolume: 750000, activeUsers: 243 },
    { date: '2024-05', avgInterest: 12.1, totalVolume: 820000, activeUsers: 278 },
    { date: '2024-06', avgInterest: 11.7, totalVolume: 950000, activeUsers: 302 }
  ];

  const sectorDistribution = [
    { name: 'DeFi', value: 35, color: '#3B82F6' },
    { name: 'AI/ML', value: 28, color: '#10B981' },
    { name: 'Web3', value: 22, color: '#F59E0B' },
    { name: 'Gaming', value: 10, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' }
  ];

  const trustScoreDistribution = [
    { range: '90-100', count: 45, percentage: 15 },
    { range: '80-89', count: 120, percentage: 40 },
    { range: '70-79', count: 90, percentage: 30 },
    { range: '60-69', count: 30, percentage: 10 },
    { range: '<60', count: 15, percentage: 5 }
  ];

  const keyMetrics = [
    {
      title: "Total Volume",
      value: "$2.4M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Markets",
      value: "127",
      change: "+8.2%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      title: "Avg Interest Rate",
      value: "11.7%",
      change: "-0.4%",
      trend: "down",
      icon: TrendingDown,
      color: "text-yellow-600"
    },
    {
      title: "Active Users",
      value: "302",
      change: "+12.1%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric) => (
          <Card key={metric.title} className="transition-all duration-300 hover:shadow-lg animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs">
                {metric.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Loan Performance</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          <TabsTrigger value="trust">Trust Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Loan Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={loanPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="funded" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                    name="Funded"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="repaid" 
                    stackId="2" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="Repaid"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="defaulted" 
                    stackId="3" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.6}
                    name="Defaulted"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Interest Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={marketTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="avgInterest" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activeUsers" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sectorDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sectorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Top Performing Sectors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sectorDistribution.map((sector, index) => (
                  <div key={sector.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: sector.color }}
                      />
                      <span className="font-medium">{sector.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{sector.value}%</Badge>
                      {index < 2 && <TrendingUp className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trust" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Trust Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trustScoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'count' ? `${value} users` : `${value}%`,
                      name === 'count' ? 'Users' : 'Percentage'
                    ]}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalytics;
