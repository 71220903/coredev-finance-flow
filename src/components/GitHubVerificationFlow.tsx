
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Github, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Copy, 
  ExternalLink,
  Shield,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { GitHubAPIService } from '@/services/githubApi';
import { useToast } from '@/hooks/use-toast';

interface GitHubVerificationFlowProps {
  onVerificationComplete?: (result: VerificationResult) => void;
}

interface VerificationResult {
  isVerified: boolean;
  githubHandle: string;
  verificationMethod: 'gist' | 'repo' | 'profile';
  evidence?: string;
  trustScoreBoost: number;
}

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  required: boolean;
}

const GitHubVerificationFlow = ({ onVerificationComplete }: GitHubVerificationFlowProps) => {
  const { address } = useWallet();
  const { toast } = useToast();
  
  const [githubHandle, setGithubHandle] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'gist' | 'repo' | 'profile'>('gist');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: 'github-check',
      title: 'GitHub Profile Check',
      description: 'Verify GitHub account exists and is accessible',
      status: 'active',
      required: true
    },
    {
      id: 'method-select',
      title: 'Select Verification Method',
      description: 'Choose how to verify ownership of the GitHub account',
      status: 'pending',
      required: true
    },
    {
      id: 'code-placement',
      title: 'Place Verification Code',
      description: 'Add verification code to your GitHub account',
      status: 'pending',
      required: true
    },
    {
      id: 'verification',
      title: 'Verify Ownership',
      description: 'Confirm wallet address ownership',
      status: 'pending',
      required: true
    }
  ]);

  React.useEffect(() => {
    if (address) {
      const code = `coredev-verify-${address.slice(0, 8)}`;
      setVerificationCode(code);
    }
  }, [address]);

  const updateStepStatus = (stepId: string, status: VerificationStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const handleGitHubCheck = async () => {
    if (!githubHandle.trim()) {
      toast({
        title: "GitHub Handle Required",
        description: "Please enter a valid GitHub username",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    updateStepStatus('github-check', 'active');

    try {
      const profileData = await GitHubAPIService.fetchUserProfile(githubHandle);
      
      if (profileData.user) {
        updateStepStatus('github-check', 'completed');
        updateStepStatus('method-select', 'active');
        setCurrentStep(1);
        
        toast({
          title: "GitHub Profile Found",
          description: `Found profile for ${profileData.user.name || githubHandle}`
        });
      }
    } catch (error) {
      updateStepStatus('github-check', 'failed');
      toast({
        title: "GitHub Profile Not Found",
        description: "Please check the username and try again",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleMethodSelect = (method: 'gist' | 'repo' | 'profile') => {
    setVerificationMethod(method);
    updateStepStatus('method-select', 'completed');
    updateStepStatus('code-placement', 'active');
    setCurrentStep(2);
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    updateStepStatus('verification', 'active');

    try {
      const verificationResult = await GitHubAPIService.verifyGitHubHandle(
        githubHandle, 
        address || ''
      );

      if (verificationResult.isVerified) {
        updateStepStatus('verification', 'completed');
        
        const result: VerificationResult = {
          isVerified: true,
          githubHandle,
          verificationMethod,
          evidence: verificationResult.evidence,
          trustScoreBoost: 15 // 15% boost for verification
        };

        onVerificationComplete?.(result);
        
        toast({
          title: "Verification Successful!",
          description: "Your GitHub account has been verified and linked to your wallet"
        });
      } else {
        updateStepStatus('verification', 'failed');
        toast({
          title: "Verification Failed",
          description: "Could not find verification code. Please check placement and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      updateStepStatus('verification', 'failed');
      toast({
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Verification code copied successfully"
    });
  };

  const getStepProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const getVerificationInstructions = () => {
    const baseUrl = `https://github.com/${githubHandle}`;
    
    switch (verificationMethod) {
      case 'gist':
        return {
          title: 'Create a Public Gist',
          instructions: [
            `Go to https://gist.github.com`,
            `Create a new public gist`,
            `Set filename to: coredev-verification.txt`,
            `Add the verification code as the content`,
            `Save the gist and copy the URL`
          ],
          url: 'https://gist.github.com'
        };
      case 'repo':
        return {
          title: 'Add to Repository README',
          instructions: [
            `Go to any of your public repositories`,
            `Edit the README.md file`,
            `Add the verification code at the bottom`,
            `Commit the changes`,
            `The code should be visible in the README`
          ],
          url: baseUrl
        };
      case 'profile':
        return {
          title: 'Update Profile Bio',
          instructions: [
            `Go to your GitHub profile settings`,
            `Edit your bio section`,
            `Add the verification code to your bio`,
            `Save the changes`,
            `The code should be visible on your profile`
          ],
          url: `${baseUrl}/settings/profile`
        };
    }
  };

  const instructions = getVerificationInstructions();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Github className="h-6 w-6" />
          <CardTitle>GitHub Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your GitHub account to boost your trust score and unlock better lending terms
        </CardDescription>
        <div className="mt-4">
          <Progress value={getStepProgress()} className="h-2" />
          <p className="text-sm text-slate-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verification Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {step.status === 'completed' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {step.status === 'active' && (
                  <Clock className="h-5 w-5 text-blue-600" />
                )}
                {step.status === 'failed' && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                {step.status === 'pending' && (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs value={`step-${currentStep}`} className="w-full">
          {/* Step 0: GitHub Handle Input */}
          <TabsContent value="step-0">
            <div className="space-y-4">
              <div>
                <Label htmlFor="github-handle">GitHub Username</Label>
                <Input
                  id="github-handle"
                  placeholder="your-github-username"
                  value={githubHandle}
                  onChange={(e) => setGithubHandle(e.target.value.trim())}
                  disabled={isVerifying}
                />
              </div>
              <Button 
                onClick={handleGitHubCheck}
                disabled={!githubHandle.trim() || isVerifying}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking Profile...
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Check GitHub Profile
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Step 1: Method Selection */}
          <TabsContent value="step-1">
            <div className="space-y-4">
              <h3 className="font-medium">Choose Verification Method</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant={verificationMethod === 'gist' ? 'default' : 'outline'}
                  onClick={() => handleMethodSelect('gist')}
                  className="justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="font-medium">Public Gist (Recommended)</div>
                    <div className="text-sm opacity-80">Create a public gist with verification code</div>
                  </div>
                </Button>
                <Button
                  variant={verificationMethod === 'repo' ? 'default' : 'outline'}
                  onClick={() => handleMethodSelect('repo')}
                  className="justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="font-medium">Repository README</div>
                    <div className="text-sm opacity-80">Add code to any public repository README</div>
                  </div>
                </Button>
                <Button
                  variant={verificationMethod === 'profile' ? 'default' : 'outline'}
                  onClick={() => handleMethodSelect('profile')}
                  className="justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="font-medium">Profile Bio</div>
                    <div className="text-sm opacity-80">Add code to your GitHub profile bio</div>
                  </div>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Step 2: Code Placement */}
          <TabsContent value="step-2">
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>{instructions.title}</strong>
                  <div className="mt-2 space-y-1">
                    {instructions.instructions.map((instruction, index) => (
                      <div key={index} className="text-sm">
                        {index + 1}. {instruction}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>

              <div className="bg-slate-50 p-4 rounded-lg">
                <Label className="text-sm font-medium">Verification Code</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <code className="flex-grow bg-white p-2 rounded border font-mono text-sm">
                    {verificationCode}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(verificationCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(instructions.url, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open GitHub
                </Button>
                <Button
                  onClick={() => {
                    updateStepStatus('code-placement', 'completed');
                    updateStepStatus('verification', 'active');
                    setCurrentStep(3);
                  }}
                  className="flex-1"
                >
                  Code Placed
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Step 3: Final Verification */}
          <TabsContent value="step-3">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Make sure you've placed the verification code in your GitHub account using the selected method.
                  We'll now check for the code to complete verification.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleVerification}
                disabled={isVerifying}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify GitHub Account
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GitHubVerificationFlow;
