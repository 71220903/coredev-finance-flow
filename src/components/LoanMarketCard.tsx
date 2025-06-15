import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TrustScoreWidget from "./TrustScoreWidget";
import { useEnhancedTokenDeposit } from "@/hooks/useEnhancedTokenDeposit";
import { 
  Clock, 
  DollarSign, 
  TrendingUp, 
  User, 
  Eye,
  Calendar,
  Target,
  Percent
} from "lucide-react";
import { Link } from "react-router-dom";

interface LoanMarket {
  id: string;
  borrower: {
    name: string;
    githubHandle: string;
    avatar: string;
    trustScore: number;
    trustBreakdown: {
      github: number;
      codeQuality: number;
      community: number;
      onChain: number;
    };
  };
  project: {
    title: string;
    description: string;
    tags: string[];
  };
  loan: {
    amount: number;
    interestRate: number;
    tenor: string;
    tenorDays: number;
    funded: number;
    target: number;
    status: 'funding' | 'active' | 'repaid' | 'defaulted';
    timeLeft?: string;
    startDate?: string;
    dueDate?: string;
  };
}

interface LoanMarketCardProps {
  market: LoanMarket;
  userRole?: 'borrower' | 'lender';
}

const LoanMarketCard = ({ market, userRole = 'lender' }: LoanMarketCardProps) => {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  
  const {
    balance,
    allowance,
    isApproving,
    isDepositing,
    executeDeposit,
    hasSufficientAllowance,
    hasSufficientBalance
  } = useEnhancedTokenDeposit(market.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funding': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'repaid': return 'bg-emerald-500';
      case 'defaulted': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'funding': return 'Seeking Funding';
      case 'active': return 'Active Loan';
      case 'repaid': return 'Successfully Repaid';
      case 'defaulted': return 'Defaulted';
      default: return 'Unknown';
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    
    const success = await executeDeposit(depositAmount);
    if (success) {
      setDepositAmount('');
      setShowDepositForm(false);
    }
  };

  const remainingAmount = market.loan.target * (100 - market.loan.funded) / 100;
  const maxDepositAmount = Math.min(remainingAmount, parseFloat(balance) || 0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={market.borrower.avatar} 
              alt={market.borrower.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <CardTitle className="text-lg">{market.project.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                <span>{market.borrower.name}</span>
                <span>•</span>
                <span>{market.borrower.githubHandle}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(market.loan.status)} text-white`}>
              {getStatusText(market.loan.status)}
            </Badge>
            <TrustScoreWidget score={market.borrower.trustScore} compact />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-700">{market.project.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {market.project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        {/* Loan Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-slate-600 mr-1" />
              <span className="text-sm text-slate-600">Amount</span>
            </div>
            <div className="font-semibold">${market.loan.amount.toLocaleString()}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Percent className="h-4 w-4 text-slate-600 mr-1" />
              <span className="text-sm text-slate-600">Interest</span>
            </div>
            <div className="font-semibold text-green-600">{market.loan.interestRate}% APR</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-slate-600 mr-1" />
              <span className="text-sm text-slate-600">Tenor</span>
            </div>
            <div className="font-semibold">{market.loan.tenor}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-slate-600 mr-1" />
              <span className="text-sm text-slate-600">Time Left</span>
            </div>
            <div className="font-semibold text-orange-600">
              {market.loan.timeLeft || 'N/A'}
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        {market.loan.status === 'funding' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Funding Progress</span>
              <span>{market.loan.funded.toFixed(1)}% of ${market.loan.target.toLocaleString()}</span>
            </div>
            <Progress value={market.loan.funded} className="h-3" />
            <div className="text-sm text-slate-600">
              Remaining: ${remainingAmount.toLocaleString()}
            </div>
          </div>
        )}

        {/* Enhanced Deposit Form with NFT Integration */}
        {showDepositForm && market.loan.status === 'funding' && (
          <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
            <div className="text-sm text-slate-600">
              Your sUSDT Balance: {parseFloat(balance).toFixed(2)}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Deposit Amount (sUSDT)</Label>
              <Input
                id="depositAmount"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                max={maxDepositAmount}
                step="0.01"
              />
              <div className="text-xs text-blue-600">
                💡 A Loan Position NFT will be minted to represent your deposit
              </div>
            </div>
            
            {depositAmount && !hasSufficientBalance(depositAmount) && (
              <div className="text-sm text-red-600">Insufficient balance</div>
            )}
            
            {depositAmount && !hasSufficientAllowance(depositAmount) && (
              <div className="text-sm text-yellow-600">
                Approval needed for {depositAmount} sUSDT
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleDeposit}
                disabled={
                  !depositAmount || 
                  parseFloat(depositAmount) <= 0 || 
                  !hasSufficientBalance(depositAmount) ||
                  isApproving ||
                  isDepositing
                }
                className="flex-1"
              >
                {isApproving ? 'Approving...' : isDepositing ? 'Depositing...' : 'Deposit & Mint NFT'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDepositForm(false)}
                disabled={isApproving || isDepositing}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Loan Timeline for Active/Repaid */}
        {(market.loan.status === 'active' || market.loan.status === 'repaid') && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-slate-600">Started:</span>
                <span className="font-medium ml-1">{market.loan.startDate}</span>
              </div>
              <div>
                <span className="text-slate-600">Due:</span>
                <span className="font-medium ml-1">{market.loan.dueDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <Button variant="outline" asChild>
            <Link to={`/project/${market.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          
          <div className="space-x-2">
            {userRole === 'lender' && market.loan.status === 'funding' && !showDepositForm && (
              <Button onClick={() => setShowDepositForm(true)}>
                Fund ${remainingAmount.toLocaleString()}
              </Button>
            )}
            
            {userRole === 'lender' && market.loan.status === 'repaid' && (
              <Button variant="outline">
                Claim Returns
              </Button>
            )}
            
            {userRole === 'borrower' && market.loan.status === 'funding' && (
              <Button variant="outline">
                Edit Market
              </Button>
            )}
            
            {userRole === 'borrower' && market.loan.status === 'active' && (
              <Button>
                Repay Loan
              </Button>
            )}
            
            <Button variant="ghost" asChild>
              <Link to={`/developer/${market.borrower.githubHandle.slice(1)}`}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanMarketCard;
