
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  BarChart3,
  Activity,
  AlertCircle
} from 'lucide-react';
import { MarketConditions } from '@/types/market';

interface DynamicRateCalculatorProps {
  baseRate: number;
  trustScore: number;
  marketConditions: MarketConditions;
  loanAmount: number;
  tenor: number;
  onRateChange?: (newRate: number) => void;
}

const DynamicRateCalculator = ({
  baseRate,
  trustScore,
  marketConditions,
  loanAmount,
  tenor,
  onRateChange
}: DynamicRateCalculatorProps) => {
  const [adjustedTrustScore, setAdjustedTrustScore] = useState(trustScore);
  const [adjustedAmount, setAdjustedAmount] = useState(loanAmount);
  const [adjustedTenor, setAdjustedTenor] = useState(tenor);

  const calculateDynamicRate = () => {
    // Base rate calculation
    let rate = marketConditions.baseRate;
    
    // Trust score adjustment (higher trust = lower rate)
    const trustAdjustment = (100 - adjustedTrustScore) * 0.1; // Max 10% adjustment
    rate += trustAdjustment;
    
    // Risk premium
    rate += marketConditions.riskPremium;
    
    // Liquidity multiplier
    rate *= marketConditions.liquidityMultiplier;
    
    // Market volatility adjustment
    rate += marketConditions.marketVolatility * 5; // Volatility impact
    
    // Demand/supply ratio impact
    const demandImpact = (marketConditions.demandSupplyRatio - 1) * 2;
    rate += demandImpact;
    
    // Loan amount impact (larger loans get slightly better rates)
    const amountAdjustment = Math.max(0, (50000 - adjustedAmount) / 50000 * 2);
    rate += amountAdjustment;
    
    // Tenor impact (longer terms = higher rates)
    const tenorAdjustment = (adjustedTenor / 365) * 1.5;
    rate += tenorAdjustment;
    
    return Math.max(3, Math.min(25, rate)); // Cap between 3% and 25%
  };

  const dynamicRate = calculateDynamicRate();

  useEffect(() => {
    onRateChange?.(dynamicRate);
  }, [dynamicRate, onRateChange]);

  const getFactorImpact = (factor: string, value: number) => {
    const impacts = {
      trustScore: adjustedTrustScore >= 70 ? 'negative' : 'positive',
      amount: adjustedAmount >= 30000 ? 'negative' : 'positive',
      tenor: adjustedTenor <= 180 ? 'negative' : 'positive',
      marketVolatility: marketConditions.marketVolatility > 0.3 ? 'positive' : 'neutral',
      demandSupply: marketConditions.demandSupplyRatio > 1.2 ? 'positive' : 'negative'
    };
    
    return impacts[factor as keyof typeof impacts] || 'neutral';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-red-600 bg-red-50';
      case 'negative': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Dynamic Interest Rate Calculator</span>
          <Badge className="bg-blue-100 text-blue-700">
            {dynamicRate.toFixed(2)}% APR
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Rate Display */}
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {dynamicRate.toFixed(2)}%
          </div>
          <p className="text-sm text-slate-600">Calculated Interest Rate</p>
        </div>
        
        {/* Interactive Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Trust Score: {adjustedTrustScore}</label>
              <Badge className={getImpactColor(getFactorImpact('trustScore', adjustedTrustScore))}>
                {getFactorImpact('trustScore', adjustedTrustScore) === 'negative' ? '↓' : '↑'} Rate
              </Badge>
            </div>
            <Slider
              value={[adjustedTrustScore]}
              onValueChange={(value) => setAdjustedTrustScore(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Loan Amount: ${adjustedAmount.toLocaleString()}</label>
              <Badge className={getImpactColor(getFactorImpact('amount', adjustedAmount))}>
                {getFactorImpact('amount', adjustedAmount) === 'negative' ? '↓' : '↑'} Rate
              </Badge>
            </div>
            <Slider
              value={[adjustedAmount]}
              onValueChange={(value) => setAdjustedAmount(value[0])}
              max={100000}
              min={5000}
              step={5000}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tenor: {adjustedTenor} days</label>
              <Badge className={getImpactColor(getFactorImpact('tenor', adjustedTenor))}>
                {getFactorImpact('tenor', adjustedTenor) === 'negative' ? '↓' : '↑'} Rate
              </Badge>
            </div>
            <Slider
              value={[adjustedTenor]}
              onValueChange={(value) => setAdjustedTenor(value[0])}
              max={730}
              min={30}
              step={30}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Market Factors */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Market Conditions Impact</span>
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">Base Rate</span>
              </div>
              <p className="text-sm font-semibold">{marketConditions.baseRate.toFixed(2)}%</p>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs font-medium">Risk Premium</span>
              </div>
              <p className="text-sm font-semibold">+{marketConditions.riskPremium.toFixed(2)}%</p>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Activity className="h-3 w-3" />
                <span className="text-xs font-medium">Volatility</span>
              </div>
              <p className="text-sm font-semibold">{(marketConditions.marketVolatility * 100).toFixed(1)}%</p>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="h-3 w-3" />
                <span className="text-xs font-medium">Demand/Supply</span>
              </div>
              <p className="text-sm font-semibold">{marketConditions.demandSupplyRatio.toFixed(2)}x</p>
            </div>
          </div>
        </div>
        
        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={() => {
            setAdjustedTrustScore(trustScore);
            setAdjustedAmount(loanAmount);
            setAdjustedTenor(tenor);
          }}
          className="w-full"
        >
          <Clock className="h-4 w-4 mr-2" />
          Reset to Original Values
        </Button>
      </CardContent>
    </Card>
  );
};

export default DynamicRateCalculator;
