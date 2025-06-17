
// NFT and marketplace types
export interface LoanPositionNFT {
  tokenId: string;
  marketAddress: string;
  lender: string;
  principal: number;
  expectedReturn: number;
  maturityDate: number;
  currentValue: number;
  transferable: boolean;
  metadata: NFTMetadata;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  externalUrl?: string;
}

export interface NFTAttribute {
  traitType: string;
  value: string | number;
  displayType?: 'number' | 'date' | 'boost_percentage' | 'boost_number';
}

export interface MarketplaceListing {
  id: string;
  tokenId: string;
  seller: string;
  listingType: 'fixed_price' | 'auction';
  price: number;
  startTime: number;
  endTime?: number;
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  bids?: AuctionBid[];
}

export interface AuctionBid {
  bidder: string;
  amount: number;
  timestamp: number;
  txHash: string;
}

export interface ReputationSBT {
  tokenId: string;
  owner: string;
  achievementType: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: number;
  metadata: NFTMetadata;
}
