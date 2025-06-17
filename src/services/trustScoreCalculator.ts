
import { DeveloperProfile, GitHubMetrics, TrustScoreBreakdown } from '@/types/developer';

export class TrustScoreCalculator {
  // Trust score weights matching smart contract
  private static readonly WEIGHTS = {
    GITHUB: 0.30,
    LOAN_HISTORY: 0.40,
    PROJECT_HISTORY: 0.20,
    TIME_FACTOR: 0.10,
    VERIFICATION_BONUS: 100,
    BASE_SCORE: 100
  };

  static calculateTrustScore(
    profile: DeveloperProfile,
    githubMetrics: GitHubMetrics
  ): TrustScoreBreakdown {
    const githubScore = this.calculateGitHubScore(githubMetrics);
    const loanHistoryScore = this.calculateLoanHistoryScore(profile);
    const projectHistoryScore = this.calculateProjectHistoryScore(profile);
    const timeFactorScore = this.calculateTimeFactorScore(githubMetrics.accountAge);
    const verificationBonus = profile.isVerified ? this.WEIGHTS.VERIFICATION_BONUS : 0;

    const weightedScore = 
      (githubScore * this.WEIGHTS.GITHUB) +
      (loanHistoryScore * this.WEIGHTS.LOAN_HISTORY) +
      (projectHistoryScore * this.WEIGHTS.PROJECT_HISTORY) +
      (timeFactorScore * this.WEIGHTS.TIME_FACTOR);

    const totalScore = Math.max(50, this.WEIGHTS.BASE_SCORE + weightedScore + verificationBonus);

    return {
      githubScore,
      loanHistoryScore,
      projectHistoryScore,
      timeFactorScore,
      communityScore: githubScore * 0.3, // Derived from GitHub metrics
      onChainScore: loanHistoryScore * 0.5, // Derived from loan history
      verificationBonus,
      totalScore: Math.min(1000, totalScore) // Cap at 1000
    };
  }

  private static calculateGitHubScore(metrics: GitHubMetrics): number {
    let score = 0;

    // Repository quality score (0-50)
    score += Math.min(50, metrics.repositories * 2);
    
    // Star score (0-100)
    score += Math.min(100, metrics.stars * 0.1);
    
    // Follower score (0-50)
    score += Math.min(50, metrics.followers * 0.2);
    
    // Contribution activity (0-100)
    score += Math.min(100, metrics.contributions * 0.1);

    return Math.min(200, score); // Max 200 points
  }

  private static calculateLoanHistoryScore(profile: DeveloperProfile): number {
    if (profile.successfulLoans + profile.defaultedLoans === 0) {
      return 0; // No loan history
    }

    const successRate = profile.successfulLoans / (profile.successfulLoans + profile.defaultedLoans);
    const loanCount = profile.successfulLoans + profile.defaultedLoans;
    
    // Base score from success rate (0-200)
    let score = successRate * 200;
    
    // Bonus for multiple successful loans (0-100)
    score += Math.min(100, profile.successfulLoans * 10);
    
    // Penalty for defaults
    score -= profile.defaultedLoans * 20;

    return Math.max(0, Math.min(300, score)); // 0-300 range
  }

  private static calculateProjectHistoryScore(profile: DeveloperProfile): number {
    // Base score from completed projects
    let score = Math.min(150, profile.completedProjects * 15);
    
    // Bonus for consistency (projects completed vs loans taken)
    if (profile.successfulLoans > 0) {
      const consistency = profile.completedProjects / profile.successfulLoans;
      score += Math.min(50, consistency * 25);
    }

    return Math.min(200, score); // Max 200 points
  }

  private static calculateTimeFactorScore(accountAge: number): number {
    // Account age in years, max benefit at 5+ years
    return Math.min(100, accountAge * 20);
  }

  static getRiskCategory(trustScore: number): 'low' | 'medium' | 'high' {
    if (trustScore >= 750) return 'low';
    if (trustScore >= 500) return 'medium';
    return 'high';
  }

  static getRecommendedInterestRate(trustScore: number, baseRate: number): number {
    const riskMultiplier = this.getRiskMultiplier(trustScore);
    return baseRate * riskMultiplier;
  }

  private static getRiskMultiplier(trustScore: number): number {
    if (trustScore >= 800) return 1.0;  // Best rates
    if (trustScore >= 700) return 1.1;
    if (trustScore >= 600) return 1.25;
    if (trustScore >= 500) return 1.5;
    if (trustScore >= 400) return 1.75;
    return 2.0; // Highest risk premium
  }
}
