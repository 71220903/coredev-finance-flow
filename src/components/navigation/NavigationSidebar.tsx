import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Search,
  BarChart3,
  User,
  Shield,
  Plus,
  Trophy,
  Settings,
  HelpCircle,
  Bookmark,
  Clock,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";

const NavigationSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserRole();
  const { isConnected } = useWallet();

  const mainNavItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Marketplace", url: "/marketplace", icon: Search },
    { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
    { title: "Analytics", url: "/analytics", icon: TrendingUp },
  ];

  const userNavItems = [
    { title: "Profile", url: "/developer/1", icon: User },
    { title: "Achievements", url: "/achievements", icon: Trophy },
    { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
    { title: "History", url: "/history", icon: Clock },
  ];

  const adminNavItems = isAdmin ? [
    { title: "Admin Panel", url: "/admin", icon: Shield, badge: "Admin" },
  ] : [];

  const quickActions = [
    { title: "Create Market", icon: Plus, action: "create-market" },
    { title: "Deposit Funds", icon: DollarSign, action: "deposit" },
  ];

  const isActiveRoute = (url: string) => {
    return location.pathname === url;
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
    
    switch (action) {
      case "create-market":
        if (!isConnected) {
          toast({
            title: "Wallet Connection Required",
            description: "Please connect your wallet to create a market",
            variant: "destructive"
          });
          return;
        }
        // Navigate to marketplace with create market modal or form
        navigate("/marketplace?action=create");
        toast({
          title: "Create Market",
          description: "Create market functionality will be available soon",
        });
        break;
      
      case "deposit":
        if (!isConnected) {
          toast({
            title: "Wallet Connection Required", 
            description: "Please connect your wallet to deposit funds",
            variant: "destructive"
          });
          return;
        }
        // Navigate to dashboard with deposit section
        navigate("/dashboard?section=deposit");
        toast({
          title: "Deposit Funds",
          description: "Deposit functionality will be available soon",
        });
        break;
        
      default:
        console.log(`Unhandled action: ${action}`);
    }
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleHelpSupport = () => {
    navigate("/help-support");
  };

  return (
    <Sidebar className="border-r border-slate-200">
      {/* Sidebar Header with Logo - Desktop Only */}
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CD</span>
          </div>
          <span className="font-bold text-slate-900">CoreDev Zero</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActiveRoute(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section - Only when connected */}
        {isConnected && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActiveRoute(item.url)}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Section */}
        {adminNavItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActiveRoute(item.url)}>
                      <Link to={item.url} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <item.icon className="h-4 w-4 mr-2" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Quick Actions - Only when connected */}
        {isConnected && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.title}
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={handleSettings}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={handleHelpSupport}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default NavigationSidebar;
