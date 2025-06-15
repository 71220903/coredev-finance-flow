import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, TrendingUp, Shield, Code2, Github, DollarSign, Wallet, Star, CheckCircle, Play, ChevronLeft, ChevronRight, Zap, Cpu, Globe, Database, Network, Bitcoin, Heart, Lightbulb, Rocket } from "lucide-react";
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

  // Futuristic blockchain showcase
  const blockchainShowcase = [
    { 
      id: 1, 
      title: "Smart Contract Architecture", 
      description: "Automated lending protocols with zero intermediaries", 
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      category: "Infrastructure",
      tech: "Solidity"
    },
    { 
      id: 2, 
      title: "DeFi Innovation Lab", 
      description: "Next-generation financial primitives for developers", 
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
      category: "Development",
      tech: "Web3"
    },
    { 
      id: 3, 
      title: "Decentralized Governance", 
      description: "Community-driven protocol evolution and upgrades", 
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
      category: "Governance",
      tech: "DAO"
    },
    { 
      id: 4, 
      title: "Cross-Chain Bridge", 
      description: "Seamless interoperability across blockchain networks", 
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
      category: "Interoperability",
      tech: "Layer 2"
    },
    { 
      id: 5, 
      title: "AI-Powered Risk Engine", 
      description: "Machine learning algorithms for credit scoring", 
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      category: "AI/ML",
      tech: "Neural Networks"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % blockchainShowcase.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % blockchainShowcase.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + blockchainShowcase.length) % blockchainShowcase.length);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative bg-black/95 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl animate-pulse opacity-75"></div>
                <Code2 className="h-6 w-6 text-white relative z-10" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                CoreDev Zero
              </span>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 ml-2">
                v3.0 Beta
              </Badge>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/marketplace" className="text-gray-300 hover:text-blue-400 transition-colors font-medium relative group">
                Marketplace
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors font-medium relative group">
                Dashboard
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              {isConnected && <UserModeSwitch />}
              <WalletConnect />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 z-10">
          <div className="grid lg:grid-cols-12 gap-24 items-center">
            {/* Left Column - Content */}
            <div className="lg:col-span-5 space-y-6">
              {/* Innovation Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Next-Generation DeFi Protocol
                </span>
                <Zap className="h-3 w-3 ml-2 text-yellow-400 animate-pulse" />
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Decentralized
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                    Developer Finance
                  </span>
                </h1>
                
                {/* Core Slogan */}
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
                  <p className="text-lg font-bold text-gray-200 pl-5">
                    <span className="text-blue-400">For developer</span> • <span className="text-purple-400">by developer</span>
                  </p>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-base text-gray-300 leading-relaxed max-w-lg">
                Revolutionary peer-to-peer lending ecosystem leveraging smart contracts, AI-powered risk assessment, 
                and decentralized governance. Experience the future of developer financing today.
              </p>

              {/* Tech Stack Icons */}
              <div className="flex items-center space-x-4 py-3">
                <div className="flex items-center space-x-1.5 text-blue-400">
                  <Database className="h-4 w-4" />
                  <span className="text-xs font-medium">Smart Contracts</span>
                </div>
                <div className="flex items-center space-x-1.5 text-purple-400">
                  <Network className="h-4 w-4" />
                  <span className="text-xs font-medium">Layer 2</span>
                </div>
                <div className="flex items-center space-x-1.5 text-cyan-400">
                  <Cpu className="h-4 w-4" />
                  <span className="text-xs font-medium">AI Engine</span>
                </div>
                <div className="flex items-center space-x-1.5 text-green-400">
                  <Bitcoin className="h-4 w-4" />
                  <span className="text-xs font-medium">Multi-Chain</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                {!isConnected ? (
                  <div className="flex items-center space-x-2.5 bg-gradient-to-r from-gray-900/80 to-blue-900/80 border border-blue-500/30 rounded-xl px-5 py-3 backdrop-blur-sm">
                    <Wallet className="h-4 w-4 text-blue-400 animate-pulse" />
                    <span className="text-gray-200 font-semibold text-sm">Connect Web3 Wallet to Enter the Future</span>
                  </div>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      onClick={handleGetStarted} 
                      className="group bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 text-white px-6 py-4 text-base font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-105 border border-blue-400/20"
                    >
                      <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      {isAdmin ? 'Access Neural Control Panel' : 'Launch DeFi Dashboard'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button size="lg" variant="outline" asChild className="px-6 py-4 text-base font-bold border-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300">
                      <Link to="/marketplace">
                        <Globe className="mr-2 h-4 w-4" />
                        Explore DeFi Markets
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-5 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-400 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-300">Zero-Knowledge Proofs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Network className="h-4 w-4 text-blue-400 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-300">Cross-Chain Compatible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
                  <span className="text-xs font-semibold text-gray-300">Lightning Fast</span>
                </div>
              </div>
            </div>

            {/* Right Column - Futuristic Gallery */}
            <div className="lg:col-span-7 lg:pl-12">
              <div className="relative">
                {/* Main Gallery Container with Holographic Effect */}
                <div className="relative h-[480px] bg-gradient-to-br from-gray-900/50 to-blue-900/50 rounded-3xl shadow-2xl shadow-blue-500/20 overflow-hidden border border-blue-500/30 backdrop-blur-xl">
                  {/* Holographic Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl animate-pulse"></div>
                  
                  <div 
                    className="flex transition-transform duration-1000 ease-out h-full relative z-10"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {blockchainShowcase.map((item, index) => (
                      <div key={item.id} className="min-w-full h-full relative">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        
                        {/* Futuristic Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                          <div className="space-y-2.5">
                            <div className="flex items-center space-x-2.5">
                              <Badge className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white border-none px-2.5 py-1 text-xs">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className="border-cyan-400/50 text-cyan-400 text-xs">
                                {item.tech}
                              </Badge>
                            </div>
                            <h3 className="text-2xl font-black mb-2.5 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                              {item.title}
                            </h3>
                            <p className="text-gray-200 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Tech Pattern Overlay */}
                        <div className="absolute top-3 right-3 w-12 h-12 border border-blue-400/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <Code2 className="h-5 w-5 text-blue-400 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/40 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 border border-blue-400/30"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/40 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 border border-blue-400/30"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Gallery Indicators */}
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2.5">
                    {blockchainShowcase.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border border-blue-400/50 ${
                          index === currentSlide ? 'bg-blue-400 w-8' : 'bg-blue-400/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Tech Badges */}
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-green-400/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className="h-6 w-6" />
                    <div>
                      <div className="font-black text-base">Audited</div>
                      <div className="text-xs opacity-90">Smart Contracts</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-8 -right-8 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 text-white p-4 rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 border border-purple-400/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-2.5">
                    <Network className="h-6 w-6" />
                    <div>
                      <div className="font-black text-base">$50M+</div>
                      <div className="text-xs opacity-90">TVL Secured</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Developers Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl border-y border-blue-500/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 px-8 py-4 rounded-full backdrop-blur-sm mb-8">
              <Heart className="h-6 w-6 text-red-400 mr-3 animate-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Why Developers Matter
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Developers Are The 
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"> Backbone</span>
              <br />of Tomorrow's Ecosystem
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We created this platform because we believe developers are the architects of our digital future. 
              When developers are properly supported and facilitated, they create innovations that transform entire ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-2xl border border-blue-500/30 group-hover:scale-110 transition-all duration-500">
                    <Lightbulb className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Innovation Drivers</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Developers transform ideas into reality. They build the infrastructure, applications, 
                      and systems that power our digital world. Every breakthrough starts with a developer's vision.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-4 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-all duration-500">
                    <Rocket className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Ecosystem Builders</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Well-supported developers create robust, scalable solutions. When they have access to proper funding 
                      and resources, they can focus on building revolutionary technologies that benefit everyone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-green-500/20 p-4 rounded-2xl border border-cyan-500/30 group-hover:scale-110 transition-all duration-500">
                    <Globe className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Future Shapers</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      The projects developers create today become the foundation for tomorrow's innovations. 
                      By empowering developers now, we're investing in a more promising digital future for all.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Our Mission</h4>
                    <p className="text-blue-300">Empowering the next generation</p>
                  </div>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed">
                  "We believe that by providing developers with decentralized financial tools, 
                  we're not just solving funding problems – we're catalyzing the next wave of technological innovation 
                  that will shape our collective future."
                </p>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-3xl p-12 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl animate-pulse"></div>
                
                <div className="relative z-10 text-center space-y-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse opacity-75"></div>
                    <Code2 className="h-16 w-16 text-white relative z-10" />
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-4xl font-black text-white">10,000+</h3>
                    <p className="text-xl text-gray-300">Developers Empowered</p>
                    <div className="flex justify-center space-x-8 pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">500+</div>
                        <div className="text-sm text-gray-400">Projects Funded</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">$50M+</div>
                        <div className="text-sm text-gray-400">Capital Deployed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">99.7%</div>
                        <div className="text-sm text-gray-400">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-8 -left-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8" />
                  <div>
                    <div className="font-bold text-lg">Secured</div>
                    <div className="text-sm opacity-90">Smart Contracts</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-2xl shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8" />
                  <div>
                    <div className="font-bold text-lg">Lightning</div>
                    <div className="text-sm opacity-90">Fast Funding</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-gray-900/95 to-blue-900/95 py-24 backdrop-blur-xl border-y border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { value: "$50M+", label: "Total Value Locked", icon: DollarSign, color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30" },
              { value: "10,000+", label: "Active Developers", icon: Users, color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" },
              { value: "99.7%", label: "Uptime SLA", icon: TrendingUp, color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30" },
              { value: "15+", label: "Blockchain Networks", icon: Globe, color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${stat.bgColor} border ${stat.borderColor} mb-8 group-hover:scale-110 transition-all duration-500 backdrop-blur-sm`}>
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
                <div className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-300 font-semibold text-xl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-7xl font-black text-white mb-12">
              Next-Gen 
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"> DeFi Features</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Revolutionary blockchain technology meets artificial intelligence to create the ultimate developer financing ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: Github, title: "GitHub Oracle Integration", description: "Real-time code quality analysis with ML-powered reputation scoring", color: "text-white", bgColor: "bg-gray-800/50", borderColor: "border-gray-600/30" },
              { icon: Shield, title: "Zero-Knowledge Risk Engine", description: "Privacy-preserving credit assessment using advanced cryptographic proofs", color: "text-green-400", bgColor: "bg-green-900/20", borderColor: "border-green-500/30" },
              { icon: Network, title: "Cross-Chain Liquidity", description: "Seamless asset movement across 15+ blockchain networks with instant settlement", color: "text-purple-400", bgColor: "bg-purple-900/20", borderColor: "border-purple-500/30" },
              { icon: Cpu, title: "AI-Powered Matching", description: "Neural networks optimize lender-borrower matching for maximum efficiency", color: "text-blue-400", bgColor: "bg-blue-900/20", borderColor: "border-blue-500/30" },
              { icon: Database, title: "Immutable Loan Records", description: "Permanent, tamper-proof transaction history stored on distributed ledger", color: "text-cyan-400", bgColor: "bg-cyan-900/20", borderColor: "border-cyan-500/30" },
              { icon: Zap, title: "Lightning Settlements", description: "Sub-second transaction finality with Layer 2 scaling solutions", color: "text-yellow-400", bgColor: "bg-yellow-900/20", borderColor: "border-yellow-500/30" }
            ].map((feature, index) => (
              <Card key={index} className={`group border ${feature.borderColor} ${feature.bgColor} backdrop-blur-xl hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 relative overflow-hidden`}>
                {/* Animated border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <CardHeader className="text-center p-10 relative z-10">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${feature.bgColor} border ${feature.borderColor} mb-8 group-hover:scale-110 transition-all duration-500`}>
                    <feature.icon className={`h-12 w-12 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors duration-500 mb-6">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed text-lg">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-cyan-900/95 overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }}></div>
        
        <div className="relative max-w-6xl mx-auto text-center px-6 lg:px-8 z-10">
          <h2 className="text-6xl md:text-7xl font-black text-white mb-12">
            Enter the
            <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent"> DeFi Revolution</span>
          </h2>
          <p className="text-3xl text-gray-200 mb-16 leading-relaxed max-w-4xl mx-auto">
            Join the future of decentralized finance. Connect your wallet and experience next-generation developer lending.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {!isConnected ? (
              <div className="text-gray-200 bg-gradient-to-r from-gray-800/50 to-blue-800/50 backdrop-blur-xl rounded-3xl px-12 py-8 font-bold text-xl border border-blue-500/30">
                Connect Web3 Wallet Above to Access the Future
              </div>
            ) : (
              <Button 
                size="lg" 
                onClick={handleGetStarted} 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-400 hover:via-purple-400 hover:to-cyan-400 text-white px-16 py-8 text-2xl font-black shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 transform hover:scale-110 border border-blue-400/30"
              >
                <Zap className="mr-4 h-8 w-8 animate-pulse" />
                Launch DeFi Protocol
                <ArrowRight className="ml-4 h-8 w-8" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-blue-500/20 px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl animate-pulse opacity-75"></div>
                <Code2 className="h-7 w-7 text-white relative z-10" />
              </div>
              <div>
                <span className="font-black text-white text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CoreDev Zero
                </span>
                <div className="text-gray-400 text-lg font-medium">
                  Decentralized Developer Finance Protocol
                </div>
              </div>
            </div>
            <div className="text-gray-400 text-lg">
              © 2024 CoreDev Zero. Powered by Blockchain Technology.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
