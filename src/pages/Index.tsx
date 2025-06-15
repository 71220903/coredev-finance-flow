
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, TrendingUp, Shield, Code2, Github, DollarSign, Wallet, Star, CheckCircle, Play, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Community showcase images
  const communityImages = [
    { 
      id: 1, 
      title: "Developer Meetup", 
      description: "Local blockchain developers collaborating", 
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      category: "Community"
    },
    { 
      id: 2, 
      title: "Code Review Session", 
      description: "Peer-to-peer code reviews and learning", 
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
      category: "Development"
    },
    { 
      id: 3, 
      title: "Hackathon Winners", 
      description: "Celebrating innovation and creativity", 
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
      category: "Innovation"
    },
    { 
      id: 4, 
      title: "Funding Success", 
      description: "Projects that got funded through our platform", 
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      category: "Success"
    },
    { 
      id: 5, 
      title: "Community Growth", 
      description: "Growing network of trusted developers", 
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      category: "Network"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % communityImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % communityImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + communityImages.length) % communityImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">CoreDev Zero</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/marketplace" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Marketplace
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Dashboard
              </Link>
              {isConnected && <UserModeSwitch />}
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full"></div>
          <div className="absolute top-40 right-40 w-48 h-48 bg-purple-500/5 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Star className="h-4 w-4" />
                <span>Decentralized Lending for Developers</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Fund Your Code,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Fuel Innovation
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 font-medium">
                  Built for developers, by developers.
                </p>
              </div>
              
              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Connect developers who need funding with lenders who believe in their potential. 
                Secure, transparent, and designed for the developer community.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!isConnected ? (
                  <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-6 py-4">
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">Connect your wallet to get started</span>
                  </div>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      onClick={handleGetStarted} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      {isAdmin ? 'Go to Admin Panel' : 'Enter Dashboard'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" asChild className="px-8 py-3 text-base font-semibold border-2">
                      <Link to="/marketplace">Explore Markets</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Gallery */}
            <div className="relative">
              <div className="relative">
                {/* Main Gallery Container */}
                <div className="relative h-[500px] bg-white rounded-2xl shadow-2xl shadow-gray-200/50 overflow-hidden">
                  <div 
                    className="flex transition-transform duration-700 ease-out h-full"
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
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-3">
                            {image.category}
                          </div>
                          <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                          <p className="text-white/90 text-sm">{image.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Gallery Indicators */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
                </div>

                {/* Floating Success Badge */}
                <div className="absolute -bottom-6 -left-6 bg-green-500 text-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6" />
                    <div>
                      <div className="font-semibold">Verified</div>
                      <div className="text-sm opacity-90">Projects</div>
                    </div>
                  </div>
                </div>

                {/* Floating Community Badge */}
                <div className="absolute -top-6 -right-6 bg-purple-500 text-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6" />
                    <div>
                      <div className="font-semibold">1200+</div>
                      <div className="text-sm opacity-90">Developers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "$2.5M+", label: "Total Funded", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
              { value: "1,200+", label: "Active Developers", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
              { value: "95%", label: "Repayment Rate", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> CoreDev Zero?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built by developers, for developers. Experience lending reimagined for the tech community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Github, title: "GitHub Integration", description: "Trust scores based on real GitHub activity and contribution history", color: "text-gray-700", bgColor: "bg-gray-50" },
              { icon: Shield, title: "Smart Risk Assessment", description: "AI-powered evaluation of developer profiles and project potential", color: "text-green-600", bgColor: "bg-green-50" },
              { icon: TrendingUp, title: "Competitive Rates", description: "Dynamic interest rates based on trust scores and market conditions", color: "text-purple-600", bgColor: "bg-purple-50" },
              { icon: Users, title: "Community Driven", description: "Peer-to-peer lending with community validation and support", color: "text-orange-600", bgColor: "bg-orange-50" },
              { icon: DollarSign, title: "Flexible Terms", description: "Customizable loan terms that fit your project timeline and needs", color: "text-green-600", bgColor: "bg-green-50" },
              { icon: Code2, title: "Developer First", description: "Purpose-built for software developers and tech entrepreneurs", color: "text-blue-600", bgColor: "bg-blue-50" }
            ].map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 bg-white">
                <CardHeader className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="20" cy="20" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Start Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Journey?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of developers and lenders building the future of decentralized finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!isConnected ? (
              <div className="text-gray-300 bg-white/10 backdrop-blur-sm rounded-xl px-8 py-4 font-medium">
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
      <footer className="bg-gray-900 border-t border-gray-800 px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">CoreDev Zero</span>
              <span className="text-sm text-gray-400 ml-4">
                Built for developers, by developers
              </span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 CoreDev Zero. Empowering the developer community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
