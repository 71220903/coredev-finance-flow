
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, TrendingUp, Shield, Code2, Github, DollarSign, Wallet, Star, CheckCircle, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { UserModeSwitch } from "@/components/UserModeSwitch";
import { useWallet } from "@/hooks/useWallet";
import { useAdminDetection } from "@/hooks/useAdminDetection";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useState, useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { isAdmin } = useUserRole();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-detect admin status when wallet is connected
  useAdminDetection();

  // Mock gallery images for community showcase
  const communityImages = [
    { id: 1, title: "Developer Meetup", description: "Local blockchain developers collaborating", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" },
    { id: 2, title: "Code Review Session", description: "Peer-to-peer code reviews and learning", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" },
    { id: 3, title: "Hackathon Winners", description: "Celebrating innovation and creativity", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop" },
    { id: 4, title: "Funding Success", description: "Projects that got funded through our platform", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop" },
    { id: 5, title: "Community Growth", description: "Growing network of trusted developers", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % communityImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-bounce-in" style={{ animationDelay: '-1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-white/90 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <Code2 className="h-8 w-8 text-blue-600 animate-pulse" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CoreDev Zero
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/marketplace" className="text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105 font-medium">
                Marketplace
              </Link>
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105 font-medium">
                Dashboard
              </Link>
              {isConnected && <UserModeSwitch />}
              <div className="animate-scale-in">
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 border-0 animate-bounce-in">
                <Star className="h-3 w-3 mr-1" />
                Decentralized Lending for Developers
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Fund Your Code,
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-float">
                  {" "}Fuel Innovation
                </span>
              </h1>
              
              <div className="text-2xl md:text-3xl font-semibold text-slate-700 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <span className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                  Built for developers, by developers.
                </span>
              </div>
              
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.7s' }}>
                Connect developers who need funding with lenders who believe in their potential. 
                Secure, transparent, and designed for the developer community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.9s' }}>
                {!isConnected ? (
                  <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-slate-200 shadow-lg">
                    <Wallet className="h-5 w-5 text-blue-600 animate-pulse" />
                    <span className="text-slate-700 font-medium">Connect your wallet to get started</span>
                  </div>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      onClick={handleGetStarted} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      {isAdmin ? 'Go to Admin Panel' : 'Enter Dashboard'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" asChild className="px-8 py-4 text-lg font-semibold border-2 hover:bg-slate-50 transition-all duration-300 transform hover:scale-105">
                      <Link to="/marketplace">Explore Markets</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Animated Gallery */}
            <div className="relative animate-fade-in" style={{ animationDelay: '1.1s' }}>
              <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                {/* Main Gallery Container */}
                <div 
                  className="flex transition-transform duration-1000 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {communityImages.map((image, index) => (
                    <div key={image.id} className="min-w-full h-full relative">
                      <img 
                        src={image.image} 
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                        <p className="text-sm opacity-90">{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gallery Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {communityImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce-in">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-full shadow-lg animate-bounce-in" style={{ animationDelay: '0.5s' }}>
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "$2.5M+", label: "Total Funded", icon: DollarSign, color: "text-green-600" },
              { value: "1,200+", label: "Active Developers", icon: Users, color: "text-blue-600" },
              { value: "95%", label: "Repayment Rate", icon: TrendingUp, color: "text-purple-600" }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${0.2 * index}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 mb-4 group-hover:shadow-lg transition-all duration-300">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> CoreDev Zero?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Built by developers, for developers. Experience lending reimagined for the tech community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Github, title: "GitHub Integration", description: "Trust scores based on real GitHub activity and contribution history", color: "text-gray-700", bgColor: "from-gray-50 to-gray-100" },
              { icon: Shield, title: "Smart Risk Assessment", description: "AI-powered evaluation of developer profiles and project potential", color: "text-green-600", bgColor: "from-green-50 to-green-100" },
              { icon: TrendingUp, title: "Competitive Rates", description: "Dynamic interest rates based on trust scores and market conditions", color: "text-purple-600", bgColor: "from-purple-50 to-purple-100" },
              { icon: Users, title: "Community Driven", description: "Peer-to-peer lending with community validation and support", color: "text-orange-600", bgColor: "from-orange-50 to-orange-100" },
              { icon: DollarSign, title: "Flexible Terms", description: "Customizable loan terms that fit your project timeline and needs", color: "text-green-600", bgColor: "from-green-50 to-green-100" },
              { icon: Code2, title: "Developer First", description: "Purpose-built for software developers and tech entrepreneurs", color: "text-blue-600", bgColor: "from-blue-50 to-blue-100" }
            ].map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.bgColor} mb-4 group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: '-3s' }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fade-in">
            Ready to Start Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Journey?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Join thousands of developers and lenders building the future of decentralized finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {!isConnected ? (
              <div className="text-slate-300 bg-white/10 backdrop-blur-sm rounded-xl px-8 py-4 font-medium">
                Connect your wallet above to get started
              </div>
            ) : (
              <Button 
                size="lg" 
                onClick={handleGetStarted} 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-white">CoreDev Zero</span>
              <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                Built for developers, by developers
              </Badge>
            </div>
            <div className="text-sm text-slate-400">
              © 2024 CoreDev Zero. Empowering the developer community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
