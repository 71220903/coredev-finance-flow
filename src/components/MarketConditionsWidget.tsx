
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { MarketConditions } from '@/types/market';

interface MarketConditionsWidgetProps {
  marketConditions: MarketConditions;
  showDetails?: boolean;
}

const MarketConditionsWidget = ({ 
  marketConditions, 
  showDetails = true 
}: MarketConditionsWidgetProps) => {

  const getVolatilityStatus = (volatility: number) => {
    if (volatility < 0.2) return { status: 'Low', color: 'bg-green-100 text-green-700', icon: TrendingUp };
    if (volatility < 0.4) return { status: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: Activity };
    return { status: 'High', color: 'bg-red-100 text-red-700', icon: TrendingDown };
  };

  const getDemandStatus = (ratio: number) => {
    if (ratio < 0.8) return { status: 'Low Demand', color: 'bg-red-100 text-red-700' };
    if (ratio < 1.2) return { status: 'Balanced', color: 'bg-green-100 text-green-700' };
    return { status: 'High Demand', color: 'bg-orange-100 text-orange-700' };
  };

  const volatilityInfo = getVolatilityStatus(marketConditions.marketVolatility);
  const demandInfo = getDemandStatus(marketConditions.demandSupplyRatio);
  const VolatilityIcon = volatilityInfo.icon;

  if (!showDetails) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Market Conditions</div>
                <div className="text-xs text-slate-600">
                  Base: {marketConditions.baseRate.toFixed(1)}%
                </div>
              </div>
            </div>
            <Badge className={volatilityInfo.color}>
              {volatilityInfo.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Market Conditions</span>
          <Badge variant="outline" className="text-xs">
            Updated {new Date(marketConditions.lastUpdated).toLocaleDateString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Base Interest Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {marketConditions.baseRate.toFixed(2)}%
            </div>
            <p className="text-xs text-slate-600 mt-1">Platform base rate</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Risk Premium</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              +{marketConditions.riskPremium.toFixed(2)}%
            </div>
            <p className="text-xs text-slate-600 mt-1">Additional risk adjustment</p>
          </Card>
        </div>
        
        {/* Market Volatility */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <VolatilityIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Market Volatility</span>
            </div>
            <Badge className={volatilityInfo.color}>
              {volatilityInfo.status}
            </Badge>
          </div>
          <Progress value={marketConditions.marketVolatility * 100} className="h-2" />
          <p className="text-xs text-slate-600">
            Current volatility: {(marketConditions.marketVolatility * 100).toFixed(1)}%
          </p>
        </div>
        
        {/* Demand Supply Ratio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Demand/Supply Ratio</span>
            </div>
            <Badge className={demandInfo.color}>
              {demandInfo.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <Progress 
                value={Math.min(100, (marketConditions.demandSupplyRatio / 2) * 100)} 
                className="h-2" 
              />
            </div>
            <span className="text-sm font-medium">
              {marketConditions.demandSupplyRatio.toFixed(2)}x
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {marketConditions.demandSupplyRatio > 1 ? 'More borrowers than lenders' : 'More lenders than borrowers'}
          </p>
        </div>
        
        {/* Liquidity Multiplier */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">Liquidity Multiplier</span>
          </div>
          <div className="flex items-center justify-between">
            <Progress 
              value={(marketConditions.liquidityMultiplier - 0.5) * 100} 
              className="h-2 flex-grow mr-4" 
            />
            <span className="text-sm font-medium">
              {marketConditions.liquidityMultiplier.toFixed(2)}x
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Impact on interest rate calculation
          </p>
        </div>
        
        {/* Last Update */}
        <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="text-xs text-slate-600">
            Last updated: {new Date(marketConditions.lastUpdated).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketConditionsWidget;
