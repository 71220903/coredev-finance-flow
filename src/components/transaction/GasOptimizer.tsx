
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Fuel, 
  Zap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Info,
  Settings
} from 'lucide-react';
import { ethers } from 'ethers';

interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
}

interface GasEstimate {
  gasLimit: number;
  gasPrice: number;
  totalCost: string;
  executionTime: string;
  confidence: number;
}

interface GasOptimizerProps {
  transactionType: string;
  gasLimit: number;
  onGasConfigChange: (gasPrice: number, gasLimit: number) => void;
}

export const GasOptimizer = ({ 
  transactionType, 
  gasLimit, 
  onGasConfigChange 
}: GasOptimizerProps) => {
  const [gasPrices, setGasPrices] = useState<GasPrice>({
    slow: 15,
    standard: 25,
    fast: 35,
    instant: 50
  });
  
  const [selectedSpeed, setSelectedSpeed] = useState<keyof GasPrice>('standard');
  const [customGasPrice, setCustomGasPrice] = useState(25);
  const [customGasLimit, setCustomGasLimit] = useState(gasLimit);
  const [networkCongestion, setNetworkCongestion] = useState(0.7); // 0-1 scale

  useEffect(() => {
    // Simulate real-time gas price updates
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.1;
      setGasPrices(prev => ({
        slow: Math.max(10, prev.slow + fluctuation * prev.slow),
        standard: Math.max(15, prev.standard + fluctuation * prev.standard),
        fast: Math.max(25, prev.fast + fluctuation * prev.fast),
        instant: Math.max(40, prev.instant + fluctuation * prev.instant)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getGasEstimate = (speed: keyof GasPrice): GasEstimate => {
    const gasPrice = speed === 'custom' ? customGasPrice : gasPrices[speed];
    const adjustedGasLimit = speed === 'custom' ? customGasLimit : gasLimit;
    
    const totalCost = ethers.formatEther(
      ethers.parseUnits(gasPrice.toString(), 'gwei') * BigInt(adjustedGasLimit)
    );

    const executionTimes = {
      slow: '5-10 minutes',
      standard: '2-3 minutes',
      fast: '30-60 seconds',
      instant: '15-30 seconds'
    };

    const confidenceLevels = {
      slow: 95,
      standard: 85,
      fast: 75,
      instant: 60
    };

    return {
      gasLimit: adjustedGasLimit,
      gasPrice,
      totalCost,
      executionTime: executionTimes[speed] || '1-2 minutes',
      confidence: confidenceLevels[speed] || 80
    };
  };

  const getCurrentEstimate = () => getGasEstimate(selectedSpeed);

  const handleSpeedChange = (speed: keyof GasPrice) => {
    setSelectedSpeed(speed);
    const estimate = getGasEstimate(speed);
    onGasConfigChange(estimate.gasPrice, estimate.gasLimit);
  };

  const handleCustomGasChange = (gasPrice: number[]) => {
    setCustomGasPrice(gasPrice[0]);
    onGasConfigChange(gasPrice[0], customGasLimit);
  };

  const handleCustomLimitChange = (gasLimit: number[]) => {
    setCustomGasLimit(gasLimit[0]);
    onGasConfigChange(customGasPrice, gasLimit[0]);
  };

  const getCongestionLevel = () => {
    if (networkCongestion < 0.3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (networkCongestion < 0.7) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const congestion = getCongestionLevel();
  const currentEstimate = getCurrentEstimate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Fuel className="h-5 w-5" />
          <span>Gas Optimizer</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Quick Select</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            {/* Network Status */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${congestion.bg.replace('bg-', 'bg-')}`} />
                <span className="text-sm font-medium">Network Congestion</span>
              </div>
              <Badge className={`${congestion.bg} ${congestion.color}`}>
                {congestion.level}
              </Badge>
            </div>

            {/* Speed Options */}
            <div className="space-y-3">
              {(Object.keys(gasPrices) as Array<keyof GasPrice>).map((speed) => {
                const estimate = getGasEstimate(speed);
                const isSelected = selectedSpeed === speed;
                const icons = {
                  slow: Clock,
                  standard: Fuel,
                  fast: Zap,
                  instant: TrendingUp
                };
                const Icon = icons[speed];

                return (
                  <div
                    key={speed}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => handleSpeedChange(speed)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                        <div>
                          <div className="font-medium capitalize">{speed}</div>
                          <div className="text-sm text-slate-600">{estimate.executionTime}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{estimate.gasPrice} gwei</div>
                        <div className="text-sm text-slate-600">{estimate.totalCost} tCORE</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-700">Confidence Level</span>
                          <span className="font-medium text-blue-700">{estimate.confidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {/* Custom Gas Price */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Gas Price (gwei)</label>
                <span className="text-sm text-slate-600">{customGasPrice} gwei</span>
              </div>
              <Slider
                value={[customGasPrice]}
                onValueChange={handleCustomGasChange}
                max={100}
                min={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>10 gwei (slow)</span>
                <span>100 gwei (very fast)</span>
              </div>
            </div>

            {/* Custom Gas Limit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Gas Limit</label>
                <span className="text-sm text-slate-600">{customGasLimit.toLocaleString()}</span>
              </div>
              <Slider
                value={[customGasLimit]}
                onValueChange={handleCustomLimitChange}
                max={gasLimit * 2}
                min={gasLimit * 0.8}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{(gasLimit * 0.8).toLocaleString()} (risky)</span>
                <span>{(gasLimit * 2).toLocaleString()} (safe)</span>
              </div>
            </div>

            {/* Custom Estimate */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Custom Configuration</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Total Cost:</span>
                  <div className="font-medium">{currentEstimate.totalCost} tCORE</div>
                </div>
                <div>
                  <span className="text-slate-600">Estimated Time:</span>
                  <div className="font-medium">1-5 minutes</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Optimization Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Optimization Tips</span>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Monitor network congestion for better timing</li>
            <li>• Use standard speed for non-urgent transactions</li>
            <li>• Set gas limit 20% higher than estimate for safety</li>
            <li>• Consider batching multiple operations together</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
