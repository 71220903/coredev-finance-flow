
import { DeveloperProfile, GitHubMetrics } from '@/types/developer';
import { GitHubAPIResponse } from './githubApi';

export interface ComprehensiveTrustScore {
  totalScore: number;
  factors: {
    githubActivity: TrustFactor;
    codeQuality: TrustFactor;
    communityEngagement: TrustFactor;
    projectComplexity: TrustFactor;
    consistencyReliability: TrustFactor;
    securityPractices: TrustFactor;
    onChainHistory: TrustFactor;
    verificationStatus: TrustFactor;
  };
  riskCategory: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  lastUpdated: number;
}

export interface TrustFactor {
  score: number;
  maxScore: number;
  weight: number;
  description: string;
  evidence: string[];
  improvements: string[];
}

export class EnhancedTrustScoreCalculator {
  private static readonly WEIGHTS = {
    GITHUB_ACTIVITY: 0.20,      // 20%
    CODE_QUALITY: 0.18,         // 18%
    COMMUNITY_ENGAGEMENT: 0.15, // 15%
    PROJECT_COMPLEXITY: 0.12,   // 12%
    CONSISTENCY: 0.10,          // 10%
    SECURITY: 0.10,             // 10%
    ONCHAIN_HISTORY: 0.10,      // 10%
    VERIFICATION: 0.05          // 5%
  };

  static calculateComprehensiveTrustScore(
    profile: DeveloperProfile,
    githubData: GitHubAPIResponse,
    verificationStatus: any
  ): ComprehensiveTrustScore {
    
    const factors = {
      githubActivity: this.calculateGitHubActivity(githubData),
      codeQuality: this.calculateCodeQuality(githubData),
      communityEngagement: this.calculateCommunityEngagement(githubData),
      projectComplexity: this.calculateProjectComplexity(githubData),
      consistencyReliability: this.calculateConsistency(profile, githubData),
      securityPractices: this.calculateSecurityPractices(githubData),
      onChainHistory: this.calculateOnChainHistory(profile),
      verificationStatus: this.calculateVerificationScore(verificationStatus)
    };

    const totalScore = this.calculateWeightedScore(factors);
    const riskCategory = this.determineRiskCategory(totalScore);
    const recommendations = this.generateRecommendations(factors, totalScore);

    return {
      totalScore,
      factors,
      riskCategory,
      recommendations,
      lastUpdated: Date.now()
    };
  }

  private static calculateGitHubActivity(githubData: GitHubAPIResponse): TrustFactor {
    const { user, repos, events } = githubData;
    
    // Calculate activity metrics
    const accountAge = this.getAccountAgeInYears(user.created_at);
    const recentActivity = events.filter(e => 
      new Date(e.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    
    const avgStarsPerRepo = repos.length > 0 ? 
      repos.reduce((sum, repo) => sum + repo.stargazers_count, 0) / repos.length : 0;

    let score = 0;
    const evidence = [];
    
    // Account age (0-25 points)
    if (accountAge >= 3) {
      score += 25;
      evidence.push(`GitHub account ${accountAge.toFixed(1)} years old`);
    } else if (accountAge >= 1) {
      score += 15;
      evidence.push(`GitHub account ${accountAge.toFixed(1)} years old`);
    } else {
      score += 5;
      evidence.push(`New GitHub account (${accountAge.toFixed(1)} years)`);
    }

    // Repository count (0-25 points)
    if (user.public_repos >= 20) {
      score += 25;
      evidence.push(`${user.public_repos} public repositories`);
    } else if (user.public_repos >= 10) {
      score += 15;
      evidence.push(`${user.public_repos} public repositories`);
    } else {
      score += Math.max(5, user.public_repos);
      evidence.push(`${user.public_repos} public repositories`);
    }

    // Recent activity (0-25 points)
    if (recentActivity >= 20) {
      score += 25;
      evidence.push(`${recentActivity} recent activities this month`);
    } else if (recentActivity >= 10) {
      score += 15;
      evidence.push(`${recentActivity} recent activities this month`);
    } else {
      score += Math.max(5, recentActivity);
      evidence.push(`${recentActivity} recent activities this month`);
    }

    // Community recognition (0-25 points)
    if (avgStarsPerRepo >= 50) {
      score += 25;
      evidence.push(`High community recognition (avg ${avgStarsPerRepo.toFixed(1)} stars/repo)`);
    } else if (avgStarsPerRepo >= 10) {
      score += 15;
      evidence.push(`Good community recognition (avg ${avgStarsPerRepo.toFixed(1)} stars/repo)`);
    } else {
      score += Math.max(5, avgStarsPerRepo);
      evidence.push(`Avg ${avgStarsPerRepo.toFixed(1)} stars per repository`);
    }

    return {
      score: Math.min(100, score),
      maxScore: 100,
      weight: this.WEIGHTS.GITHUB_ACTIVITY,
      description: 'GitHub account activity and community engagement',
      evidence,
      improvements: score < 80 ? [
        'Increase repository activity',
        'Contribute to open source projects',
        'Maintain consistent commit schedule'
      ] : []
    };
  }

  private static calculateCodeQuality(githubData: GitHubAPIResponse): TrustFactor {
    const { repos } = githubData;
    
    let score = 0;
    const evidence = [];
    
    // Language diversity (0-30 points)
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
    const languageScore = Math.min(30, languages.length * 5);
    score += languageScore;
    evidence.push(`Proficient in ${languages.length} programming languages`);

    // Repository quality indicators (0-40 points)
    const qualityRepos = repos.filter(repo => 
      repo.stargazers_count > 5 && 
      repo.description && 
      repo.description.length > 20
    );
    const qualityScore = Math.min(40, qualityRepos.length * 8);
    score += qualityScore;
    evidence.push(`${qualityRepos.length} high-quality repositories with documentation`);

    // Project maintenance (0-30 points)
    const recentlyUpdated = repos.filter(repo => 
      new Date(repo.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    );
    const maintenanceScore = Math.min(30, (recentlyUpdated.length / Math.max(1, repos.length)) * 30);
    score += maintenanceScore;
    evidence.push(`${Math.round((recentlyUpdated.length / Math.max(1, repos.length)) * 100)}% of repositories recently updated`);

    return {
      score: Math.min(100, score),
      maxScore: 100,
      weight: this.WEIGHTS.CODE_QUALITY,
      description: 'Code quality, documentation, and project maintenance',
      evidence,
      improvements: score < 80 ? [
        'Add comprehensive documentation to repositories',
        'Maintain consistent code quality standards',
        'Keep projects actively updated'
      ] : []
    };
  }

  private static calculateCommunityEngagement(githubData: GitHubAPIResponse): TrustFactor {
    const { user } = githubData;
    
    let score = 0;
    const evidence = [];

    // Followers (0-40 points)
    if (user.followers >= 500) {
      score += 40;
      evidence.push(`${user.followers} GitHub followers`);
    } else if (user.followers >= 100) {
      score += 30;
      evidence.push(`${user.followers} GitHub followers`);
    } else if (user.followers >= 50) {
      score += 20;
      evidence.push(`${user.followers} GitHub followers`);
    } else {
      score += Math.min(15, user.followers / 2);
      evidence.push(`${user.followers} GitHub followers`);
    }

    // Following ratio (0-30 points)
    const followRatio = user.followers / Math.max(1, user.following);
    if (followRatio >= 2) {
      score += 30;
      evidence.push('Strong follower-to-following ratio');
    } else if (followRatio >= 1) {
      score += 20;
      evidence.push('Balanced follower-to-following ratio');
    } else {
      score += 10;
      evidence.push('Building community presence');
    }

    // Profile completeness (0-30 points)
    let profileScore = 0;
    if (user.bio) profileScore += 10;
    if (user.blog) profileScore += 10;
    if (user.location) profileScore += 5;
    if (user.company) profileScore += 5;
    score += profileScore;
    evidence.push(`Complete profile with ${profileScore}/30 profile elements`);

    return {
      score: Math.min(100, score),
      maxScore: 100,
      weight: this.WEIGHTS.COMMUNITY_ENGAGEMENT,
      description: 'Community engagement and professional presence',
      evidence,
      improvements: score < 80 ? [
        'Build stronger community presence',
        'Complete GitHub profile information',
        'Engage more with the developer community'
      ] : []
    };
  }

  private static calculateProjectComplexity(githubData: GitHubAPIResponse): TrustFactor {
    const { repos } = githubData;
    
    let score = 0;
    const evidence = [];

    // Repository size and complexity (0-50 points)
    const avgSize = repos.length > 0 ? repos.reduce((sum, repo) => sum + repo.size, 0) / repos.length : 0;
    const complexityScore = Math.min(50, avgSize / 1000);
    score += complexityScore;
    evidence.push(`Average repository size: ${(avgSize / 1000).toFixed(1)}MB`);

    // Technical diversity (0-25 points)
    const webTechs = repos.filter(r => ['TypeScript', 'JavaScript', 'React'].includes(r.language || ''));
    const blockchainTechs = repos.filter(r => ['Solidity', 'Rust', 'Go'].includes(r.language || ''));
    const backendTechs = repos.filter(r => ['Python', 'Java', 'C++'].includes(r.language || ''));
    
    const diversityScore = Math.min(25, (webTechs.length > 0 ? 8 : 0) + 
                                        (blockchainTechs.length > 0 ? 12 : 0) + 
                                        (backendTechs.length > 0 ? 5 : 0));
    score += diversityScore;
    evidence.push(`Technical stack diversity across ${repos.length} repositories`);

    // Fork activity (0-25 points)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const forkScore = Math.min(25, totalForks / 10);
    score += forkScore;
    evidence.push(`${totalForks} total forks across all repositories`);

    return {
      score: Math.min(100, score),
      maxScore: 100,
      weight: this.WEIGHTS.PROJECT_COMPLEXITY,
      description: 'Technical complexity and project sophistication',
      evidence,
      improvements: score < 80 ? [
        'Work on more complex projects',
        'Diversify technical skill set',
        'Create projects that inspire community contributions'
      ] : []
    };
  }

  private static calculateConsistency(profile: DeveloperProfile, githubData: GitHubAPIResponse): TrustFactor {
    let score = 0;
    const evidence = [];

    // Loan repayment history (0-60 points)
    if (profile.successfulLoans + profile.defaultedLoans > 0) {
      const successRate = profile.successfulLoans / (profile.successfulLoans + profile.defaultedLoans);
      const consistencyScore = successRate * 60;
      score += consistencyScore;
      evidence.push(`${(successRate * 100).toFixed(1)}% loan repayment success rate`);
    } else {
      evidence.push('No loan history available');
    }

    // Activity consistency (0-40 points)
    const recentPushes = githubData.repos.filter(repo => 
      new Date(repo.pushed_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    const consistencyActivityScore = Math.min(40, (recentPushes / Math.max(1, githubData.repos.length)) * 40);
    score += consistencyActivityScore;
    evidence.push(`${Math.round((recentPushes / Math.max(1, githubData.repos.length)) * 100)}% repositories active in last 30 days`);

    return {
      score: Math.min(100, score),
      maxScore: 100,
      weight: this.WEIGHTS.CONSISTENCY,
      description: 'Consistency in commitments and activity patterns',
      evidence,
      improvements: score < 80 ? [
        'Maintain consistent development activity',
        'Build reliable loan repayment history',
        'Keep projects actively maintained'
      ] : []
    };
  }

  private static calculateSecurityPractices(githubData: GitHubAPIResponse): TrustFactor {
    const { repos } = githubData;
    
    let score = 50; // Base score
    const evidence = [];

    // Security indicators in repository names/descriptions
    const securityKeywords = ['security', 'audit', 'test', 'ci', 'cd'];
    const securityAwareRepos = repos.filter(repo => 
      securityKeywords.some(keyword => 
        (repo.name.toLowerCase().includes(keyword) || 
         (repo.description?.toLowerCase().includes(keyword) || false))
      )
    );

    if (securityAwareRepos.length > 0) {
      score += 30;
      evidence.push(`${securityAwareRepos.length} repositories with security/testing focus`);
    }

    // Regular updates suggest maintenance and security awareness
    const wellMaintained = repos.filter(repo => 
      new Date(repo.updated_at) > new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    );
    
    if (wellMaintained.length / Math.max(1, repos.length) > 0.5) {
      score += 20;
      evidence.push('Consistent project maintenance indicating security awareness');
    }

    evidence.push('Security practices inferred from repository patterns');

    return {
      score: Math.min(100, score),
      maxScore: 100,
      weight: this.WEIGHTS.SECURITY,
      description: 'Security awareness and best practices implementation',
      evidence,
      improvements: score < 80 ? [
        'Implement security best practices',
        'Add security testing to projects',
        'Regular security audits and updates'
      ] : []
    };
  }

  private static calculateOnChainHistory(profile: DeveloperProfile): TrustFactor {
    let score = 0;
    const evidence = [];

    // Account age and activity
    if (profile.isVerified) {
      score += 40;
      evidence.push('Verified on-chain profile');
    }

    // Transaction history
    if (profile.successfulLoans > 0) {
      score += Math.min(40, profile.successfulLoans * 10);
      evidence.push(`${profile.successfulLoans} successful on-chain loan transactions`);
    }

    // Staking/collateral behavior
    if (profile.totalRepaid > 0) {
      score += Math.min(20, (profile.totalRepaid / Math.max(1, profile.totalBorrowed)) * 20);
      evidence.push(`${((profile.totalRepaid / Math.max(1, profile.totalBorrowed)) * 100).toFixed(1)}% repayment ratio`);
    }

    if (score === 0) {
      evidence.push('Limited on-chain history available');
    }

    return {
      score: Math.min(100, score),
      maxScore: 100,
      weight: this.WEIGHTS.ONCHAIN_HISTORY,
      description: 'On-chain transaction history and reputation',
      evidence,
      improvements: score < 80 ? [
        'Build on-chain transaction history',
        'Complete profile verification',
        'Participate in DeFi protocols'
      ] : []
    };
  }

  private static calculateVerificationScore(verificationStatus: any): TrustFactor {
    let score = 0;
    const evidence = [];

    if (verificationStatus?.isVerified) {
      score = 100;
      evidence.push(`Verified via ${verificationStatus.verificationMethod}`);
      if (verificationStatus.evidence) {
        evidence.push(`Evidence: ${verificationStatus.evidence}`);
      }
    } else {
      evidence.push('Profile not yet verified');
    }

    return {
      score,
      maxScore: 100,
      weight: this.WEIGHTS.VERIFICATION,
      description: 'Account verification status',
      evidence,
      improvements: score < 100 ? [
        'Complete GitHub verification process',
        'Link wallet address in GitHub profile',
        'Submit verification evidence'
      ] : []
    };
  }

  private static calculateWeightedScore(factors: any): number {
    let totalScore = 0;
    
    totalScore += factors.githubActivity.score * this.WEIGHTS.GITHUB_ACTIVITY;
    totalScore += factors.codeQuality.score * this.WEIGHTS.CODE_QUALITY;
    totalScore += factors.communityEngagement.score * this.WEIGHTS.COMMUNITY_ENGAGEMENT;
    totalScore += factors.projectComplexity.score * this.WEIGHTS.PROJECT_COMPLEXITY;
    totalScore += factors.consistencyReliability.score * this.WEIGHTS.CONSISTENCY;
    totalScore += factors.securityPractices.score * this.WEIGHTS.SECURITY;
    totalScore += factors.onChainHistory.score * this.WEIGHTS.ONCHAIN_HISTORY;
    totalScore += factors.verificationStatus.score * this.WEIGHTS.VERIFICATION;

    return Math.round(totalScore);
  }

  private static determineRiskCategory(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 80) return 'low';
    if (score >= 65) return 'medium';
    if (score >= 40) return 'high';
    return 'critical';
  }

  private static generateRecommendations(factors: any, totalScore: number): string[] {
    const recommendations = [];
    
    // Get improvements from lowest scoring factors
    const sortedFactors = Object.entries(factors)
      .sort(([,a]: any, [,b]: any) => (a.score * a.weight) - (b.score * b.weight))
      .slice(0, 3);

    for (const [, factor] of sortedFactors) {
      recommendations.push(...(factor as any).improvements);
    }

    if (totalScore < 60) {
      recommendations.unshift('Focus on completing GitHub verification');
      recommendations.push('Consider starting with smaller loan amounts');
    }

    return [...new Set(recommendations)].slice(0, 5);
  }

  private static getAccountAgeInYears(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    return (now.getTime() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  }
}
