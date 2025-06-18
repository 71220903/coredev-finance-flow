
import { DeveloperProfile } from './developer';

// Market types matching the smart contract structure
export interface LoanMarket {
  id: string;
  contractAddress: string;
  borrower: string;
  loanAmount: number;
  interestRateBps: number;
  tenorSeconds: number;
  totalDeposited: number;
  currentState: MarketState;
  projectDataCID: string;
  createdAt: number;
  fundingDeadline: number;
  
  // Enhanced fields
  riskScore: number;
  suggestedInterestRate: number;
  minimumStake: number;
  actualStaked: number;
  marketConditions: MarketConditions;
  
  // Related data
  borrowerProfile: DeveloperProfile;
  projectData: ProjectData;
  riskAssessment: RiskAssessment;
  stakingInfo: StakingInfo;

  // Legacy compatibility fields (if LoanMarketCard expects these)
  project?: ProjectData;
  loan?: {
    amount: number;
    interestRate: number;
    tenor: number;
    state: number;
  };
}

export enum MarketState {
  FUNDING = 0,
  ACTIVE = 1,
  REPAID = 2,
  DEFAULTED = 3,
  CANCELLED = 4
}

export interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  githubRepo: string;
  demoUrl?: string;
  documentation?: string;
  roadmap: ProjectMilestone[];
  team: TeamMember[];
  tokenomics?: TokenomicsData;
}

export interface TokenomicsData {
  totalSupply: number;
  tokenSymbol: string;
  distribution: TokenDistribution[];
  vestingSchedule?: VestingSchedule[];
}

export interface TokenDistribution {
  category: string;
  percentage: number;
  amount: number;
  description: string;
}

export interface VestingSchedule {
  beneficiary: string;
  amount: number;
  startDate: number;
  duration: number;
  cliffPeriod: number;
}

export interface ProjectMilestone {
  title: string;
  description: string;
  targetDate: number;
  completed: boolean;
  completedDate?: number;
}

export interface TeamMember {
  name: string;
  role: string;
  githubHandle: string;
  experience: string;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  factors: RiskFactor[];
  aiInsights: string[];
  recommendedActions: string[];
  lastUpdated: number;
}

export interface RiskFactor {
  category: 'credit' | 'market' | 'technical' | 'liquidity';
  factor: string;
  impact: 'low' | 'medium' | 'high';
  weight: number;
  value: number;
  description: string;
}

export interface MarketConditions {
  baseRate: number;
  riskPremium: number;
  liquidityMultiplier: number;
  marketVolatility: number;
  demandSupplyRatio: number;
  lastUpdated: number;
}

export interface StakingInfo {
  requiredStake: number;
  actualStaked: number;
  stakingRatio: number;
  lockedUntil: number;
  slashingRisk: number;
  rewards: number;
}
