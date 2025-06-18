
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Image, 
  ExternalLink, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Copy,
  Share,
  Award,
  Eye
} from 'lucide-react';

interface LoanPositionNFT {
  tokenId: string;
  marketAddress: string;
  principalAmount: number;
  interestEarned: number;
  mintDate: number;
  status: 'active' | 'repaid' | 'defaulted';
  marketInfo: {
    borrowerName: string;
    projectTitle: string;
    riskLevel: string;
  };
  metadata: {
    image: string;
    name: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

interface LoanPositionNFTCardProps {
  nft: LoanPositionNFT;
  onTrade?: (tokenId: string) => void;
  onTransfer?: (tokenId: string) => void;
  onViewMarket?: (marketAddress: string) => void;
}

const LoanPositionNFTCard = ({
  nft,
  onTrade,
  onTransfer,
  onViewMarket
}: LoanPositionNFTCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'repaid': return 'bg-green-100 text-green-700';
      case 'defaulted': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const totalValue = nft.principalAmount + nft.interestEarned;
  const roi = nft.principalAmount > 0 ? (nft.interestEarned / nft.principalAmount) * 100 : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <span>Loan Position #{nft.tokenId}</span>
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">{nft.metadata.name}</p>
          </div>
          <Badge className={getStatusColor(nft.status)}>
            {nft.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* NFT Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
          {!imageError && nft.metadata.image ? (
            <img
              src={nft.metadata.image}
              alt={nft.metadata.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="h-12 w-12 text-slate-400" />
            </div>
          )}
          
          {/* Overlay with quick stats */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="text-white">
              <div className="text-lg font-bold">${totalValue.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Value</div>
            </div>
          </div>
        </div>
        
        {/* Position Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-slate-700">Principal</span>
              </div>
              <p className="text-sm font-semibold">${nft.principalAmount.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-slate-700">Interest Earned</span>
              </div>
              <p className="text-sm font-semibold text-green-600">
                ${nft.interestEarned.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-slate-500" />
                <span className="text-xs font-medium text-slate-700">Minted</span>
              </div>
              <p className="text-xs text-slate-600">
                {new Date(nft.mintDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-slate-500" />
                <span className="text-xs font-medium text-slate-700">ROI</span>
              </div>
              <p className="text-xs font-semibold text-green-600">
                +{roi.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* Market Info */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{nft.marketInfo.projectTitle}</span>
            <Badge className={getRiskColor(nft.marketInfo.riskLevel)}>
              {nft.marketInfo.riskLevel}
            </Badge>
          </div>
          <p className="text-xs text-slate-600">by {nft.marketInfo.borrowerName}</p>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMarket?.(nft.marketAddress)}
              className="flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>View Market</span>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>Details</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>NFT Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Metadata</h4>
                    <p className="text-sm text-slate-600">{nft.metadata.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Attributes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {nft.metadata.attributes.map((attr, index) => (
                        <div key={index} className="p-2 bg-slate-50 rounded">
                          <div className="text-xs font-medium">{attr.trait_type}</div>
                          <div className="text-sm">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Contract Info</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-600">Token ID:</span>
                      <code className="text-xs bg-slate-100 px-1 rounded">{nft.tokenId}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nft.tokenId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTrade?.(nft.tokenId)}
              disabled={nft.status !== 'active'}
              className="flex items-center space-x-1"
            >
              <DollarSign className="h-3 w-3" />
              <span>Trade</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTransfer?.(nft.tokenId)}
              className="flex items-center space-x-1"
            >
              <Share className="h-3 w-3" />
              <span>Transfer</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanPositionNFTCard;
