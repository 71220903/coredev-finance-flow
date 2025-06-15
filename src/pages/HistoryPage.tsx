
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  User, 
  Eye, 
  Download,
  Filter,
  Calendar
} from "lucide-react";
import AppLayout from "@/components/navigation/AppLayout";

const HistoryPage = () => {
  const breadcrumbItems = [
    { label: "History" }
  ];

  const investmentHistory = [
    {
      id: 1,
      type: "investment",
      projectName: "AI Trading Bot",
      amount: 5000,
      status: "active",
      date: "2024-01-15",
      returns: 12.5,
      developer: "Alex Rodriguez"
    },
    {
      id: 2,
      type: "investment", 
      projectName: "NFT Marketplace",
      amount: 3000,
      status: "completed",
      date: "2024-01-10",
      returns: 8.2,
      developer: "Sarah Chen"
    },
    {
      id: 3,
      type: "investment",
      projectName: "DeFi Protocol",
      amount: 7500,
      status: "active",
      date: "2024-01-05",
      returns: -2.1,
      developer: "Mike Johnson"
    }
  ];

  const transactionHistory = [
    {
      id: 1,
      type: "deposit",
      amount: 10000,
      status: "completed",
      date: "2024-01-15",
      txHash: "0x1234...5678"
    },
    {
      id: 2,
      type: "withdrawal",
      amount: 2500,
      status: "completed", 
      date: "2024-01-12",
      txHash: "0x2345...6789"
    },
    {
      id: 3,
      type: "investment",
      amount: 5000,
      status: "pending",
      date: "2024-01-10",
      txHash: "0x3456...7890"
    }
  ];

  const activityHistory = [
    {
      id: 1,
      type: "profile_view",
      description: "Viewed Alex Rodriguez's profile",
      date: "2024-01-15 14:30"
    },
    {
      id: 2,
      type: "project_view",
      description: "Viewed AI Trading Bot project details",
      date: "2024-01-15 14:25"
    },
    {
      id: 3,
      type: "search",
      description: "Searched for 'DeFi protocols'",
      date: "2024-01-15 14:20"
    },
    {
      id: 4,
      type: "bookmark",
      description: "Bookmarked NFT Marketplace project",
      date: "2024-01-15 14:15"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "profile_view": return User;
      case "project_view": return Eye;
      case "search": return Filter;
      case "bookmark": return Clock;
      default: return Clock;
    }
  };

  return (
    <AppLayout
      breadcrumbItems={breadcrumbItems}
      pageTitle="History"
      pageDescription="View your complete activity and transaction history"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="investments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200">
            <TabsTrigger value="investments" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Investments</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Investment History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentHistory.map((investment) => (
                    <div
                      key={investment.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900">{investment.projectName}</h3>
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Amount</span>
                          <p className="font-medium">${investment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Developer</span>
                          <p className="font-medium">{investment.developer}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Returns</span>
                          <p className={`font-medium flex items-center ${
                            investment.returns >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {investment.returns >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {investment.returns >= 0 ? '+' : ''}{investment.returns}%
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Date</span>
                          <p className="font-medium">{investment.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${
                            transaction.type === 'deposit' ? 'bg-green-100' :
                            transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            <DollarSign className={`h-4 w-4 ${
                              transaction.type === 'deposit' ? 'text-green-600' :
                              transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900 capitalize">
                              {transaction.type}
                            </h3>
                            <p className="text-sm text-slate-500">{transaction.txHash}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            transaction.type === 'deposit' ? 'text-green-600' : 
                            transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : 
                             transaction.type === 'withdrawal' ? '-' : ''}
                            ${transaction.amount.toLocaleString()}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                            <span className="text-sm text-slate-500">{transaction.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityHistory.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <IconComponent className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900">{activity.description}</p>
                          <p className="text-sm text-slate-500">{activity.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
