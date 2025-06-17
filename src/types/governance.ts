
// Governance and admin types
export interface GovernanceProposal {
  id: string;
  proposer: string;
  title: string;
  description: string;
  category: 'parameter' | 'upgrade' | 'emergency' | 'treasury';
  status: 'pending' | 'active' | 'executed' | 'rejected' | 'expired';
  createdAt: number;
  executionTime?: number;
  requiredConfirmations: number;
  currentConfirmations: number;
  confirmations: ProposalConfirmation[];
  parameters: ParameterChange[];
}

export interface ProposalConfirmation {
  governor: string;
  timestamp: number;
  txHash: string;
}

export interface ParameterChange {
  contract: string;
  parameter: string;
  currentValue: any;
  newValue: any;
  impact: string;
}

export interface PlatformStats {
  totalValueLocked: number;
  totalMarkets: number;
  totalDevelopers: number;
  totalLenders: number;
  averageInterestRate: number;
  successRate: number;
  totalVolumeTraded: number;
  treasuryBalance: number;
}
