
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Lock, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { StakingInfo } from '@/types/market';

interface CollateralStakingDisplayProps {
  stakingInfo: StakingInfo;
  loanAmount: number;
  showActions?: boolean;
  onStakeMore?: () => void;
  onWithdraw?: () => void;
}

const CollateralStakingDisplay = ({
  stakingInfo,
  loanAmount,
  showActions = true,
  onStakeMore,
  onWithdraw
}: CollateralStakingDisplayProps) => {

  const stakingPercentage = (stakingInfo.actualStaked / stakingInfo.requiredStake) * 100;
  const isFullyStaked = stakingInfo.actualStaked >= stakingInfo.requiredStake;
  const timeUntilUnlock = stakingInfo.lockedUntil - Date.now();
  const isLocked = timeUntilUnlock > 0;

  const getStakingStatus = () => {
    if (stakingInfo.actualStaked < stakingInfo.requiredStake * 0.8) {
      return { status: 'Critical', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
    }
    if (stakingInfo.actualStaked < stakingInfo.requiredStake) {
      return { status: 'Warning', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle };
    }
    return { status: 'Healthy', color: 'bg-green-100 text-green-700', icon: Shield };
  };

  const stakingStatus = getStakingStatus();
  const StatusIcon = stakingStatus.icon;

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Soon';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Collateral & Staking</span>
          <Badge className={stakingStatus.color}>
            {stakingStatus.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Staking Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Required Stake</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              ${stakingInfo.requiredStake.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {((stakingInfo.requiredStake / loanAmount) * 100).toFixed(1)}% of loan
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Actual Staked</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              ${stakingInfo.actualStaked.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {stakingInfo.stakingRatio.toFixed(2)}x requirement
            </p>
          </Card>
        </div>
        
        {/* Staking Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Staking Progress</span>
            </div>
            <span className="text-sm font-semibold">
              {stakingPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={Math.min(100, stakingPercentage)} className="h-3" />
          <div className="flex justify-between text-xs text-slate-600">
            <span>Required: ${stakingInfo.requiredStake.toLocaleString()}</span>
            <span>Staked: ${stakingInfo.actualStaked.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Lock Status */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Lock Status</span>
          </div>
          
          {isLocked ? (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Lock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Locked</span>
              </div>
              <p className="text-xs text-orange-700">
                Unlocks in {formatTimeRemaining(timeUntilUnlock)}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Unlock date: {new Date(stakingInfo.lockedUntil).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Unlocked</span>
              </div>
              <p className="text-xs text-green-700">
                Collateral is available for withdrawal
              </p>
            </div>
          )}
        </div>
        
        {/* Risk & Rewards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Slashing Risk</span>
            </div>
            <div className="text-lg font-bold text-red-600">
              {(stakingInfo.slashingRisk * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600">
              Maximum penalty for default
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Staking Rewards</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              ${stakingInfo.rewards.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600">
              Estimated rewards earned
            </p>
          </div>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={onStakeMore}
                disabled={isFullyStaked}
                className="flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Stake More</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onWithdraw}
                disabled={isLocked}
                className="flex items-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Withdraw</span>
              </Button>
            </div>
            
            {!isFullyStaked && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Consider staking more to improve your loan terms and reduce risk
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollateralStakingDisplay;
