
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, Shield, TrendingUp } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { WalletConnect } from '@/components/WalletConnect';
import { useState } from 'react';

interface TransactionGateProps {
  children: ReactNode;
  action: string;
  description?: string;
}

export const TransactionGate = ({ children, action, description }: TransactionGateProps) => {
  const { isConnected } = useWallet();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!isConnected) {
      setShowModal(true);
      return;
    }
    // If connected, trigger the original action
    // This will be handled by the child component
  };

  if (isConnected) {
    return <>{children}</>;
  }

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-center">Connect Wallet Required</DialogTitle>
            <DialogDescription className="text-center">
              {description || `To ${action.toLowerCase()}, you need to connect your wallet first.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Secure & Safe</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Track Your Investments</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <WalletConnect />
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Continue Browsing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
