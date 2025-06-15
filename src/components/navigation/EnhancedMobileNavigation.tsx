
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  Home, 
  Search, 
  BarChart3, 
  User, 
  Settings,
  TrendingUp,
  Shield,
  Trophy,
  X,
  Plus,
  DollarSign,
  Bell,
  Bookmark,
  Clock
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserModeSwitch } from "@/components/UserModeSwitch";
import { useWallet } from "@/hooks/useWallet";
import { useUserRole } from "@/contexts/UserRoleContext";

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string;
}

const EnhancedMobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { isConnected } = useWallet();
  const { isAdmin } = useUserRole();

  const bottomNavItems: NavigationItem[] = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "marketplace", label: "Market", icon: Search, href: "/marketplace" },
    { id: "dashboard", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, href: "/analytics" },
  ];

  const menuItems: NavigationItem[] = [
    { id: "profile", label: "Profile", icon: User, href: "/developer/1" },
    { id: "achievements", label: "Achievements", icon: Trophy, href: "/achievements" },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
    { id: "history", label: "History", icon: Clock, href: "/history" },
    ...(isAdmin ? [{ id: "admin", label: "Admin Panel", icon: Shield, href: "/admin", badge: "Admin" }] : []),
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  const quickActions = [
    { id: "create-market", label: "Create Market", icon: Plus },
    { id: "deposit", label: "Deposit Funds", icon: DollarSign },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleQuickAction = (actionId: string) => {
    console.log(`Quick action: ${actionId}`);
    setIsOpen(false);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="lg:hidden">
      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-lg">
        <div className="grid grid-cols-5 py-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`flex flex-col items-center py-2 px-1 transition-all duration-200 relative ${
                isActiveRoute(item.href)
                  ? "text-blue-600 scale-105"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {isActiveRoute(item.href) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActiveRoute(item.href) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
          
          {/* Enhanced Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center py-2 px-1 text-slate-600 hover:text-blue-600 transition-all duration-200 relative">
                <div className="relative">
                  <Menu className="h-5 w-5" />
                  {isConnected && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CD</span>
                      </div>
                      <span className="text-lg font-bold">CoreDev Zero</span>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* User Mode Switch */}
                  {isConnected && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-900">Mode</h4>
                      <UserModeSwitch />
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-900">Navigation</h4>
                    <div className="space-y-1">
                      {filteredMenuItems.map((item) => (
                        <Link
                          key={item.id}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 group ${
                            isActiveRoute(item.href)
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          {isActiveRoute(item.href) && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {isConnected && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-900">Quick Actions</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {quickActions.map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            className="w-full justify-start transition-all duration-200 hover:scale-105"
                            onClick={() => handleQuickAction(action.id)}
                          >
                            <action.icon className="h-4 w-4 mr-2" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <div className="text-center space-y-1">
                    <div className="text-sm text-slate-500">CoreDev Zero v1.0</div>
                    <div className="text-xs text-slate-400">Decentralized Developer Lending</div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-16" />
    </div>
  );
};

export default EnhancedMobileNavigation;
