import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarketAnalytics } from "./MarketAnalytics";
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
  Filter,
  Ban,
  Mail,
  Bell,
  Database,
  Key,
  Globe,
  Zap
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
  const [systemSettings, setSystemSettings] = useState({
    platformFee: 2.0,
    minLoanAmount: 1000,
    maxLoanAmount: 100000,
    defaultInterestRate: 12.0,
    maxLoanTerm: 24,
    autoApprovalThreshold: 85,
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    slackIntegration: false
  });

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

  const updateSystemSetting = (key: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated ⚙️",
      description: `${key.replace(/([A-Z])/g, ' $1')} has been updated successfully.`
    });
  };

  const sendBulkNotification = () => {
    toast({
      title: "Notification Sent 📢",
      description: "Bulk notification has been sent to all users."
    });
  };

  const exportData = (type: string) => {
    toast({
      title: "Export Started 📊",
      description: `${type} data export has been initiated. You'll receive an email when complete.`
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Advanced Admin Panel</span>
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

      {/* Enhanced Admin Tabs */}
      <Tabs defaultValue="whitelist">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="whitelist">Users</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
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
              <CardTitle>Loan Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">23</div>
                      <div className="text-sm text-slate-600">Pending Review</div>
                      <Button size="sm" className="mt-2">Review All</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">5</div>
                      <div className="text-sm text-slate-600">Overdue</div>
                      <Button size="sm" variant="destructive" className="mt-2">Take Action</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <div className="text-sm text-slate-600">Active Loans</div>
                      <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Recent Loan Applications</h3>
                  <Button size="sm" onClick={() => exportData("loans")}>
                    Export Data
                  </Button>
                </div>
                
                <div className="text-center py-8 text-slate-500">
                  Detailed loan management interface would be implemented here...
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <MarketAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Platform Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input
                    type="number"
                    value={systemSettings.platformFee}
                    onChange={(e) => updateSystemSetting('platformFee', parseFloat(e.target.value))}
                    step="0.1"
                    min="0"
                    max="10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Minimum Loan Amount ($)</Label>
                  <Input
                    type="number"
                    value={systemSettings.minLoanAmount}
                    onChange={(e) => updateSystemSetting('minLoanAmount', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Maximum Loan Amount ($)</Label>
                  <Input
                    type="number"
                    value={systemSettings.maxLoanAmount}
                    onChange={(e) => updateSystemSetting('maxLoanAmount', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Default Interest Rate (%)</Label>
                  <Input
                    type="number"
                    value={systemSettings.defaultInterestRate}
                    onChange={(e) => updateSystemSetting('defaultInterestRate', parseFloat(e.target.value))}
                    step="0.1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Security & Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Auto-Approval Trust Threshold</Label>
                  <Input
                    type="number"
                    value={systemSettings.autoApprovalThreshold}
                    onChange={(e) => updateSystemSetting('autoApprovalThreshold', parseInt(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-slate-600">Disable platform access for maintenance</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => updateSystemSetting('maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>New User Registrations</Label>
                    <p className="text-sm text-slate-600">Allow new users to register</p>
                  </div>
                  <Switch
                    checked={systemSettings.newRegistrations}
                    onCheckedChange={(checked) => updateSystemSetting('newRegistrations', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notification Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Send Bulk Notification</h3>
                  <div className="space-y-2">
                    <Label>Message Title</Label>
                    <Input placeholder="Enter notification title..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Message Content</Label>
                    <Textarea placeholder="Enter notification message..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="borrowers">Borrowers Only</SelectItem>
                        <SelectItem value="lenders">Lenders Only</SelectItem>
                        <SelectItem value="high-trust">High Trust Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={sendBulkNotification} className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Notification Settings</h3>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Email Notifications</Label>
                    <Switch
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) => updateSystemSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Slack Integration</Label>
                    <Switch
                      checked={systemSettings.slackIntegration}
                      onCheckedChange={(checked) => updateSystemSetting('slackIntegration', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Templates</Label>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportData("users")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Export User Data
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportData("transactions")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Export Transaction Data
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportData("analytics")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Export Analytics Data
                </Button>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Stop
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>API & Integrations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Rate Limiting</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rate limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/hour</SelectItem>
                      <SelectItem value="500">500 requests/hour</SelectItem>
                      <SelectItem value="1000">1000 requests/hour</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Webhook Configuration
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  API Key Management
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
