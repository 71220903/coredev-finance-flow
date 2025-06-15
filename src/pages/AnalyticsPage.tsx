
import MarketAnalytics from "@/components/MarketAnalytics";
import PortfolioTracker from "@/components/PortfolioTracker";
import TrustScoreHistory from "@/components/TrustScoreHistory";
import CommunityGovernance from "@/components/CommunityGovernance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react";
import AppLayout from "@/components/navigation/AppLayout";

const AnalyticsPage = () => {
  const breadcrumbItems = [
    { label: "Analytics & Insights" }
  ];

  return (
    <AppLayout
      breadcrumbItems={breadcrumbItems}
      pageTitle="Analytics & Insights"
      pageDescription="Comprehensive data visualization and analytics for the CoreDev Zero platform"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="market" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="market" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Market Analytics</span>
              <span className="sm:hidden">Market</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
              <span className="sm:hidden">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="trust" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trust Score</span>
              <span className="sm:hidden">Trust</span>
            </TabsTrigger>
            <TabsTrigger value="governance" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Governance</span>
              <span className="sm:hidden">Gov</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            <MarketAnalytics />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioTracker />
          </TabsContent>

          <TabsContent value="trust" className="space-y-6">
            <TrustScoreHistory />
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <CommunityGovernance />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
