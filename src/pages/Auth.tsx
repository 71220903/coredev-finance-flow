
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Github, Code2, Users, DollarSign, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);

  const handleGithubConnect = () => {
    setIsConnectingGithub(true);
    // Simulate GitHub OAuth flow
    setTimeout(() => {
      setIsConnectingGithub(false);
      // Redirect to dashboard after successful auth
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Code2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">CoreDev Zero</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Join the Developer Finance Revolution</h1>
          <p className="text-slate-600">Connect your GitHub and start lending or borrowing today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="h-5 w-5 text-blue-600" />
                  <span>GitHub-Powered Trust</span>
                </CardTitle>
                <CardDescription>
                  Your trust score is calculated based on your real GitHub activity, contributions, and project history.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Community Driven</span>
                </CardTitle>
                <CardDescription>
                  Join a community of developers helping each other build amazing projects through peer-to-peer lending.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span>Fair Interest Rates</span>
                </CardTitle>
                <CardDescription>
                  Competitive rates based on trust scores and project potential, not traditional credit metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span>Secure & Transparent</span>
                </CardTitle>
                <CardDescription>
                  Built on blockchain technology with smart contracts ensuring secure and transparent transactions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Auth Form */}
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Choose your role and connect your GitHub account to begin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="borrower" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="borrower">I need funding</TabsTrigger>
                  <TabsTrigger value="lender">I want to lend</TabsTrigger>
                </TabsList>
                
                <TabsContent value="borrower" className="space-y-4">
                  <div className="text-center py-4">
                    <h3 className="text-lg font-semibold mb-2">Join as a Borrower</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Get funding for your development projects based on your GitHub reputation
                    </p>
                    <div className="flex justify-center space-x-4 text-sm">
                      <Badge variant="outline">Up to $50K</Badge>
                      <Badge variant="outline">6-24 months</Badge>
                      <Badge variant="outline">5-15% APR</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="borrower-email">Email</Label>
                      <Input id="borrower-email" type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="borrower-name">Full Name</Label>
                      <Input id="borrower-name" placeholder="John Doe" />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleGithubConnect}
                      disabled={isConnectingGithub}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      {isConnectingGithub ? "Connecting..." : "Connect GitHub & Continue"}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="lender" className="space-y-4">
                  <div className="text-center py-4">
                    <h3 className="text-lg font-semibold mb-2">Join as a Lender</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Invest in promising developers and earn competitive returns
                    </p>
                    <div className="flex justify-center space-x-4 text-sm">
                      <Badge variant="outline">5-15% Returns</Badge>
                      <Badge variant="outline">Diversified Risk</Badge>
                      <Badge variant="outline">Community Impact</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lender-email">Email</Label>
                      <Input id="lender-email" type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="lender-name">Full Name</Label>
                      <Input id="lender-name" placeholder="Jane Smith" />
                    </div>
                    <div>
                      <Label htmlFor="lender-investment">Initial Investment Amount</Label>
                      <Input id="lender-investment" type="number" placeholder="5000" />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleGithubConnect}
                      disabled={isConnectingGithub}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      {isConnectingGithub ? "Connecting..." : "Connect GitHub & Continue"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center text-sm text-slate-600">
                <p>
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
