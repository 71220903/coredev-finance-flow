import AdminPanel from "@/components/AdminPanel";
import MobileNavigation from "@/components/MobileNavigation";
import AdvancedSearch from "@/components/AdvancedSearch";
import NotificationCenter from "@/components/NotificationCenter";
import SecondaryMarket from "@/components/SecondaryMarket";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";

const AdminPage = () => {
  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);
  };

  const handleReset = () => {
    console.log("Filters reset");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CD</span>
              </div>
              <span className="text-xl font-bold text-slate-900">CoreDev Zero</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/marketplace">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Link>
              </Button>
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <Tabs defaultValue="panel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="panel">Admin Panel</TabsTrigger>
            <TabsTrigger value="search">Advanced Search</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="market">Secondary Market</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="panel">
            <AdminPanel />
          </TabsContent>

          <TabsContent value="search">
            <AdvancedSearch 
              onFiltersChange={handleFiltersChange}
              onReset={handleReset}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="market">
            <SecondaryMarket />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceOptimizer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
