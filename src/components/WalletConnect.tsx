import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, ChevronDown, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WalletConnect = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { 
    address, 
    isConnected, 
    balance, 
    isConnecting, 
    isOnCorrectNetwork,
    connectWallet, 
    disconnectWallet,
    switchToCore 
  } = useWallet();

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://scan.test2.btcs.network/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Button 
        onClick={connectWallet} 
        disabled={isConnecting}
        className="flex items-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="hidden sm:inline">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <span className="sm:hidden">
              {address?.slice(0, 4)}...
            </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Wallet</DialogTitle>
          <DialogDescription>
            Manage your wallet connection and view balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Network Status */}
          {!isOnCorrectNetwork && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Wrong Network</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Please switch to Core Testnet to interact with the app.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={switchToCore}
              >
                Switch to Core Testnet
              </Button>
            </div>
          )}

          {/* Wallet Info */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-600">Address</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="flex-1 p-2 bg-slate-100 rounded text-sm font-mono">
                  {address}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={openExplorer}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">Balance</label>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-semibold">
                  {parseFloat(balance).toFixed(4)} tCORE2
                </span>
                <Badge variant={isOnCorrectNetwork ? "default" : "destructive"}>
                  {isOnCorrectNetwork ? "Core Testnet" : "Wrong Network"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                disconnectWallet();
                setIsOpen(false);
              }}
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
