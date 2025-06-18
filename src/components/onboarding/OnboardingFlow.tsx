
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Wallet, 
  GitBranch, 
  Shield, 
  Coins,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'current' | 'completed';
  action?: () => void;
  requirement?: string;
}

interface OnboardingFlowProps {
  userType: 'developer' | 'lender';
  onComplete: () => void;
}

export const OnboardingFlow = ({ userType, onComplete }: OnboardingFlowProps) => {
  const { isConnected, connectWallet } = useWallet();
  const [currentStep, setCurrentStep] = useState(0);

  const developerSteps: OnboardingStep[] = [
    {
      id: 'wallet',
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet to get started',
      icon: Wallet,
      status: isConnected ? 'completed' : 'current',
      action: connectWallet,
      requirement: 'MetaMask or compatible wallet'
    },
    {
      id: 'github',
      title: 'Verify GitHub',
      description: 'Link your GitHub account for trust scoring',
      icon: GitBranch,
      status: 'pending',
      requirement: 'Active GitHub account with repositories'
    },
    {
      id: 'profile',
      title: 'Complete Profile',
      description: 'Add your developer information and skills',
      icon: FileText,
      status: 'pending',
      requirement: 'Professional developer profile'
    },
    {
      id: 'staking',
      title: 'Stake Collateral',
      description: 'Stake tokens to establish credibility',
      icon: Shield,
      status: 'pending',
      requirement: 'Minimum 100 tCORE tokens'
    },
    {
      id: 'first-market',
      title: 'Create First Market',
      description: 'Launch your first funding request',
      icon: TrendingUp,
      status: 'pending',
      requirement: 'Complete project documentation'
    }
  ];

  const lenderSteps: OnboardingStep[] = [
    {
      id: 'wallet',
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet to get started',
      icon: Wallet,
      status: isConnected ? 'completed' : 'current',
      action: connectWallet,
      requirement: 'MetaMask or compatible wallet'
    },
    {
      id: 'funds',
      title: 'Add Funds',
      description: 'Deposit sUSDT tokens for lending',
      icon: Coins,
      status: 'pending',
      requirement: 'Minimum 50 sUSDT'
    },
    {
      id: 'risk-profile',
      title: 'Set Risk Profile',
      description: 'Configure your lending preferences',
      icon: Shield,
      status: 'pending',
      requirement: 'Risk tolerance assessment'
    },
    {
      id: 'community',
      title: 'Join Community',
      description: 'Connect with other lenders and developers',
      icon: Users,
      status: 'pending',
      requirement: 'Discord verification'
    },
    {
      id: 'first-loan',
      title: 'Make First Investment',
      description: 'Fund your first developer project',
      icon: TrendingUp,
      status: 'pending',
      requirement: 'Review available markets'
    }
  ];

  const steps = userType === 'developer' ? developerSteps : lenderSteps;
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepClick = (stepIndex: number) => {
    const step = steps[stepIndex];
    if (step.action) {
      step.action();
    }
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              Welcome, {userType === 'developer' ? 'Developer' : 'Lender'}!
            </CardTitle>
            <p className="text-slate-600 mt-2">
              Let's get you set up for success on the platform
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {completedSteps}/{steps.length} Complete
          </Badge>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-slate-500 mt-1">{progress.toFixed(0)}% Complete</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = step.status === 'completed';
            const isPending = step.status === 'pending' && index > currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  isActive 
                    ? 'border-blue-200 bg-blue-50' 
                    : isCompleted 
                    ? 'border-green-200 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                } ${isPending ? 'opacity-60' : ''}`}
                onClick={() => handleStepClick(index)}
              >
                <div className={`p-2 rounded-full ${
                  isCompleted 
                    ? 'bg-green-100 text-green-600'
                    : isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-slate-900'
                    }`}>
                      {step.title}
                    </h3>
                    {isCompleted && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Complete
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                  {step.requirement && (
                    <p className="text-xs text-slate-500 mt-2">
                      Requirement: {step.requirement}
                    </p>
                  )}
                </div>

                {isActive && step.action && (
                  <Button size="sm" onClick={(e) => {
                    e.stopPropagation();
                    step.action!();
                  }}>
                    Start
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          >
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next Step'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
