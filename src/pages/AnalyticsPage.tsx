
import MarketAnalytics from "@/components/MarketAnalytics";
import PortfolioTracker from "@/components/PortfolioTracker";
import TrustScoreHistory from "@/components/TrustScoreHistory";
import CommunityGovernance from "@/components/CommunityGovernance";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AnalyticsPage = () => {
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
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Link to="/marketplace" className="text-slate-600 hover:text-slate-900 transition-colors">
                Marketplace
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Analytics & Insights
          </h1>
          <p className="text-slate-600">
            Comprehensive data visualization and analytics for the CoreDev Zero platform
          </p>
        </div>

        <Tabs defaultValue="market" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
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
    </div>
  );
};

export default AnalyticsPage;
