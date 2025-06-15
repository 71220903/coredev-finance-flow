
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Users,
  Shield,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhitelistUser {
  id: string;
  address: string;
  githubHandle: string;
  trustScore: number;
  status: "pending" | "approved" | "rejected";
  requestedDate: string;
  reviewedBy?: string;
  reason?: string;
}

interface PlatformStats {
  totalUsers: number;
  activeLoans: number;
  totalVolume: number;
  successRate: number;
  pendingApplications: number;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newUserAddress, setNewUserAddress] = useState("");

  const [whitelistUsers, setWhitelistUsers] = useState<WhitelistUser[]>([
    {
      id: "1",
      address: "0x1234...5678",
      githubHandle: "@newdev123",
      trustScore: 65,
      status: "pending",
      requestedDate: "2024-01-15",
    },
    {
      id: "2",
      address: "0x8765...4321",
      githubHandle: "@veteran_coder",
      trustScore: 92,
      status: "approved",
      requestedDate: "2024-01-10",
      reviewedBy: "admin",
      reason: "High trust score and verified GitHub"
    },
    {
      id: "3",
      address: "0x9999...1111",
      githubHandle: "@suspicious_user",
      trustScore: 25,
      status: "rejected",
      requestedDate: "2024-01-12",
      reviewedBy: "admin",
      reason: "Low trust score and unverified profile"
    }
  ]);

  const platformStats: PlatformStats = {
    totalUsers: 1247,
    activeLoans: 23,
    totalVolume: 2850000,
    successRate: 94.2,
    pendingApplications: whitelistUsers.filter(u => u.status === "pending").length
  };

  const handleApproveUser = (userId: string) => {
    setWhitelistUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: "approved" as const, reviewedBy: "admin", reason: "Approved by admin" }
        : user
    ));
    
    toast({
      title: "User Approved ✅",
      description: "User has been added to the whitelist and can now access the platform."
    });
  };

  const handleRejectUser = (userId: string, reason: string) => {
    setWhitelistUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: "rejected" as const, reviewedBy: "admin", reason }
        : user
    ));
    
    toast({
      title: "User Rejected ❌",
      description: "User has been rejected and cannot access the platform."
    });
  };

  const handleAddUser = () => {
    if (newUserAddress.trim()) {
      const newUser: WhitelistUser = {
        id: Date.now().toString(),
        address: newUserAddress,
        githubHandle: "@manual_add",
        trustScore: 75,
        status: "approved",
        requestedDate: new Date().toISOString().split('T')[0],
        reviewedBy: "admin",
        reason: "Manually added by admin"
      };
      
      setWhitelistUsers(prev => [newUser, ...prev]);
      setNewUserAddress("");
      
      toast({
        title: "User Added ✅",
        description: "User has been manually added to the whitelist."
      });
    }
  };

  const filteredUsers = whitelistUsers.filter(user => {
    const matchesSearch = user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.githubHandle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "pending": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Admin Panel</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-slate-600">Total Users</span>
            </div>
            <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-600">Active Loans</span>
            </div>
            <div className="text-2xl font-bold">{platformStats.activeLoans}</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-slate-600">Total Volume</span>
            </div>
            <div className="text-2xl font-bold">${(platformStats.totalVolume / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-slate-600">Success Rate</span>
            </div>
            <div className="text-2xl font-bold">{platformStats.successRate}%</div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-slate-600">Pending</span>
            </div>
            <div className="text-2xl font-bold">{platformStats.pendingApplications}</div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="whitelist">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="whitelist">Whitelist Management</TabsTrigger>
          <TabsTrigger value="loans">Loan Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="whitelist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Whitelist Management</CardTitle>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by address or GitHub handle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Add User Manually */}
              <div className="flex space-x-2">
                <Input
                  placeholder="0x... wallet address"
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddUser} disabled={!newUserAddress.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              {/* User List */}
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="font-medium">{user.address}</div>
                          <Badge className={getStatusColor(user.status)}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1">{user.status}</span>
                          </Badge>
                          <div className="text-sm text-slate-600">Trust: {user.trustScore}</div>
                        </div>
                        
                        <div className="text-sm text-slate-600 mb-1">
                          GitHub: {user.githubHandle} • Applied: {user.requestedDate}
                        </div>
                        
                        {user.reason && (
                          <div className="text-sm text-slate-500">
                            Reason: {user.reason}
                          </div>
                        )}
                      </div>
                      
                      {user.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveUser(user.id)}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectUser(user.id, "Rejected by admin review")}
                            className="transition-all duration-200 hover:scale-105"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                Loan monitoring features coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                Platform configuration settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
