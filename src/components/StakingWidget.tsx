
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Lock, Unlock, TrendingUp, Shield } from "lucide-react";
import { useNativeStaking } from "@/hooks/useNativeStaking";

interface StakingWidgetProps {
  onStakeChange?: (amount: number, isStaked: boolean) => void;
}

const StakingWidget = ({ onStakeChange }: StakingWidgetProps) => {
  const {
    stakedAmount,
    nativeBalance,
    isStaking,
    isUnstaking,
    stake,
    unstake
  } = useNativeStaking();
  
  const [stakeAmount, setStakeAmount] = useState("1");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const handleStake = async () => {
    const success = await stake(stakeAmount);
    if (success) {
      onStakeChange?.(stakedAmount + Number(stakeAmount), true);
      setStakeAmount("1");
    }
  };

  const handleUnstake = async () => {
    const amount = unstakeAmount || stakedAmount.toString();
    const success = await unstake(amount);
    if (success) {
      onStakeChange?.(stakedAmount - Number(amount), Number(amount) < stakedAmount);
      setUnstakeAmount("");
    }
  };

  const isStaked = stakedAmount > 0;
  const canStake = Number(stakeAmount) > 0 && Number(stakeAmount) <= Number(nativeBalance);
  const canUnstake = Number(unstakeAmount || stakedAmount) > 0 && Number(unstakeAmount || stakedAmount) <= stakedAmount;

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
            {stakedAmount.toFixed(4)} tCORE
          </div>
          <div className="text-sm text-slate-600">Currently Staked</div>
          <div className="text-xs text-slate-500 mt-1">
            Available Balance: {Number(nativeBalance).toFixed(4)} tCORE
          </div>
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
        {!isStaked || stakedAmount < 1 ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Stake Amount (tCORE)</label>
              <Input
                type="number"
                min="1"
                step="0.0001"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="1.0000"
              />
              <p className="text-xs text-slate-600 mt-1">
                Minimum 1 tCORE required to create markets
              </p>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleStake}
              disabled={isStaking || !canStake}
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

            <div>
              <label className="text-sm font-medium">Unstake Amount (tCORE)</label>
              <Input
                type="number"
                min="0"
                max={stakedAmount}
                step="0.0001"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder={`Max: ${stakedAmount.toFixed(4)}`}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleUnstake}
              disabled={isUnstaking || !canUnstake}
            >
              <Unlock className="h-4 w-4 mr-2" />
              {isUnstaking ? "Unstaking..." : `Unstake ${unstakeAmount || stakedAmount.toFixed(4)} tCORE`}
            </Button>
            
            <p className="text-xs text-slate-600 text-center">
              Note: You can only unstake after completing or cancelling all active markets
            </p>
          </div>
        )}

        {/* Staking Progress (if staking/unstaking) */}
        {(isStaking || isUnstaking) && (
          <div className="space-y-2">
            <div className="text-sm text-center">
              Processing transaction...
            </div>
            <Progress value={66} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StakingWidget;
