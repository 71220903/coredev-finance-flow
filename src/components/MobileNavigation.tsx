
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Home, 
  Search, 
  Plus, 
  User, 
  Settings,
  TrendingUp,
  Shield,
  Trophy,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string;
}

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "marketplace", label: "Marketplace", icon: Search, href: "/marketplace" },
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, href: "/dashboard" },
    { id: "profile", label: "Profile", icon: User, href: "/developer/1" },
    { id: "admin", label: "Admin", icon: Shield, href: "/admin", badge: "Admin" },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="grid grid-cols-5 py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`flex flex-col items-center py-2 px-1 transition-all duration-200 ${
                isActiveRoute(item.href)
                  ? "text-blue-600 scale-110"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
              {isActiveRoute(item.href) && (
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1 animate-pulse" />
              )}
            </Link>
          ))}
          
          {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center py-2 px-1 text-slate-600 hover:text-blue-600 transition-all duration-200">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CD</span>
                    </div>
                    <span className="text-lg font-bold">CoreDev Zero</span>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
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

                {/* Quick Actions */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      className="w-full justify-start transition-all duration-200 hover:scale-105" 
                      onClick={() => setIsOpen(false)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Market
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start transition-all duration-200 hover:scale-105"
                      onClick={() => setIsOpen(false)}
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      View Achievements
                    </Button>
                  </div>
                </div>

                {/* App Info */}
                <div className="pt-4 border-t border-slate-200 text-center">
                  <div className="text-sm text-slate-500">
                    CoreDev Zero v1.0
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Decentralized Developer Lending
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

export default MobileNavigation;
