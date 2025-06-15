
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "./admin/AdminHeader";
import { PlatformStats } from "./admin/PlatformStats";
import { UserManagement } from "./admin/UserManagement";
import MarketAnalytics from "./MarketAnalytics";
import { useEnhancedAdminControls } from "@/hooks/useEnhancedAdminControls";
import { useNotificationSystem } from "@/hooks/useNotificationSystem";
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Shield,
  Bell
} from "lucide-react";

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
  // Use the enhanced admin controls hook
  const {
    loading: adminLoading,
    systemStatus,
    checkAdminRole,
    togglePlatformPause,
    grantDeveloperRole,
    fetchPlatformStatus
  } = useEnhancedAdminControls();

  // Use notification system
  const { notifications, unreadCount, markAllAsRead } = useNotificationSystem();

  const [isAdmin, setIsAdmin] = useState(false);

  // Mock whitelist users data
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
    totalUsers: systemStatus.totalMarkets,
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
        fetchPlatformStatus();
      }
    };
    checkRole();
  }, [checkAdminRole, fetchPlatformStatus]);

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
    setWhitelistUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: "rejected" as const, reviewedBy: "admin", reason }
        : u
    ));
  };

  const handleAddUser = async (address: string) => {
    const success = await grantDeveloperRole(address);
    if (success) {
      const newUser: WhitelistUser = {
        id: Date.now().toString(),
        address,
        githubHandle: "@manual_add",
        trustScore: 75,
        status: "approved",
        requestedDate: new Date().toISOString().split('T')[0],
        reviewedBy: "admin",
        reason: "Manually added by admin"
      };
      
      setWhitelistUsers(prev => [newUser, ...prev]);
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
        <AdminHeader 
          isPaused={systemStatus.isPaused}
          onTogglePause={togglePlatformPause}
          loading={adminLoading}
        />
      </Card>

      {/* Platform Stats */}
      <PlatformStats
        totalUsers={platformStats.totalUsers}
        activeLoans={platformStats.activeLoans}
        totalVolume={platformStats.totalVolume}
        successRate={platformStats.successRate}
        unreadCount={unreadCount}
      />

      {/* Enhanced Admin Tabs */}
      <Tabs defaultValue="whitelist">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whitelist">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="whitelist" className="space-y-4">
          <UserManagement
            users={whitelistUsers}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onRevokeUser={() => {}} // Placeholder - would implement role revocation
            onAddUser={handleAddUser}
            loading={adminLoading}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <MarketAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Platform Status</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        Platform is {systemStatus.isPaused ? 'Paused' : 'Active'}
                      </div>
                      <p className="text-sm text-slate-600">
                        {systemStatus.isPaused 
                          ? 'All operations are suspended' 
                          : 'All systems operational'
                        }
                      </p>
                    </div>
                    <Badge variant={systemStatus.isPaused ? "destructive" : "default"}>
                      {systemStatus.isPaused ? "PAUSED" : "ACTIVE"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Total Staked in Vault</Label>
                  <div className="p-3 border rounded-lg">
                    <div className="text-lg font-semibold">
                      {parseFloat(systemStatus.totalStaked) / 1e18} tCORE2
                    </div>
                    <p className="text-sm text-slate-600">
                      Current staking vault balance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-slate-600">Advanced system controls</p>
                  </div>
                  <Switch checked={false} disabled />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">System Notifications</h3>
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  Mark All Read
                </Button>
              </div>
              
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
      </Tabs>
    </div>
  );
};

export default AdminPanel;
