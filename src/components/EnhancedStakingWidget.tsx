
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Shield, 
  Zap,
  Clock,
  DollarSign,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StakingStats {
  totalStaked: number;
  stakingRewards: number;
  marketAccess: boolean;
  boostMultiplier: number;
  lockPeriod: number;
}

interface EnhancedStakingWidgetProps {
  currentStake?: number;
  isStaked?: boolean;
  onStakeChange?: (amount: number, isStaked: boolean) => void;
}

const EnhancedStakingWidget = ({ 
  currentStake = 0, 
  isStaked = false, 
  onStakeChange 
}: EnhancedStakingWidgetProps) => {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("1");
  const [isStaking, setIsStaking] = useState(false);
  const [stakingProgress, setStakingProgress] = useState(0);
  const [animatedStake, setAnimatedStake] = useState(currentStake);

  const stakingStats: StakingStats = {
    totalStaked: 15420,
    stakingRewards: 12.5,
    marketAccess: isStaked,
    boostMultiplier: isStaked ? 1.25 : 1.0,
    lockPeriod: 30
  };

  // Animate stake amount changes
  useEffect(() => {
    if (animatedStake !== currentStake) {
      const duration = 1000;
      const steps = 30;
      const increment = (currentStake - animatedStake) / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        setAnimatedStake(prev => {
          const next = prev + increment;
          return step >= steps ? currentStake : next;
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [currentStake, animatedStake]);

  const handleStake = async () => {
    setIsStaking(true);
    setStakingProgress(0);
    
    // Animate progress
    const progressTimer = setInterval(() => {
      setStakingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      const amount = Number(stakeAmount);
      onStakeChange?.(currentStake + amount, true);
      
      toast({
        title: "Staking Successful! 🎉",
        description: `You have staked ${amount} tCORE. Market creation is now enabled!`
      });
      
      setIsStaking(false);
      setStakingProgress(0);
    }, 2000);
  };

  const handleUnstake = async () => {
    setIsStaking(true);
    setStakingProgress(0);
    
    const progressTimer = setInterval(() => {
      setStakingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 4;
      });
    }, 120);

    setTimeout(() => {
      onStakeChange?.(0, false);
      
      toast({
        title: "Unstaking Successful! ✅",
        description: `${currentStake} tCORE has been returned to your wallet.`
      });
      
      setIsStaking(false);
      setStakingProgress(0);
    }, 2500);
  };

  const getStakeTier = (amount: number) => {
    if (amount >= 100) return { name: "Diamond", color: "text-blue-600", boost: "2.0x" };
    if (amount >= 50) return { name: "Gold", color: "text-yellow-600", boost: "1.5x" };
    if (amount >= 10) return { name: "Silver", color: "text-slate-600", boost: "1.25x" };
    if (amount >= 1) return { name: "Bronze", color: "text-orange-600", boost: "1.1x" };
    return { name: "None", color: "text-slate-400", boost: "1.0x" };
  };

  const currentTier = getStakeTier(currentStake);

  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <div className="relative">
              <Coins className="h-5 w-5 text-blue-600" />
              {isStaked && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <span>tCORE Staking</span>
          </CardTitle>
          <Badge 
            variant={isStaked ? "default" : "outline"}
            className={`transition-all duration-300 ${isStaked ? 'animate-pulse' : ''}`}
          >
            {isStaked ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Current Stake Display with Animation */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border">
          <div className="relative">
            <div className="text-3xl font-bold text-blue-600 transition-all duration-500">
              {Math.round(animatedStake * 100) / 100} tCORE
            </div>
            <div className="text-sm text-slate-600 mt-1">Currently Staked</div>
            
            {/* Tier Badge */}
            <div className="mt-3">
              <Badge className={`${currentTier.color} border-current`} variant="outline">
                {currentTier.name} Tier • {currentTier.boost} Boost
              </Badge>
            </div>
          </div>
        </div>

        {/* Staking Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">APY</span>
            </div>
            <div className="text-lg font-bold">{stakingStats.stakingRewards}%</div>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Total Staked</span>
            </div>
            <div className="text-lg font-bold">{stakingStats.totalStaked.toLocaleString()}</div>
          </div>
        </div>

        {/* Benefits with Enhanced Icons */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900 mb-3">Staking Benefits</h4>
          <div className="space-y-2 text-sm">
            <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
              isStaked ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-600'
            }`}>
              <Shield className="h-4 w-4" />
              <span>Market Creation Access</span>
              {isStaked && <div className="ml-auto text-green-500">✓</div>}
            </div>
            
            <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
              isStaked ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'
            }`}>
              <TrendingUp className="h-4 w-4" />
              <span>Trust Score Boost ({currentTier.boost})</span>
              {isStaked && <div className="ml-auto text-blue-500">✓</div>}
            </div>
            
            <div className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 ${
              currentStake >= 10 ? 'bg-purple-50 text-purple-700' : 'bg-slate-50 text-slate-600'
            }`}>
              <Zap className="h-4 w-4" />
              <span>Priority Support (10+ tCORE)</span>
              {currentStake >= 10 && <div className="ml-auto text-purple-500">✓</div>}
            </div>
            
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50 text-slate-600">
              <Clock className="h-4 w-4" />
              <span>Lock Period: {stakingStats.lockPeriod} days</span>
            </div>
          </div>
        </div>

        {/* Staking Actions */}
        {!isStaked ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Stake Amount (tCORE)</label>
              <Input
                type="number"
                min="1"
                step="0.1"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="1.0"
                className="transition-all duration-200 focus:scale-105"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>Minimum: 1 tCORE</span>
                <span>Wallet: 100 tCORE</span>
              </div>
            </div>
            
            <Button 
              className="w-full transition-all duration-300 hover:scale-105 active:scale-95" 
              onClick={handleStake}
              disabled={isStaking || Number(stakeAmount) < 1}
            >
              <Lock className="h-4 w-4 mr-2" />
              {isStaking ? "Staking..." : `Stake ${stakeAmount} tCORE`}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-green-600 font-medium mb-1">
                🎉 Market Creation Enabled!
              </div>
              <div className="text-sm text-green-700">
                You can now create loan markets and receive the {currentTier.boost} trust boost
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full transition-all duration-300 hover:scale-105 active:scale-95" 
              onClick={handleUnstake}
              disabled={isStaking}
            >
              <Unlock className="h-4 w-4 mr-2" />
              {isStaking ? "Unstaking..." : "Unstake tCORE"}
            </Button>
            
            <p className="text-xs text-slate-600 text-center">
              Note: Unstaking has a {stakingStats.lockPeriod}-day cooldown period
            </p>
          </div>
        )}

        {/* Progress Animation */}
        {isStaking && (
          <div className="space-y-3 animate-fade-in">
            <div className="text-sm text-center text-slate-600">
              {isStaked ? "Processing unstaking..." : "Processing staking..."}
            </div>
            <Progress value={stakingProgress} className="h-3" />
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedStakingWidget;
