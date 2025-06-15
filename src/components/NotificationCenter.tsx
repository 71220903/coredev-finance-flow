
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  BellOff,
  Check,
  X,
  DollarSign,
  AlertTriangle,
  Info,
  TrendingUp,
  Users,
  Calendar,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'loan' | 'payment' | 'system' | 'governance';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  metadata?: any;
}

interface NotificationSettings {
  loanUpdates: boolean;
  paymentReminders: boolean;
  governanceVotes: boolean;
  systemMaintenance: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const NotificationCenter = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "loan",
      priority: "high",
      title: "Loan Funded Successfully",
      message: "Your loan request for $50,000 has been fully funded by 12 lenders.",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
      actionable: true,
      metadata: { loanId: "loan-123", amount: 50000 }
    },
    {
      id: "2",
      type: "payment",
      priority: "medium",
      title: "Payment Due in 3 Days",
      message: "Monthly payment of $4,583 is due on January 18, 2024.",
      timestamp: "2024-01-15T09:15:00Z",
      read: false,
      actionable: true,
      metadata: { amount: 4583, dueDate: "2024-01-18" }
    },
    {
      id: "3",
      type: "governance",
      priority: "medium",
      title: "New Governance Proposal",
      message: "Vote on proposal to reduce platform fees from 2% to 1.5%.",
      timestamp: "2024-01-14T16:45:00Z",
      read: true,
      actionable: true,
      metadata: { proposalId: "prop-456" }
    },
    {
      id: "4",
      type: "system",
      priority: "low",
      title: "System Maintenance Scheduled",
      message: "Platform will be under maintenance on Jan 20, 2024 from 2-4 AM UTC.",
      timestamp: "2024-01-13T11:20:00Z",
      read: true,
      actionable: false
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    loanUpdates: true,
    paymentReminders: true,
    governanceVotes: true,
    systemMaintenance: true,
    emailNotifications: true,
    pushNotifications: false
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification deleted",
      description: "Notification has been removed from your inbox."
    });
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'high' ? 'text-red-500' : 
                     priority === 'medium' ? 'text-yellow-500' : 'text-blue-500';
    
    switch (type) {
      case 'loan': return <DollarSign className={`h-4 w-4 ${iconClass}`} />;
      case 'payment': return <Calendar className={`h-4 w-4 ${iconClass}`} />;
      case 'governance': return <Users className={`h-4 w-4 ${iconClass}`} />;
      case 'system': return <Info className={`h-4 w-4 ${iconClass}`} />;
      default: return <Bell className={`h-4 w-4 ${iconClass}`} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}.`
    });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbox">
              Inbox {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="space-y-4">
            <div className="space-y-3">
              {notifications.filter(n => !n.read).map(notification => (
                <div 
                  key={notification.id}
                  className="p-4 border rounded-lg bg-blue-50 border-blue-200 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionable && (
                            <Button size="sm" variant="outline">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {notifications.filter(n => !n.read).length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No unread notifications</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-3">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-lg ${
                    notification.read ? 'bg-slate-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type, notification.priority)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${notification.read ? 'text-slate-600' : ''}`}>
                            {notification.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                        <span className="text-xs text-slate-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Notification Preferences</span>
              </h3>
              
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor={key} className="flex-1 cursor-pointer">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => updateSettings(key as keyof NotificationSettings, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
