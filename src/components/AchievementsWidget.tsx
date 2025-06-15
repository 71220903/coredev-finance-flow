
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Shield, 
  Target, 
  Zap, 
  Crown,
  Medal,
  Award,
  CheckCircle,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: "trust" | "lending" | "community" | "milestone";
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  reward: string;
  sbtTokenId?: string;
}

const AchievementsWidget = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const achievements: Achievement[] = [
    {
      id: "first-loan",
      title: "First Steps",
      description: "Complete your first loan successfully",
      icon: Target,
      category: "milestone",
      rarity: "common",
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      reward: "Trust Score +5",
      sbtTokenId: "SBT-001"
    },
    {
      id: "trust-builder",
      title: "Trust Builder",
      description: "Reach Trust Score of 80+",
      icon: Shield,
      category: "trust",
      rarity: "rare",
      progress: 88,
      maxProgress: 80,
      unlocked: true,
      reward: "Lower Interest Rates",
      sbtTokenId: "SBT-002"
    },
    {
      id: "serial-borrower",
      title: "Serial Borrower",
      description: "Complete 5 successful loans",
      icon: Trophy,
      category: "lending",
      rarity: "epic",
      progress: 2,
      maxProgress: 5,
      unlocked: false,
      reward: "Exclusive Borrower Badge"
    },
    {
      id: "community-champion",
      title: "Community Champion",
      description: "Help 10 developers with code reviews",
      icon: Star,
      category: "community",
      rarity: "rare",
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      reward: "Special Forum Badge"
    },
    {
      id: "whale-borrower",
      title: "Whale Borrower",
      description: "Borrow over $100,000 total",
      icon: Crown,
      category: "lending",
      rarity: "legendary",
      progress: 65000,
      maxProgress: 100000,
      unlocked: false,
      reward: "VIP Support Access"
    },
    {
      id: "lightning-repay",
      title: "Lightning Repay",
      description: "Repay loan within 24 hours",
      icon: Zap,
      category: "milestone",
      rarity: "rare",
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      reward: "Fast Repayer Badge"
    }
  ];

  const categories = [
    { id: "all", label: "All", icon: Award },
    { id: "trust", label: "Trust", icon: Shield },
    { id: "lending", label: "Lending", icon: Trophy },
    { id: "community", label: "Community", icon: Star },
    { id: "milestone", label: "Milestones", icon: Target }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-slate-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-yellow-500";
      default: return "bg-slate-500";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-slate-200";
      case "rare": return "border-blue-200";
      case "epic": return "border-purple-200";
      case "legendary": return "border-yellow-200 shadow-yellow-100";
      default: return "border-slate-200";
    }
  };

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const handleClaimSBT = (achievement: Achievement) => {
    toast({
      title: "SBT Claimed!",
      description: `Your "${achievement.title}" Soul-Bound Token has been minted to your wallet.`
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span>Achievements & SBTs</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="transition-all duration-200 hover:scale-105"
            >
              <category.icon className="h-3 w-3 mr-1" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                achievement.unlocked 
                  ? `${getRarityBorder(achievement.rarity)} bg-white` 
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {/* Rarity Indicator */}
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getRarityColor(achievement.rarity)}`} />
              
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  achievement.unlocked 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {achievement.unlocked ? (
                    <achievement.icon className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${achievement.unlocked ? "text-slate-900" : "text-slate-500"}`}>
                      {achievement.title}
                    </h4>
                    <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)} text-white border-0`}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{achievement.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Reward Info */}
                  <div className="mt-2 text-xs text-green-600">
                    🎁 {achievement.reward}
                  </div>
                  
                  {/* SBT Claim Button */}
                  {achievement.unlocked && achievement.sbtTokenId && (
                    <Button 
                      size="sm" 
                      className="mt-3 w-full transition-all duration-200 hover:scale-105"
                      onClick={() => handleClaimSBT(achievement)}
                    >
                      <Medal className="h-3 w-3 mr-1" />
                      Claim SBT
                    </Button>
                  )}
                  
                  {achievement.unlocked && !achievement.sbtTokenId && (
                    <div className="mt-3 flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsWidget;
