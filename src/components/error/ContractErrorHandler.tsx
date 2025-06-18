
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Info,
  Zap,
  Shield,
  Clock,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContractError {
  type: 'revert' | 'gas' | 'network' | 'user-rejected' | 'insufficient-funds';
  message: string;
  code?: string;
  txHash?: string;
  gasUsed?: number;
  gasLimit?: number;
  blockNumber?: number;
}

interface ErrorSolution {
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void;
  };
  severity: 'info' | 'warning' | 'error';
}

interface ContractErrorHandlerProps {
  error: ContractError;
  onRetry: () => void;
  onDismiss: () => void;
}

export const ContractErrorHandler = ({ 
  error, 
  onRetry, 
  onDismiss 
}: ContractErrorHandlerProps) => {
  const { toast } = useToast();

  const getErrorIcon = () => {
    switch (error.type) {
      case 'gas': return <Zap className="h-5 w-5 text-yellow-600" />;
      case 'insufficient-funds': return <DollarSign className="h-5 w-5 text-red-600" />;
      case 'network': return <RefreshCw className="h-5 w-5 text-blue-600" />;
      case 'user-rejected': return <Shield className="h-5 w-5 text-gray-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'gas': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'insufficient-funds': return 'text-red-600 bg-red-50 border-red-200';
      case 'network': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'user-rejected': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'revert': return 'Transaction Reverted';
      case 'gas': return 'Gas Estimation Failed';
      case 'network': return 'Network Error';
      case 'user-rejected': return 'Transaction Rejected';
      case 'insufficient-funds': return 'Insufficient Funds';
      default: return 'Transaction Error';
    }
  };

  const getSolutions = (): ErrorSolution[] => {
    switch (error.type) {
      case 'revert':
        return [
          {
            title: 'Check Contract State',
            description: 'Verify that all conditions are met before transaction execution',
            severity: 'error'
          },
          {
            title: 'Review Parameters',
            description: 'Ensure all input parameters are valid and within expected ranges',
            severity: 'warning'
          },
          {
            title: 'Wait and Retry',
            description: 'Contract state may have changed. Wait a moment and try again',
            action: {
              label: 'Retry Transaction',
              handler: onRetry
            },
            severity: 'info'
          }
        ];

      case 'gas':
        return [
          {
            title: 'Increase Gas Limit',
            description: 'The transaction requires more gas than estimated',
            action: {
              label: 'Use Gas Optimizer',
              handler: () => {
                toast({
                  title: "Gas Optimizer",
                  description: "Opening gas optimization tools..."
                });
              }
            },
            severity: 'warning'
          },
          {
            title: 'Try During Low Congestion',
            description: 'Network congestion is high. Try again when gas prices are lower',
            severity: 'info'
          }
        ];

      case 'insufficient-funds':
        return [
          {
            title: 'Add Funds to Wallet',
            description: 'You need more tCORE tokens to pay for gas fees',
            action: {
              label: 'Get Test Tokens',
              handler: () => {
                window.open('https://scan.test2.btcs.network/faucet', '_blank');
              }
            },
            severity: 'error'
          },
          {
            title: 'Check Token Balance',
            description: 'Ensure you have enough tokens for the transaction amount',
            severity: 'warning'
          }
        ];

      case 'network':
        return [
          {
            title: 'Check Network Connection',
            description: 'Verify your internet connection and try again',
            action: {
              label: 'Retry Connection',
              handler: onRetry
            },
            severity: 'warning'
          },
          {
            title: 'Switch RPC Endpoint',
            description: 'Try switching to a different RPC endpoint in your wallet',
            severity: 'info'
          }
        ];

      case 'user-rejected':
        return [
          {
            title: 'User Cancelled',
            description: 'You rejected the transaction in your wallet',
            action: {
              label: 'Try Again',
              handler: onRetry
            },
            severity: 'info'
          }
        ];

      default:
        return [
          {
            title: 'Unexpected Error',
            description: 'An unexpected error occurred. Please try again',
            action: {
              label: 'Retry',
              handler: onRetry
            },
            severity: 'error'
          }
        ];
    }
  };

  const copyErrorDetails = () => {
    const details = JSON.stringify(error, null, 2);
    navigator.clipboard.writeText(details);
    toast({
      title: "Error Details Copied",
      description: "Error details have been copied to clipboard"
    });
  };

  const openExplorer = () => {
    if (error.txHash) {
      window.open(`https://scan.test2.btcs.network/tx/${error.txHash}`, '_blank');
    }
  };

  const solutions = getSolutions();

  return (
    <Card className={`border-2 ${getErrorColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getErrorIcon()}
          <span>{getErrorTitle()}</span>
          <Badge variant="outline" className={getErrorColor()}>
            {error.type.replace('-', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-2">Error Message</h3>
              <p className="text-sm text-slate-700 font-mono bg-white p-3 rounded border">
                {error.message}
              </p>
            </div>

            {error.txHash && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-900">Transaction Hash</div>
                  <div className="text-sm text-blue-700 font-mono">
                    {error.txHash.slice(0, 20)}...
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={openExplorer}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="solutions" className="space-y-3">
            {solutions.map((solution, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <h4 className="font-medium">{solution.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{solution.description}</p>
                  </div>
                  {solution.action && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={solution.action.handler}
                    >
                      {solution.action.label}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Error Type:</span>
                <span className="font-medium">{error.type}</span>
              </div>
              
              {error.code && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Error Code:</span>
                  <span className="font-medium">{error.code}</span>
                </div>
              )}
              
              {error.gasUsed && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Gas Used:</span>
                  <span className="font-medium">{error.gasUsed.toLocaleString()}</span>
                </div>
              )}
              
              {error.blockNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Block Number:</span>
                  <span className="font-medium">{error.blockNumber}</span>
                </div>
              )}
            </div>

            <Button 
              variant="outline" 
              onClick={copyErrorDetails}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Error Details
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onDismiss} className="flex-1">
            Dismiss
          </Button>
          <Button onClick={onRetry} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
