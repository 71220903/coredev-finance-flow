
import AdminPanel from "@/components/AdminPanel";
import MobileNavigation from "@/components/MobileNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPage = () => {
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
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        <AdminPanel />
      </div>
    </div>
  );
};

export default AdminPage;
