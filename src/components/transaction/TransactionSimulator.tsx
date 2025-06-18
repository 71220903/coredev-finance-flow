
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Fuel, 
  DollarSign,
  AlertTriangle,
  Info,
  TrendingUp,
  Shield
} from 'lucide-react';
import { ethers } from 'ethers';

interface TransactionStep {
  id: string;
  title: string;
  description: string;
  gasEstimate: number;
  status: 'pending' | 'running' | 'success' | 'error';
  error?: string;
}

interface SimulationResult {
  success: boolean;
  gasUsed: number;
  gasPrice: ethers.BigNumberish;
  totalCost: string;
  steps: TransactionStep[];
  warnings: string[];
  optimizations: string[];
}

interface TransactionSimulatorProps {
  transactionType: 'deposit' | 'withdraw' | 'create-market' | 'repay-loan';
  amount?: string;
  marketAddress?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TransactionSimulator = ({
  transactionType,
  amount,
  marketAddress,
  onConfirm,
  onCancel
}: TransactionSimulatorProps) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  const getTransactionSteps = (): TransactionStep[] => {
    switch (transactionType) {
      case 'deposit':
        return [
          {
            id: 'approve',
            title: 'Token Approval',
            description: 'Approve sUSDT token spending',
            gasEstimate: 46000,
            status: 'pending'
          },
          {
            id: 'deposit',
            title: 'Deposit Funds',
            description: 'Transfer tokens to lending pool',
            gasEstimate: 85000,
            status: 'pending'
          },
          {
            id: 'mint-nft',
            title: 'Mint Position NFT',
            description: 'Create loan position NFT',
            gasEstimate: 120000,
            status: 'pending'
          }
        ];
      case 'create-market':
        return [
          {
            id: 'deploy-market',
            title: 'Deploy Market',
            description: 'Create new loan market contract',
            gasEstimate: 2100000,
            status: 'pending'
          },
          {
            id: 'set-parameters',
            title: 'Set Parameters',
            description: 'Configure market parameters',
            gasEstimate: 180000,
            status: 'pending'
          },
          {
            id: 'stake-collateral',
            title: 'Stake Collateral',
            description: 'Lock collateral tokens',
            gasEstimate: 95000,
            status: 'pending'
          }
        ];
      default:
        return [];
    }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setActiveTab('simulation');
    
    const steps = getTransactionSteps();
    const updatedSteps = [...steps];
    
    // Simulate each step
    for (let i = 0; i < updatedSteps.length; i++) {
      updatedSteps[i].status = 'running';
      setSimulationResult(prev => prev ? { ...prev, steps: updatedSteps } : null);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;
      updatedSteps[i].status = success ? 'success' : 'error';
      
      if (!success) {
        updatedSteps[i].error = 'Transaction would revert: Insufficient allowance';
        break;
      }
    }
    
    const totalGas = updatedSteps.reduce((sum, step) => sum + step.gasEstimate, 0);
    const gasPrice = ethers.parseUnits('20', 'gwei');
    const totalCost = ethers.formatEther(gasPrice * BigInt(totalGas));
    
    const result: SimulationResult = {
      success: updatedSteps.every(step => step.status === 'success'),
      gasUsed: totalGas,
      gasPrice,
      totalCost,
      steps: updatedSteps,
      warnings: [
        'Gas price is higher than usual due to network congestion',
        'Consider splitting large transactions to reduce risk'
      ],
      optimizations: [
        'Use multicall to batch approvals and deposits',
        'Set gas limit 20% higher than estimate for safety'
      ]
    };
    
    setSimulationResult(result);
    setIsSimulating(false);
  };

  useEffect(() => {
    // Auto-run simulation when component mounts
    runSimulation();
  }, [transactionType, amount, marketAddress]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5" />
          <span>Transaction Preview</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Transaction Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge variant="outline">{transactionType.replace('-', ' ')}</Badge>
                </div>
                {amount && (
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{amount} sUSDT</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Gas:</span>
                  <span>{getTransactionSteps().reduce((sum, step) => sum + step.gasEstimate, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button onClick={runSimulation} className="w-full" disabled={isSimulating}>
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4">
            {simulationResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Transaction Steps</h3>
                  <Badge variant={simulationResult.success ? 'default' : 'destructive'}>
                    {simulationResult.success ? 'Would Succeed' : 'Would Fail'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {simulationResult.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {getStatusIcon(step.status)}
                      <div className="flex-grow">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-slate-600">{step.description}</div>
                        {step.error && (
                          <div className="text-xs text-red-600 mt-1">{step.error}</div>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {step.gasEstimate.toLocaleString()} gas
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Fuel className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Gas Estimation</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Total Gas:</span>
                      <div className="font-medium">{simulationResult.gasUsed.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Estimated Cost:</span>
                      <div className="font-medium">{simulationResult.totalCost} tCORE</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {simulationResult && (
              <>
                {simulationResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Warnings</span>
                    </div>
                    {simulationResult.warnings.map((warning, index) => (
                      <div key={index} className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-200">
                        {warning}
                      </div>
                    ))}
                  </div>
                )}

                {simulationResult.optimizations.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Optimizations</span>
                    </div>
                    {simulationResult.optimizations.map((optimization, index) => (
                      <div key={index} className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-200">
                        {optimization}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1"
            disabled={!simulationResult?.success}
          >
            {simulationResult?.success ? 'Execute Transaction' : 'Cannot Execute'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
