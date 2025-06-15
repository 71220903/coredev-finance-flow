
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
  Lock,
  Loader2
} from "lucide-react";
import { useSBTAchievements } from "@/hooks/useSBTAchievements";

const AchievementsWidget = () => {
  const { achievements, loading, mintAchievementSBT } = useSBTAchievements();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mintingId, setMintingId] = useState<string | null>(null);

  const getIcon = (category: string) => {
    switch (category) {
      case "trust": return Shield;
      case "lending": return Trophy;
      case "community": return Star;
      case "milestone": return Target;
      default: return Award;
    }
  };

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

  const handleMintSBT = async (achievement: any) => {
    setMintingId(achievement.id);
    await mintAchievementSBT(achievement);
    setMintingId(null);
  };

  const formatProgress = (current: number, max: number) => {
    if (max >= 1000) {
      return `${(current / 1000).toFixed(0)}k/${(max / 1000).toFixed(0)}k`;
    }
    return `${current}/${max}`;
  };

  if (loading && achievements.length === 0) {
    return (
      <Card className="animate-fade-in w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading achievements...</span>
        </CardContent>
      </Card>
    );
  }

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
          {filteredAchievements.map((achievement) => {
            const IconComponent = getIcon(achievement.category);
            
            return (
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
                
                {/* On-chain Badge */}
                {achievement.onChain && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="text-xs px-2 py-0 bg-green-500">
                      On-Chain
                    </Badge>
                  </div>
                )}
                
                <div className="flex flex-col h-full">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      achievement.unlocked 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {achievement.unlocked ? (
                        <IconComponent className="h-4 w-4" />
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
                    {achievement.unlocked && !achievement.onChain && (
                      <Button 
                        size="sm" 
                        className="w-full h-8 text-xs transition-all duration-200 hover:scale-105"
                        onClick={() => handleMintSBT(achievement)}
                        disabled={mintingId === achievement.id}
                      >
                        {mintingId === achievement.id ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          <>
                            <Medal className="h-3 w-3 mr-1" />
                            Mint SBT
                          </>
                        )}
                      </Button>
                    )}
                    
                    {achievement.unlocked && achievement.onChain && (
                      <div className="flex items-center justify-center space-x-1 text-green-600 py-1">
                        <CheckCircle className="h-3 w-3" />
                        <span className="text-xs font-medium">SBT Owned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
