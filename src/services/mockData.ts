
export interface MockMarketData {
  id: string;
  contractAddress: string;
  borrower: {
    name: string;
    githubHandle: string;
    avatar: string;
    trustScore: number;
    trustBreakdown: { github: number; codeQuality: number; community: number; onChain: number };
  };
  project: {
    title: string;
    description: string;
    tags: string[];
    githubRepo?: string;
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

// Mock data untuk marketplace
export const mockMarkets: MockMarketData[] = [
  {
    id: "market-1",
    contractAddress: "0x1234567890123456789012345678901234567890",
    borrower: {
      name: "Alex Rodriguez",
      githubHandle: "@alexcoder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      trustScore: 88,
      trustBreakdown: { github: 35, codeQuality: 28, community: 20, onChain: 5 }
    },
    project: {
      title: "DeFi Portfolio Tracker",
      description: "Advanced portfolio tracking system for DeFi investments with real-time analytics and yield optimization.",
      tags: ["DeFi", "Analytics", "TypeScript", "React"],
      githubRepo: "https://github.com/alexcoder/defi-tracker"
    },
    loan: {
      amount: 50000,
      interestRate: 12.5,
      tenor: "12 months",
      tenorDays: 365,
      funded: 75,
      target: 50000,
      status: 'funding',
      timeLeft: "25 days",
    }
  },
  {
    id: "market-2",
    contractAddress: "0x2345678901234567890123456789012345678901",
    borrower: {
      name: "Sarah Chen",
      githubHandle: "@sarahdev",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332db29?w=50&h=50&fit=crop&crop=face",
      trustScore: 92,
      trustBreakdown: { github: 42, codeQuality: 32, community: 15, onChain: 3 }
    },
    project: {
      title: "AI Code Review Bot",
      description: "Intelligent code review automation using machine learning to improve code quality and development workflow.",
      tags: ["AI", "DevTools", "Python", "Machine Learning"],
      githubRepo: "https://github.com/sarahdev/ai-code-review"
    },
    loan: {
      amount: 35000,
      interestRate: 10.8,
      tenor: "8 months",
      tenorDays: 240,
      funded: 100,
      target: 35000,
      status: 'active',
      startDate: "2 weeks ago",
      dueDate: "6 months"
    }
  },
  {
    id: "market-3",
    contractAddress: "0x3456789012345678901234567890123456789012",
    borrower: {
      name: "Mike Johnson",
      githubHandle: "@mikej",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      trustScore: 85,
      trustBreakdown: { github: 38, codeQuality: 25, community: 18, onChain: 4 }
    },
    project: {
      title: "Decentralized Storage SDK",
      description: "Easy-to-use SDK for integrating decentralized storage solutions into web applications.",
      tags: ["Web3", "Storage", "SDK", "JavaScript"],
      githubRepo: "https://github.com/mikej/storage-sdk"
    },
    loan: {
      amount: 25000,
      interestRate: 11.2,
      tenor: "6 months",
      tenorDays: 180,
      funded: 45,
      target: 25000,
      status: 'funding',
      timeLeft: "18 days"
    }
  },
  {
    id: "market-4",
    contractAddress: "0x4567890123456789012345678901234567890123",
    borrower: {
      name: "Emma Wilson",
      githubHandle: "@emmaw",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      trustScore: 90,
      trustBreakdown: { github: 40, codeQuality: 30, community: 17, onChain: 3 }
    },
    project: {
      title: "NFT Marketplace Framework",
      description: "Complete framework for building custom NFT marketplaces with advanced features and scalability.",
      tags: ["NFT", "Marketplace", "Solidity", "React"],
      githubRepo: "https://github.com/emmaw/nft-marketplace"
    },
    loan: {
      amount: 60000,
      interestRate: 13.0,
      tenor: "10 months",
      tenorDays: 300,
      funded: 30,
      target: 60000,
      status: 'funding',
      timeLeft: "35 days"
    }
  },
  {
    id: "market-5",
    contractAddress: "0x5678901234567890123456789012345678901234",
    borrower: {
      name: "David Park",
      githubHandle: "@davidp",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
      trustScore: 78,
      trustBreakdown: { github: 32, codeQuality: 22, community: 20, onChain: 4 }
    },
    project: {
      title: "Cross-Chain Bridge Protocol",
      description: "Secure and efficient bridge protocol for seamless asset transfers between different blockchains.",
      tags: ["Bridge", "Cross-Chain", "Solidity", "Security"],
      githubRepo: "https://github.com/davidp/cross-chain-bridge"
    },
    loan: {
      amount: 45000,
      interestRate: 14.5,
      tenor: "9 months",
      tenorDays: 270,
      funded: 65,
      target: 45000,
      status: 'funding',
      timeLeft: "12 days"
    }
  },
  {
    id: "market-6",
    contractAddress: "0x6789012345678901234567890123456789012345",
    borrower: {
      name: "Lisa Wang",
      githubHandle: "@lisaw",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face",
      trustScore: 95,
      trustBreakdown: { github: 45, codeQuality: 35, community: 12, onChain: 3 }
    },
    project: {
      title: "DAO Governance Platform",
      description: "Advanced governance platform for DAOs with voting mechanisms, proposal management, and treasury controls.",
      tags: ["DAO", "Governance", "Voting", "Web3"],
      githubRepo: "https://github.com/lisaw/dao-governance"
    },
    loan: {
      amount: 80000,
      interestRate: 9.5,
      tenor: "15 months",
      tenorDays: 450,
      funded: 100,
      target: 80000,
      status: 'repaid',
      startDate: "8 months ago",
      dueDate: "Completed"
    }
  }
];

// Mock service untuk mendapatkan data market
export const mockMarketService = {
  // Simulasi delay network
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get all markets
  getAllMarkets: async (): Promise<MockMarketData[]> => {
    await mockMarketService.delay(800); // Simulasi loading
    return mockMarkets;
  },

  // Get market by ID
  getMarketById: async (id: string): Promise<MockMarketData | null> => {
    await mockMarketService.delay(300);
    return mockMarkets.find(market => market.id === id) || null;
  },

  // Filter markets
  filterMarkets: async (filters: {
    query?: string;
    minAmount?: number;
    maxAmount?: number;
    minTrustScore?: number;
    status?: string[];
    sectors?: string[];
  }): Promise<MockMarketData[]> => {
    await mockMarketService.delay(400);
    
    return mockMarkets.filter(market => {
      let matches = true;
      
      if (filters.query) {
        const query = filters.query.toLowerCase();
        matches = matches && (
          market.borrower.name.toLowerCase().includes(query) ||
          market.project.title.toLowerCase().includes(query) ||
          market.project.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      if (filters.minAmount) {
        matches = matches && market.loan.amount >= filters.minAmount;
      }
      
      if (filters.maxAmount) {
        matches = matches && market.loan.amount <= filters.maxAmount;
      }
      
      if (filters.minTrustScore) {
        matches = matches && market.borrower.trustScore >= filters.minTrustScore;
      }
      
      if (filters.status && filters.status.length > 0) {
        matches = matches && filters.status.includes(market.loan.status);
      }
      
      if (filters.sectors && filters.sectors.length > 0) {
        matches = matches && filters.sectors.some(sector => 
          market.project.tags.includes(sector)
        );
      }
      
      return matches;
    });
  },

  // Simulasi investment action
  investInMarket: async (marketId: string, amount: number): Promise<{ success: boolean; message: string }> => {
    await mockMarketService.delay(1500);
    
    // Simulasi sukses/gagal random untuk demo
    const success = Math.random() > 0.1; // 90% chance success
    
    if (success) {
      // Update funded amount di mock data
      const market = mockMarkets.find(m => m.id === marketId);
      if (market) {
        const newFunded = Math.min(100, market.loan.funded + (amount / market.loan.target * 100));
        market.loan.funded = newFunded;
        if (newFunded >= 100) {
          market.loan.status = 'active';
          market.loan.startDate = 'Just now';
          market.loan.dueDate = `${market.loan.tenorDays} days`;
        }
      }
      
      return {
        success: true,
        message: `Successfully invested $${amount.toLocaleString()} in ${market?.project.title}!`
      };
    } else {
      return {
        success: false,
        message: "Investment failed. Please try again."
      };
    }
  }
};

// Market stats dari mock data
export const getMarketStats = () => {
  const totalRequested = mockMarkets.reduce((sum, market) => sum + market.loan.amount, 0);
  const avgInterestRate = mockMarkets.reduce((sum, market) => sum + market.loan.interestRate, 0) / mockMarkets.length;
  const successRate = Math.round((mockMarkets.filter(m => m.loan.status === 'repaid').length / mockMarkets.length) * 100);
  
  return {
    totalRequested,
    avgInterestRate,
    successRate,
    activeMarkets: mockMarkets.length,
    fundingMarkets: mockMarkets.filter(m => m.loan.status === 'funding').length
  };
};
