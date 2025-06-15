
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Lock, Unlock, TrendingUp, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StakingWidgetProps {
  currentStake?: number;
  isStaked?: boolean;
  onStakeChange?: (amount: number, isStaked: boolean) => void;
}

const StakingWidget = ({ currentStake = 0, isStaked = false, onStakeChange }: StakingWidgetProps) => {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("1");
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async () => {
    setIsStaking(true);
    
    // Simulate staking transaction
    setTimeout(() => {
      const amount = Number(stakeAmount);
      onStakeChange?.(currentStake + amount, true);
      
      toast({
        title: "Staking Successful!",
        description: `You have staked ${amount} tCORE. You can now create loan markets.`
      });
      
      setIsStaking(false);
    }, 2000);
  };

  const handleUnstake = async () => {
    setIsStaking(true);
    
    // Simulate unstaking transaction
    setTimeout(() => {
      onStakeChange?.(0, false);
      
      toast({
        title: "Unstaking Successful!",
        description: `${currentStake} tCORE has been returned to your wallet.`
      });
      
      setIsStaking(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-blue-600" />
            <span>tCORE Staking</span>
          </CardTitle>
          <Badge variant={isStaked ? "default" : "outline"}>
            {isStaked ? "Active" : "Required"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Stake Display */}
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {currentStake} tCORE
          </div>
          <div className="text-sm text-slate-600">Currently Staked</div>
        </div>

        {/* Staking Benefits */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-green-600">
            <Shield className="h-4 w-4" />
            <span>Enables market creation</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <TrendingUp className="h-4 w-4" />
            <span>Demonstrates commitment to lenders</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-600">
            <Lock className="h-4 w-4" />
            <span>Locked until loan completion or market cancellation</span>
          </div>
        </div>

        {/* Staking Actions */}
        {!isStaked ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Stake Amount (tCORE)</label>
              <Input
                type="number"
                min="1"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="1"
              />
              <p className="text-xs text-slate-600 mt-1">
                Minimum 1 tCORE required to create markets
              </p>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleStake}
              disabled={isStaking || Number(stakeAmount) < 1}
            >
              <Lock className="h-4 w-4 mr-2" />
              {isStaking ? "Staking..." : `Stake ${stakeAmount} tCORE`}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center text-green-600 font-medium">
              ✅ You are eligible to create loan markets
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleUnstake}
              disabled={isStaking}
            >
              <Unlock className="h-4 w-4 mr-2" />
              {isStaking ? "Unstaking..." : "Unstake tCORE"}
            </Button>
            
            <p className="text-xs text-slate-600 text-center">
              Note: You can only unstake after completing or cancelling all active markets
            </p>
          </div>
        )}

        {/* Staking Progress (if staking) */}
        {isStaking && (
          <div className="space-y-2">
            <div className="text-sm text-center">Processing transaction...</div>
            <Progress value={66} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakingWidget;
