import { LoanMarket, MarketState, MarketConditions, RiskAssessment, TokenomicsData } from '@/types/market';
import { DeveloperProfile, GitHubMetrics, TrustScoreBreakdown } from '@/types/developer';
import { TrustScoreCalculator } from './trustScoreCalculator';

// Enhanced mock data service with smart contract structure
export class EnhancedMockDataService {
  private static readonly BASE_INTEREST_RATE = 8.0; // 8% base rate

  static generateEnhancedMarkets(): LoanMarket[] {
    const developers = this.generateDeveloperProfiles();
    const markets: LoanMarket[] = [];

    developers.forEach((developer, index) => {
      const githubMetrics = this.generateGitHubMetrics(developer);
      const trustScoreBreakdown = TrustScoreCalculator.calculateTrustScore(developer, githubMetrics);
      
      // Update developer with calculated trust score
      developer.trustScore = trustScoreBreakdown.totalScore;
      developer.riskCategory = TrustScoreCalculator.getRiskCategory(developer.trustScore);

      const market = this.createMarketForDeveloper(developer, index);
      markets.push(market);
    });

    return markets;
  }

  private static generateDeveloperProfiles(): DeveloperProfile[] {
    return [
      {
        address: "0x1234567890123456789012345678901234567890",
        githubHandle: "alexcoder",
        profileDataCID: "QmAlexProfileCID123",
        trustScore: 0, // Will be calculated
        completedProjects: 15,
        successfulLoans: 3,
        defaultedLoans: 0,
        totalBorrowed: 125000,
        totalRepaid: 125000,
        isVerified: true,
        isActive: true,
        verificationTimestamp: Date.now() - 86400000 * 30, // 30 days ago
        lastActivityTimestamp: Date.now() - 86400000 * 2, // 2 days ago
        successRate: 100,
        averageLoanSize: 41666,
        riskCategory: 'low'
      },
      {
        address: "0x2345678901234567890123456789012345678901",
        githubHandle: "sarahdev",
        profileDataCID: "QmSarahProfileCID456",
        trustScore: 0,
        completedProjects: 22,
        successfulLoans: 5,
        defaultedLoans: 1,
        totalBorrowed: 200000,
        totalRepaid: 180000,
        isVerified: true,
        isActive: true,
        verificationTimestamp: Date.now() - 86400000 * 45,
        lastActivityTimestamp: Date.now() - 86400000 * 1,
        successRate: 83.33,
        averageLoanSize: 33333,
        riskCategory: 'medium'
      },
      {
        address: "0x3456789012345678901234567890123456789012",
        githubHandle: "mikej",
        profileDataCID: "QmMikeProfileCID789",
        trustScore: 0,
        completedProjects: 8,
        successfulLoans: 1,
        defaultedLoans: 0,
        totalBorrowed: 25000,
        totalRepaid: 25000,
        isVerified: false,
        isActive: true,
        verificationTimestamp: 0,
        lastActivityTimestamp: Date.now() - 86400000 * 5,
        successRate: 100,
        averageLoanSize: 25000,
        riskCategory: 'medium'
      }
    ];
  }

  private static generateGitHubMetrics(developer: DeveloperProfile): GitHubMetrics {
    // Generate realistic GitHub metrics based on profile
    const baseMetrics = {
      alexcoder: { repos: 42, stars: 1230, followers: 450, commits: 2500, age: 5.2 },
      sarahdev: { repos: 35, stars: 890, followers: 380, commits: 3200, age: 4.8 },
      mikej: { repos: 28, stars: 560, followers: 220, commits: 1800, age: 3.5 }
    };

    const metrics = baseMetrics[developer.githubHandle as keyof typeof baseMetrics] || baseMetrics.mikej;

    return {
      repositories: metrics.repos,
      stars: metrics.stars,
      followers: metrics.followers,
      following: Math.floor(metrics.followers * 0.3),
      commits: metrics.commits,
      contributions: Math.floor(metrics.commits * 1.2),
      accountAge: metrics.age,
      languages: ["TypeScript", "Solidity", "Python", "JavaScript", "Rust"],
      topRepositories: [
        {
          name: "defi-portfolio-tracker",
          stars: Math.floor(metrics.stars * 0.3),
          forks: Math.floor(metrics.stars * 0.1),
          language: "TypeScript",
          description: "Advanced portfolio tracking for DeFi investments",
          url: `https://github.com/${developer.githubHandle}/defi-portfolio-tracker`
        }
      ]
    };
  }

  private static createMarketForDeveloper(developer: DeveloperProfile, index: number): LoanMarket {
    const loanAmounts = [50000, 35000, 25000, 60000, 45000, 80000];
    const tenors = [365, 240, 180, 300, 270, 450]; // days in seconds * 86400
    
    const loanAmount = loanAmounts[index] || 30000;
    const tenorDays = tenors[index] || 180;
    
    const riskAssessment = this.generateRiskAssessment(developer);
    const marketConditions = this.generateMarketConditions();
    
    const suggestedRate = TrustScoreCalculator.getRecommendedInterestRate(
      developer.trustScore,
      this.BASE_INTEREST_RATE
    );

    const projectData = this.generateProjectData(index);

    const market: LoanMarket = {
      id: `market-${index + 1}`,
      contractAddress: `0x${(1000000000000000000000000000000000000000 + index).toString(16)}`,
      borrower: developer.address,
      loanAmount,
      interestRateBps: Math.floor(suggestedRate * 100), // Convert to basis points
      tenorSeconds: tenorDays * 86400,
      totalDeposited: loanAmount * (0.3 + Math.random() * 0.7), // 30-100% funded
      currentState: index < 2 ? MarketState.FUNDING : index < 4 ? MarketState.ACTIVE : MarketState.REPAID,
      projectDataCID: `QmProject${index}CID`,
      createdAt: Date.now() - Math.random() * 86400000 * 30,
      fundingDeadline: Date.now() + 86400000 * (30 - Math.random() * 25),
      riskScore: riskAssessment.riskScore,
      suggestedInterestRate: suggestedRate,
      minimumStake: loanAmount * 0.1, // 10% minimum stake
      actualStaked: loanAmount * (0.1 + Math.random() * 0.05), // 10-15% staked
      marketConditions,
      borrowerProfile: developer,
      projectData,
      riskAssessment,
      stakingInfo: {
        requiredStake: loanAmount * 0.1,
        actualStaked: loanAmount * 0.12,
        stakingRatio: 1.2,
        lockedUntil: Date.now() + tenorDays * 86400000,
        slashingRisk: 0.15,
        rewards: loanAmount * 0.02
      },
      // Legacy compatibility fields
      project: projectData,
      loan: {
        amount: loanAmount,
        interestRate: suggestedRate,
        tenor: tenorDays,
        state: index < 2 ? MarketState.FUNDING : index < 4 ? MarketState.ACTIVE : MarketState.REPAID
      }
    };

    return market;
  }

  private static generateRiskAssessment(developer: DeveloperProfile): RiskAssessment {
    const riskScore = Math.max(10, 100 - (developer.trustScore - 400) / 6);
    
    return {
      overallRisk: riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high',
      riskScore,
      factors: [
        {
          category: 'credit',
          factor: 'Trust Score',
          impact: developer.trustScore > 700 ? 'low' : 'medium',
          weight: 0.4,
          value: developer.trustScore,
          description: 'Developer trust score based on GitHub and loan history'
        },
        {
          category: 'market',
          factor: 'Market Volatility',
          impact: 'medium',
          weight: 0.2,
          value: 65,
          description: 'Current market volatility affecting lending rates'
        }
      ],
      aiInsights: [
        "Strong GitHub activity indicates technical competence",
        "Successful loan history demonstrates reliability",
        "Active community engagement shows commitment"
      ],
      recommendedActions: [
        "Consider increasing stake ratio for better terms",
        "Complete profile verification for trust bonus",
        "Maintain regular GitHub activity"
      ],
      lastUpdated: Date.now()
    };
  }

  private static generateMarketConditions(): MarketConditions {
    return {
      baseRate: this.BASE_INTEREST_RATE,
      riskPremium: 2.5,
      liquidityMultiplier: 1.1,
      marketVolatility: 0.25,
      demandSupplyRatio: 1.3,
      lastUpdated: Date.now()
    };
  }

  private static generateProjectData(index: number) {
    const projects = [
      {
        title: "DeFi Portfolio Tracker",
        description: "Advanced portfolio tracking system for DeFi investments with real-time analytics and yield optimization.",
        tags: ["DeFi", "Analytics", "TypeScript", "React"],
        githubRepo: "https://github.com/alexcoder/defi-tracker"
      },
      {
        title: "AI Code Review Bot",
        description: "Intelligent code review automation using machine learning to improve code quality and development workflow.",
        tags: ["AI", "DevTools", "Python", "Machine Learning"],
        githubRepo: "https://github.com/sarahdev/ai-code-review"
      },
      {
        title: "Decentralized Storage SDK",
        description: "Easy-to-use SDK for integrating decentralized storage solutions into web applications.",
        tags: ["Web3", "Storage", "SDK", "JavaScript"],
        githubRepo: "https://github.com/mikej/storage-sdk"
      }
    ];

    const project = projects[index] || projects[0];
    
    const tokenomics: TokenomicsData = {
      totalSupply: 1000000,
      tokenSymbol: `${project.title.charAt(0)}${project.title.split(' ')[1]?.charAt(0) || 'T'}`,
      distribution: [
        { category: "Team", percentage: 20, amount: 200000, description: "Team allocation with vesting" },
        { category: "Public Sale", percentage: 40, amount: 400000, description: "Public token sale" },
        { category: "Development", percentage: 30, amount: 300000, description: "Development fund" },
        { category: "Reserve", percentage: 10, amount: 100000, description: "Emergency reserve" }
      ]
    };
    
    return {
      ...project,
      demoUrl: `https://demo.${project.title.toLowerCase().replace(/\s+/g, '-')}.com`,
      documentation: `https://docs.${project.title.toLowerCase().replace(/\s+/g, '-')}.com`,
      roadmap: [
        {
          title: "MVP Development",
          description: "Core functionality implementation",
          targetDate: Date.now() + 86400000 * 30,
          completed: true,
          completedDate: Date.now() - 86400000 * 60
        },
        {
          title: "Beta Testing",
          description: "Community beta testing and feedback integration",
          targetDate: Date.now() + 86400000 * 60,
          completed: false
        }
      ],
      team: [
        {
          name: project.title.includes("AI") ? "Sarah Chen" : "Alex Rodriguez",
          role: "Lead Developer",
          githubHandle: project.githubRepo.split('/')[3],
          experience: "5+ years in Web3 development"
        }
      ],
      tokenomics
    };
  }
}
