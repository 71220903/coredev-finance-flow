
import { Badge } from '@/components/ui/badge';
import { Eye, Wallet } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

export const BrowseModeIndicator = () => {
  const { isConnected } = useWallet();

  if (isConnected) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-b border-blue-200 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Eye className="h-4 w-4 text-blue-600" />
          <span className="text-blue-700">
            You're browsing in <strong>explore mode</strong>
          </span>
          <Badge variant="secondary" className="text-xs">
            <Wallet className="h-3 w-3 mr-1" />
            Connect wallet to transact
          </Badge>
        </div>
      </div>
    </div>
  );
};
