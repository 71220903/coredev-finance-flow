
import ProjectDataRoom from "@/components/ProjectDataRoom";
import TrustScoreWidget from "@/components/TrustScoreWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionGate } from "@/components/TransactionGate";
import { BrowseModeIndicator } from "@/components/BrowseModeIndicator";
import { ArrowLeft, Github, User, Bookmark, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";

const ProjectDetailsPage = () => {
  const { projectId } = useParams();

  // Mock developer data for the project owner
  const projectOwner = {
    name: "Alex Rodriguez",
    githubHandle: "@alexcoder",
    trustScore: 88,
    trustBreakdown: {
      github: 35,
      codeQuality: 28,
      community: 20,
      onChain: 5
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
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

      {/* Browse Mode Indicator */}
      <BrowseModeIndicator />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProjectDataRoom projectId={projectId || "1"} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Owner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{projectOwner.name}</div>
                    <div className="text-sm text-slate-600">{projectOwner.githubHandle}</div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/developer/${projectOwner.githubHandle.slice(1)}`}>
                    <User className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Trust Score */}
            <TrustScoreWidget 
              score={projectOwner.trustScore} 
              breakdown={projectOwner.trustBreakdown}
            />

            {/* Investment Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investment Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TransactionGate action="Fund This Project" description="To fund this project, you need to connect your wallet to make transactions.">
                  <Button className="w-full" size="lg">
                    Fund This Project
                  </Button>
                </TransactionGate>
                
                <Button variant="outline" className="w-full">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save to Watchlist
                </Button>
                
                <Button variant="ghost" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
