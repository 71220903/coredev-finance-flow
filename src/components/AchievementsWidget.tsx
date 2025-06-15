
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

  const formatProgress = (current: number, max: number) => {
    if (max >= 1000) {
      return `${(current / 1000).toFixed(0)}k/${(max / 1000).toFixed(0)}k`;
    }
    return `${current}/${max}`;
  };

  return (
    <Card className="animate-fade-in w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span>Achievements & SBTs</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="h-8 text-xs px-3 transition-all duration-200 hover:scale-105"
            >
              <category.icon className="h-3 w-3 mr-1" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md min-h-[160px] ${
                achievement.unlocked 
                  ? `${getRarityBorder(achievement.rarity)} bg-white` 
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {/* Rarity Indicator */}
              <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${getRarityColor(achievement.rarity)}`} />
              
              <div className="flex flex-col h-full">
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    achievement.unlocked 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {achievement.unlocked ? (
                      <achievement.icon className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium text-sm truncate ${achievement.unlocked ? "text-slate-900" : "text-slate-500"}`}>
                        {achievement.title}
                      </h4>
                      <Badge variant="outline" className={`text-xs px-2 py-0 ${getRarityColor(achievement.rarity)} text-white border-0 flex-shrink-0`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">{achievement.description}</p>
                  </div>
                </div>
                
                {/* Progress Section */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span className="font-medium">{formatProgress(achievement.progress, achievement.maxProgress)}</span>
                  </div>
                  <Progress 
                    value={Math.min((achievement.progress / achievement.maxProgress) * 100, 100)} 
                    className="h-2"
                  />
                </div>
                
                {/* Reward Info */}
                <div className="text-xs text-green-600 mb-3 flex items-start space-x-1">
                  <span>🎁</span>
                  <span className="line-clamp-1">{achievement.reward}</span>
                </div>
                
                {/* Action Button */}
                <div className="mt-auto">
                  {achievement.unlocked && achievement.sbtTokenId && (
                    <Button 
                      size="sm" 
                      className="w-full h-8 text-xs transition-all duration-200 hover:scale-105"
                      onClick={() => handleClaimSBT(achievement)}
                    >
                      <Medal className="h-3 w-3 mr-1" />
                      Claim SBT
                    </Button>
                  )}
                  
                  {achievement.unlocked && !achievement.sbtTokenId && (
                    <div className="flex items-center justify-center space-x-1 text-green-600 py-1">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-xs font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No achievements found for this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsWidget;
