
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Tag,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LendingPosition {
  id: string;
  tokenId: string;
  originalLoan: {
    borrower: string;
    amount: number;
    interestRate: number;
    remainingTerm: number;
    totalTerm: number;
  };
  position: {
    amount: number;
    expectedReturn: number;
    riskScore: number;
    daysRemaining: number;
  };
  market: {
    currentPrice: number;
    originalPrice: number;
    floorPrice: number;
    lastSale: number;
    volume24h: number;
    priceChange24h: number;
  };
  seller: {
    name: string;
    avatar: string;
    trustScore: number;
    totalSales: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  verified: boolean;
}

const SecondaryMarket = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [sortBy, setSortBy] = useState("price-low");

  const [positions] = useState<LendingPosition[]>([
    {
      id: "1",
      tokenId: "LNP-001",
      originalLoan: {
        borrower: "Alex Rodriguez",
        amount: 50000,
        interestRate: 12.5,
        remainingTerm: 8,
        totalTerm: 12
      },
      position: {
        amount: 15000,
        expectedReturn: 18750,
        riskScore: 85,
        daysRemaining: 240
      },
      market: {
        currentPrice: 16200,
        originalPrice: 15000,
        floorPrice: 14500,
        lastSale: 15800,
        volume24h: 45000,
        priceChange24h: 2.4
      },
      seller: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332db29?w=50&h=50&fit=crop&crop=face",
        trustScore: 92,
        totalSales: 23
      },
      rarity: 'epic',
      verified: true
    },
    {
      id: "2",
      tokenId: "LNP-002",
      originalLoan: {
        borrower: "Mike Johnson",
        amount: 25000,
        interestRate: 10.8,
        remainingTerm: 5,
        totalTerm: 8
      },
      position: {
        amount: 8000,
        expectedReturn: 9500,
        riskScore: 78,
        daysRemaining: 150
      },
      market: {
        currentPrice: 8400,
        originalPrice: 8000,
        floorPrice: 7800,
        lastSale: 8200,
        volume24h: 28000,
        priceChange24h: -1.2
      },
      seller: {
        name: "David Park",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        trustScore: 87,
        totalSales: 15
      },
      rarity: 'rare',
      verified: true
    },
    {
      id: "3",
      tokenId: "LNP-003",
      originalLoan: {
        borrower: "Emma Wilson",
        amount: 35000,
        interestRate: 11.5,
        remainingTerm: 10,
        totalTerm: 10
      },
      position: {
        amount: 12000,
        expectedReturn: 14380,
        riskScore: 91,
        daysRemaining: 300
      },
      market: {
        currentPrice: 12600,
        originalPrice: 12000,
        floorPrice: 11800,
        lastSale: 12400,
        volume24h: 67000,
        priceChange24h: 5.1
      },
      seller: {
        name: "Lisa Wang",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        trustScore: 94,
        totalSales: 31
      },
      rarity: 'legendary',
      verified: true
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'epic': return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'rare': return 'bg-gradient-to-r from-green-500 to-blue-500';
      default: return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      legendary: 'bg-purple-100 text-purple-700 border-purple-300',
      epic: 'bg-blue-100 text-blue-700 border-blue-300',
      rare: 'bg-green-100 text-green-700 border-green-300',
      common: 'bg-slate-100 text-slate-700 border-slate-300'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const calculateYield = (position: LendingPosition) => {
    const totalReturn = (position.position.expectedReturn / position.position.amount - 1) * 100;
    const timeRemaining = position.position.daysRemaining / 365;
    return timeRemaining > 0 ? totalReturn / timeRemaining : 0;
  };

  const handlePurchase = (position: LendingPosition) => {
    toast({
      title: "Purchase Successful! 🎉",
      description: `You've acquired lending position ${position.tokenId} for $${position.market.currentPrice.toLocaleString()}.`
    });
  };

  const handleMakeOffer = (position: LendingPosition) => {
    toast({
      title: "Offer Submitted 📝",
      description: `Your offer for ${position.tokenId} has been sent to the seller.`
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-600">24h Volume</span>
            </div>
            <div className="text-2xl font-bold">$140K</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.3%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-slate-600">Active Listings</span>
            </div>
            <div className="text-2xl font-bold">127</div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +5 today
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-slate-600">Avg Yield</span>
            </div>
            <div className="text-2xl font-bold">15.2%</div>
            <div className="flex items-center text-xs text-yellow-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              APY
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-slate-600">Total Traders</span>
            </div>
            <div className="text-2xl font-bold">1.2K</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.1%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-positions">My Positions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <Input placeholder="Search by token ID, borrower, or loan amount..." className="flex-1" />
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="yield-high">Highest Yield</option>
                  <option value="rarity">Rarity</option>
                  <option value="time-left">Time Remaining</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Positions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {positions.map((position) => (
              <Card key={position.id} className="transition-all duration-300 hover:shadow-xl hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getRarityColor(position.rarity)}`}></div>
                      <CardTitle className="text-lg">{position.tokenId}</CardTitle>
                      {position.verified && (
                        <Award className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <Badge className={getRarityBadge(position.rarity)}>
                      {position.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Price Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">
                        ${position.market.currentPrice.toLocaleString()}
                      </span>
                      <div className={`flex items-center text-sm ${
                        position.market.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {position.market.priceChange24h > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(position.market.priceChange24h)}%
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      Floor: ${position.market.floorPrice.toLocaleString()} | 
                      Last: ${position.market.lastSale.toLocaleString()}
                    </div>
                  </div>

                  {/* Loan Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Original Amount:</span>
                      <span className="font-medium">${position.position.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected Return:</span>
                      <span className="font-medium text-green-600">
                        ${position.position.expectedReturn.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Projected Yield:</span>
                      <span className="font-medium text-blue-600">
                        {calculateYield(position).toFixed(1)}% APY
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Loan Progress:</span>
                      <span>{position.originalLoan.totalTerm - position.originalLoan.remainingTerm}/{position.originalLoan.totalTerm} months</span>
                    </div>
                    <Progress 
                      value={((position.originalLoan.totalTerm - position.originalLoan.remainingTerm) / position.originalLoan.totalTerm) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Risk Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Score:</span>
                    <Badge variant={position.position.riskScore >= 85 ? "default" : position.position.riskScore >= 70 ? "secondary" : "destructive"}>
                      {position.position.riskScore}/100
                    </Badge>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={position.seller.avatar} />
                      <AvatarFallback>{position.seller.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{position.seller.name}</div>
                      <div className="text-xs text-slate-600">
                        Trust: {position.seller.trustScore} | {position.seller.totalSales} sales
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handlePurchase(position)}
                    >
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleMakeOffer(position)}
                    >
                      Make Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-positions">
          <Card>
            <CardContent className="p-8 text-center">
              <Tag className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium mb-2">No Positions Yet</h3>
              <p className="text-slate-600 mb-4">
                Start trading lending positions to build your portfolio.
              </p>
              <Button onClick={() => setActiveTab("marketplace")}>
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium mb-2">Market Analytics</h3>
              <p className="text-slate-600">
                Detailed market analytics and trends coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecondaryMarket;
