
// Developer profile types matching the smart contract structure
export interface DeveloperProfile {
  address: string;
  githubHandle: string;
  profileDataCID: string;
  trustScore: number;
  completedProjects: number;
  successfulLoans: number;
  defaultedLoans: number;
  totalBorrowed: number;
  totalRepaid: number;
  isVerified: boolean;
  isActive: boolean;
  verificationTimestamp: number;
  lastActivityTimestamp: number;
  
  // Additional computed fields
  successRate: number;
  averageLoanSize: number;
  riskCategory: 'low' | 'medium' | 'high';
}

export interface GitHubMetrics {
  repositories: number;
  stars: number;
  followers: number;
  following: number;
  commits: number;
  contributions: number;
  accountAge: number; // in years
  languages: string[];
  topRepositories: GitHubRepository[];
}

export interface GitHubRepository {
  name: string;
  stars: number;
  forks: number;
  language: string;
  description: string;
  url: string;
}

export interface TrustScoreBreakdown {
  githubScore: number;
  loanHistoryScore: number;
  projectHistoryScore: number;
  timeFactorScore: number;
  communityScore: number;
  onChainScore: number;
  verificationBonus: number;
  totalScore: number;
}

export interface VerificationStatus {
  githubVerified: boolean;
  profileVerified: boolean;
  identityVerified: boolean;
  lastVerificationDate: number;
  verificationLevel: 'unverified' | 'basic' | 'enhanced' | 'premium';
}
