
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Github,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<'lender' | 'borrower'>('borrower');

  const mockLoans = [
    {
      id: 1,
      borrower: "johndoe",
      githubHandle: "@johndoe",
      amount: 5000,
      interestRate: 8.5,
      duration: "6 months",
      purpose: "React Native mobile app development",
      trustScore: 85,
      status: "active",
      nextPayment: "2024-01-15",
      progress: 60
    },
    {
      id: 2,
      borrower: "sarahdev",
      githubHandle: "@sarahcodes",
      amount: 12000,
      interestRate: 7.2,
      duration: "12 months",
      purpose: "AI/ML startup development",
      trustScore: 92,
      status: "pending",
      nextPayment: null,
      progress: 0
    }
  ];

  const myBorrowedLoans = [
    {
      id: 1,
      lender: "techfund",
      amount: 8000,
      interestRate: 9.0,
      duration: "8 months",
      remainingAmount: 6400,
      nextPayment: "2024-01-20",
      dueAmount: 800,
      status: "active"
    }
  ];

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
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setUserRole('borrower')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'borrower' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Borrower
                </button>
                <button
                  onClick={() => setUserRole('lender')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    userRole === 'lender' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lender
                </button>
              </div>
              <Button asChild>
                <Link to="/marketplace">Marketplace</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {userRole === 'lender' ? 'Lender Dashboard' : 'Developer Dashboard'}
          </h1>
          <p className="text-slate-600">
            {userRole === 'lender' 
              ? 'Monitor your investments and discover new lending opportunities' 
              : 'Manage your loans and funding requests'
            }
          </p>
        </div>

        {userRole === 'lender' ? (
          // Lender Dashboard
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,500</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">2 pending approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,240</div>
                  <p className="text-xs text-muted-foreground">8.2% average APR</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.1%</div>
                  <p className="text-xs text-muted-foreground">Below market average</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Loans */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Loans</CardTitle>
                  <CardDescription>Your current lending portfolio</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/marketplace">Find New Opportunities</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Github className="h-4 w-4 text-slate-600" />
                          <span className="font-medium">{loan.githubHandle}</span>
                        </div>
                        <Badge variant={loan.status === 'active' ? 'default' : 'secondary'}>
                          {loan.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-slate-600">{loan.trustScore}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${loan.amount.toLocaleString()}</div>
                        <div className="text-sm text-slate-600">{loan.interestRate}% APR</div>
                      </div>
                      {loan.status === 'active' && (
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Progress</div>
                          <Progress value={loan.progress} className="w-20" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Borrower Dashboard
          <>
            {/* Profile Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <Github className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">@johndoe</CardTitle>
                      <CardDescription>Full Stack Developer • 3 years experience</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-semibold">85</span>
                    </div>
                    <Badge variant="outline">Trust Score</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,000</div>
                  <p className="text-xs text-muted-foreground">1 active loan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$800</div>
                  <p className="text-xs text-muted-foreground">Due Jan 20, 2024</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,000</div>
                  <p className="text-xs text-muted-foreground">Based on trust score</p>
                </CardContent>
              </Card>
            </div>

            {/* Active Loans */}
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Loans</CardTitle>
                  <CardDescription>Your current borrowing status</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/marketplace">Request New Loan</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBorrowedLoans.map((loan) => (
                    <div key={loan.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">Loan from @{loan.lender}</div>
                            <div className="text-sm text-slate-600">{loan.interestRate}% APR • {loan.duration}</div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${loan.amount.toLocaleString()}</div>
                          <div className="text-sm text-slate-600">${loan.remainingAmount.toLocaleString()} remaining</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)}%</span>
                          </div>
                          <Progress value={((loan.amount - loan.remainingAmount) / loan.amount) * 100} />
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-600">Next payment</div>
                          <div className="font-semibold">${loan.dueAmount}</div>
                          <div className="text-xs text-slate-600">{loan.nextPayment}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
