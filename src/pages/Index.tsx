
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, TrendingUp, Shield, Code2, Github, DollarSign, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { UserModeSwitch } from "@/components/UserModeSwitch";
import { useWallet } from "@/hooks/useWallet";
import { useAdminDetection } from "@/hooks/useAdminDetection";
import { useUserRole } from "@/contexts/UserRoleContext";

const Index = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { isAdmin } = useUserRole();
  
  // Auto-detect admin status when wallet is connected
  useAdminDetection();

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">CoreDev Zero</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/marketplace" className="text-slate-600 hover:text-slate-900 transition-colors">
                Marketplace
              </Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              {isConnected && <UserModeSwitch />}
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
            Decentralized Lending for Developers
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Fund Your Code,
            <span className="text-blue-600"> Fuel Innovation</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Connect developers who need funding with lenders who believe in their potential. 
            Secure, transparent, and designed for the developer community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isConnected ? (
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <span className="text-slate-600">Connect your wallet to get started</span>
              </div>
            ) : (
              <>
                <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                  {isAdmin ? 'Go to Admin Panel' : 'Enter Dashboard'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/marketplace">Explore Markets</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">$2.5M+</div>
              <div className="text-slate-600">Total Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">1,200+</div>
              <div className="text-slate-600">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">95%</div>
              <div className="text-slate-600">Repayment Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose CoreDev Zero?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built by developers, for developers. Experience lending reimagined for the tech community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Github className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>
                  Trust scores based on real GitHub activity and contribution history
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Smart Risk Assessment</CardTitle>
                <CardDescription>
                  AI-powered evaluation of developer profiles and project potential
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Competitive Rates</CardTitle>
                <CardDescription>
                  Dynamic interest rates based on trust scores and market conditions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Peer-to-peer lending with community validation and support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Flexible Terms</CardTitle>
                <CardDescription>
                  Customizable loan terms that fit your project timeline and needs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Code2 className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Developer First</CardTitle>
                <CardDescription>
                  Purpose-built for software developers and tech entrepreneurs
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers and lenders building the future of decentralized finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isConnected ? (
              <div className="text-slate-300">
                Connect your wallet above to get started
              </div>
            ) : (
              <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                Get Started Now
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-slate-900">CoreDev Zero</span>
            </div>
            <div className="text-sm text-slate-600">
              © 2024 CoreDev Zero. Built for developers, by developers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
