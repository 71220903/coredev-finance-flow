import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MarketAnalytics from "./MarketAnalytics";
import { useAdminControls } from "@/hooks/useAdminControls";
import { useNotificationSystem } from "@/hooks/useNotificationSystem";
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
  Zap,
  Play,
  Pause
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

const AdminPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newUserAddress, setNewUserAddress] = useState("");
  const [platformFeeInput, setPlatformFeeInput] = useState("");

  // Use the new admin controls hook
  const {
    systemSettings,
    loading: adminLoading,
    grantDeveloperRole,
    revokeDeveloperRole,
    togglePlatformPause,
    updatePlatformFee,
    checkAdminRole,
    fetchSystemStats
  } = useAdminControls();

  // Use notification system
  const { notifications, unreadCount, markAllAsRead } = useNotificationSystem();

  const [isAdmin, setIsAdmin] = useState(false);

  // Mock whitelist users data (would be fetched from backend in production)
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
    }
  ]);

  const platformStats = {
    totalUsers: systemSettings.totalUsers,
    activeLoans: 23,
    totalVolume: 2850000,
    successRate: 94.2,
    pendingApplications: whitelistUsers.filter(u => u.status === "pending").length
  };

  // Check admin role on mount
  useEffect(() => {
    const checkRole = async () => {
      const adminStatus = await checkAdminRole();
      setIsAdmin(adminStatus);
      if (adminStatus) {
        fetchSystemStats();
      }
    };
    checkRole();
  }, [checkAdminRole, fetchSystemStats]);

  // Initialize platform fee input
  useEffect(() => {
    setPlatformFeeInput(systemSettings.platformFee.toString());
  }, [systemSettings.platformFee]);

  const handleApproveUser = async (userId: string) => {
    const user = whitelistUsers.find(u => u.id === userId);
    if (!user) return;

    const success = await grantDeveloperRole(user.address);
    if (success) {
      setWhitelistUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: "approved" as const, reviewedBy: "admin", reason: "Approved by admin" }
          : u
      ));
    }
  };

  const handleRejectUser = async (userId: string, reason: string) => {
    const user = whitelistUsers.find(u => u.id === userId);
    if (!user) return;

    // In a real implementation, you might want to call a reject function
    setWhitelistUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: "rejected" as const, reviewedBy: "admin", reason }
        : u
    ));
    
    toast({
      title: "User Rejected ❌",
      description: "User has been rejected and cannot access the platform."
    });
  };

  const handleAddUser = async () => {
    if (newUserAddress.trim()) {
      const success = await grantDeveloperRole(newUserAddress);
      if (success) {
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
      }
    }
  };

  const handleTogglePause = async () => {
    await togglePlatformPause();
  };

  const handleUpdatePlatformFee = async () => {
    const newFee = parseFloat(platformFeeInput);
    if (isNaN(newFee) || newFee < 0 || newFee > 10) {
      toast({
        title: "Invalid Fee",
        description: "Platform fee must be between 0% and 10%",
        variant: "destructive"
      });
      return;
    }

    await updatePlatformFee(newFee);
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

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-slate-600">You need admin privileges to access this panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <span>Advanced Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={systemSettings.isPaused ? "destructive" : "default"}>
                {systemSettings.isPaused ? "PAUSED" : "ACTIVE"}
              </Badge>
              <Button
                variant={systemSettings.isPaused ? "default" : "destructive"}
                size="sm"
                onClick={handleTogglePause}
                disabled={adminLoading}
              >
                {systemSettings.isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume Platform
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Platform
                  </>
                )}
              </Button>
            </div>
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
              <Bell className="h-4 w-4 text-red-600" />
              <span className="text-sm text-slate-600">Notifications</span>
            </div>
            <div className="text-2xl font-bold">{unreadCount}</div>
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
              <CardTitle>Developer Role Management</CardTitle>
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
                <Button 
                  onClick={handleAddUser} 
                  disabled={!newUserAddress.trim() || adminLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Grant Developer Role
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
                      
                      <div className="flex space-x-2">
                        {user.status === "pending" ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveUser(user.id)}
                              disabled={adminLoading}
                              className="transition-all duration-200 hover:scale-105"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectUser(user.id, "Rejected by admin review")}
                              disabled={adminLoading}
                              className="transition-all duration-200 hover:scale-105"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : user.status === "approved" && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => revokeDeveloperRole(user.address)}
                            disabled={adminLoading}
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </div>
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
                  <Button size="sm">
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
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={platformFeeInput}
                      onChange={(e) => setPlatformFeeInput(e.target.value)}
                      step="0.1"
                      min="0"
                      max="10"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUpdatePlatformFee}
                      disabled={adminLoading || platformFeeInput === systemSettings.platformFee.toString()}
                    >
                      Update
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600">Current: {systemSettings.platformFee}%</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Platform Status</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {systemSettings.isPaused ? "Platform Paused" : "Platform Active"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {systemSettings.isPaused 
                          ? "All operations are disabled" 
                          : "All operations are enabled"
                        }
                      </p>
                    </div>
                    <Button
                      variant={systemSettings.isPaused ? "default" : "destructive"}
                      onClick={handleTogglePause}
                      disabled={adminLoading}
                    >
                      {systemSettings.isPaused ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      )}
                    </Button>
                  </div>
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
                    value={85}
                    min="0"
                    max="100"
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-slate-600">Disable platform access for maintenance</p>
                  </div>
                  <Switch
                    checked={false}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>New User Registrations</Label>
                    <p className="text-sm text-slate-600">Allow new users to register</p>
                  </div>
                  <Switch
                    checked={true}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>System Notifications</span>
                </div>
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  Mark All Read
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 20).map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 border rounded-lg ${notification.read ? 'opacity-60' : 'border-blue-200 bg-blue-50'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{notification.description}</p>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={
                          notification.type === 'error' ? 'destructive' :
                          notification.type === 'warning' ? 'secondary' :
                          notification.type === 'success' ? 'default' : 'outline'
                        }>
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled
              >
                <Users className="h-4 w-4 mr-2" />
                Export User Data
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Export Transaction Data
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Export Analytics Data
              </Button>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full" disabled>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
