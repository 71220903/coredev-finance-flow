
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDeveloperVerification } from '@/hooks/useDeveloperVerification';
import { useWallet } from '@/hooks/useWallet';
import { 
  User, 
  Github, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle 
} from 'lucide-react';

interface DeveloperVerificationProps {
  onVerificationChange?: (isVerified: boolean) => void;
}

const DeveloperVerification = ({ onVerificationChange }: DeveloperVerificationProps) => {
  const { isConnected, isOnCorrectNetwork } = useWallet();
  const { 
    hasProfile, 
    hasDeveloperRole, 
    isVerified, 
    isLoading, 
    createProfile,
    refreshStatus 
  } = useDeveloperVerification();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    githubHandle: '',
    profileDataCID: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Notify parent component of verification changes
  React.useEffect(() => {
    onVerificationChange?.(isVerified);
  }, [isVerified, onVerificationChange]);

  const handleCreateProfile = async () => {
    if (!formData.githubHandle) {
      return;
    }

    setIsCreating(true);
    
    const success = await createProfile(
      formData.githubHandle, 
      formData.profileDataCID || 'QmDefaultProfileCID'
    );
    
    if (success) {
      setIsDialogOpen(false);
      setFormData({ githubHandle: '', profileDataCID: '' });
    }
    
    setIsCreating(false);
  };

  if (!isConnected || !isOnCorrectNetwork) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-lg">Wallet Connection Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700">
            Please connect your wallet to Core Testnet to verify your developer status.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking developer verification status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isVerified ? "border-green-200 bg-green-50" : "border-slate-200"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className={`h-5 w-5 ${isVerified ? "text-green-600" : "text-slate-400"}`} />
            <CardTitle className="text-lg">Developer Verification</CardTitle>
          </div>
          <Badge variant={isVerified ? "default" : "secondary"}>
            {isVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>
        <CardDescription>
          Verify your developer status to create loan markets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Verification Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            {hasProfile ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">Developer Profile</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasDeveloperRole ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">Developer Role</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {!hasProfile && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  Create Profile
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Developer Profile</DialogTitle>
                  <DialogDescription>
                    Create your on-chain developer profile to start creating loan markets
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="githubHandle">GitHub Handle</Label>
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4 text-slate-500" />
                      <Input
                        id="githubHandle"
                        placeholder="your-github-username"
                        value={formData.githubHandle}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          githubHandle: e.target.value 
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="profileDataCID">Profile Data CID (Optional)</Label>
                    <Input
                      id="profileDataCID"
                      placeholder="IPFS hash for additional profile data"
                      value={formData.profileDataCID}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        profileDataCID: e.target.value 
                      }))}
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleCreateProfile}
                    disabled={!formData.githubHandle || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Profile...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Create Profile
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Button 
            variant="outline" 
            onClick={refreshStatus}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Shield className="h-4 w-4 mr-2" />
            )}
            Refresh Status
          </Button>
        </div>

        {!hasDeveloperRole && hasProfile && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Your profile has been created. Please contact an admin to grant you developer role permissions.
            </p>
          </div>
        )}

        {isVerified && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ You are verified! You can now create loan markets and participate as a borrower.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeveloperVerification;
