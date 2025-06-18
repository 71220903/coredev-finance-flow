
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Award, 
  Calendar, 
  Star, 
  Trophy, 
  Crown, 
  Medal,
  ExternalLink,
  Share,
  Copy
} from 'lucide-react';

interface AchievementSBT {
  tokenId: string;
  achievementId: string;
  name: string;
  description: string;
  category: 'github' | 'lending' | 'community' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: number;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  trustScoreBonus: number;
}

interface AchievementSBTCardProps {
  sbt: AchievementSBT;
  onShare?: (tokenId: string) => void;
  onViewOnChain?: (tokenId: string) => void;
}

const AchievementSBTCard = ({
  sbt,
  onShare,
  onViewOnChain
}: AchievementSBTCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return Medal;
      case 'rare': return Star;
      case 'epic': return Trophy;
      case 'legendary': return Crown;
      default: return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'github': return 'bg-gray-100 text-gray-700';
      case 'lending': return 'bg-green-100 text-green-700';
      case 'community': return 'bg-blue-100 text-blue-700';
      case 'milestone': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const RarityIcon = getRarityIcon(sbt.rarity);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-2 ${getRarityColor(sbt.rarity)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <RarityIcon className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">{sbt.name}</CardTitle>
              <p className="text-sm text-slate-600">#{sbt.tokenId}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getRarityColor(sbt.rarity)}>
              {sbt.rarity.toUpperCase()}
            </Badge>
            <Badge className={getCategoryColor(sbt.category)}>
              {sbt.category.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Achievement Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          {!imageError && sbt.image ? (
            <img
              src={sbt.image}
              alt={sbt.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <RarityIcon className="h-16 w-16 text-slate-400" />
            </div>
          )}
          
          {/* Rarity glow effect */}
          <div className={`absolute inset-0 opacity-20 ${
            sbt.rarity === 'legendary' ? 'bg-gradient-to-t from-yellow-400 to-transparent' :
            sbt.rarity === 'epic' ? 'bg-gradient-to-t from-purple-400 to-transparent' :
            sbt.rarity === 'rare' ? 'bg-gradient-to-t from-blue-400 to-transparent' :
            'bg-gradient-to-t from-slate-400 to-transparent'
          }`} />
          
          {/* Trust Score Bonus Badge */}
          {sbt.trustScoreBonus > 0 && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500 text-white">
                +{sbt.trustScoreBonus} Trust
              </Badge>
            </div>
          )}
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <p className="text-sm text-slate-700">{sbt.description}</p>
          
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            <span>Earned {new Date(sbt.earnedDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Attributes */}
        {sbt.attributes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Attributes</h4>
            <div className="grid grid-cols-2 gap-2">
              {sbt.attributes.slice(0, 4).map((attr, index) => (
                <div key={index} className="p-2 bg-slate-50 rounded text-center">
                  <div className="text-xs font-medium text-slate-600">{attr.trait_type}</div>
                  <div className="text-sm font-semibold">{attr.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare?.(sbt.tokenId)}
              className="flex items-center space-x-1"
            >
              <Share className="h-3 w-3" />
              <span>Share</span>
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
                  <DialogTitle>Achievement Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <RarityIcon className="h-12 w-12 text-slate-600" />
                    </div>
                    <h3 className="font-bold text-lg">{sbt.name}</h3>
                    <p className="text-sm text-slate-600">{sbt.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Achievement Info</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <Badge className={getCategoryColor(sbt.category)}>
                          {sbt.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Rarity:</span>
                        <Badge className={getRarityColor(sbt.rarity)}>
                          {sbt.rarity}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Trust Bonus:</span>
                        <span className="font-medium text-green-600">+{sbt.trustScoreBonus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Earned:</span>
                        <span>{new Date(sbt.earnedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">All Attributes</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {sbt.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between p-2 bg-slate-50 rounded">
                          <span className="text-sm font-medium">{attr.trait_type}</span>
                          <span className="text-sm">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Contract Info</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-600">Token ID:</span>
                      <code className="text-xs bg-slate-100 px-1 rounded">{sbt.tokenId}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(sbt.tokenId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewOnChain?.(sbt.tokenId)}
            className="w-full flex items-center space-x-2"
          >
            <ExternalLink className="h-3 w-3" />
            <span>View on Blockchain</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementSBTCard;
