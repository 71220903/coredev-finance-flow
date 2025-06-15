
import AdminPanel from "@/components/AdminPanel";
import AdvancedSearch from "@/components/AdvancedSearch";
import NotificationCenter from "@/components/NotificationCenter";
import SecondaryMarket from "@/components/SecondaryMarket";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Search, Bell, TrendingUp, Zap } from "lucide-react";
import AppLayout from "@/components/navigation/AppLayout";

const AdminPage = () => {
  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);
  };

  const handleReset = () => {
    console.log("Filters reset");
  };

  const breadcrumbItems = [
    { label: "Admin Panel" }
  ];

  return (
    <AppLayout
      breadcrumbItems={breadcrumbItems}
      pageTitle="Admin Panel"
      pageDescription="Comprehensive administration tools for the CoreDev Zero platform"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="panel" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-slate-200">
            <TabsTrigger value="panel" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Panel</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced Search</span>
              <span className="sm:hidden">Search</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Secondary Market</span>
              <span className="sm:hidden">Market</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Perf</span>
            </TabsTrigger>
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
    </AppLayout>
  );
};

export default AdminPage;
