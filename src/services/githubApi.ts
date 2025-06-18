
export interface GitHubAPIResponse {
  user: {
    login: string;
    id: number;
    avatar_url: string;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    bio: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
  };
  repos: Array<{
    id: number;
    name: string;
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    open_issues_count: number;
  }>;
  events: Array<{
    type: string;
    created_at: string;
    repo: {
      name: string;
    };
  }>;
}

export class GitHubAPIService {
  private static readonly GITHUB_API_BASE = 'https://api.github.com';
  
  static async fetchUserProfile(githubHandle: string): Promise<GitHubAPIResponse> {
    try {
      // In a real implementation, you'd need a GitHub token
      // For now, we'll simulate the API response
      return this.simulateGitHubResponse(githubHandle);
    } catch (error) {
      console.error('Error fetching GitHub profile:', error);
      throw new Error('Failed to fetch GitHub profile');
    }
  }

  static async verifyGitHubHandle(githubHandle: string, walletAddress: string): Promise<{
    isVerified: boolean;
    verificationMethod: 'gist' | 'repo' | 'profile';
    evidence?: string;
  }> {
    try {
      // Simulate verification process
      // In real implementation, this would check for wallet address in:
      // 1. GitHub gist
      // 2. Repository README
      // 3. Profile bio
      
      const hasValidEvidence = Math.random() > 0.3; // 70% success rate for demo
      
      return {
        isVerified: hasValidEvidence,
        verificationMethod: 'gist',
        evidence: hasValidEvidence ? `https://gist.github.com/${githubHandle}/verification` : undefined
      };
    } catch (error) {
      console.error('Error verifying GitHub handle:', error);
      return {
        isVerified: false,
        verificationMethod: 'gist'
      };
    }
  }

  private static simulateGitHubResponse(githubHandle: string): GitHubAPIResponse {
    const baseData = {
      alexcoder: {
        repos: 42,
        stars: 1230,
        followers: 450,
        following: 180,
        accountAge: 5.2,
        commits: 2500
      },
      sarahdev: {
        repos: 35,
        stars: 890,
        followers: 380,
        following: 150,
        accountAge: 4.8,
        commits: 3200
      },
      mikej: {
        repos: 28,
        stars: 560,
        followers: 220,
        following: 120,
        accountAge: 3.5,
        commits: 1800
      }
    };

    const userData = baseData[githubHandle as keyof typeof baseData] || baseData.mikej;
    const createdDate = new Date();
    createdDate.setFullYear(createdDate.getFullYear() - userData.accountAge);

    return {
      user: {
        login: githubHandle,
        id: Math.floor(Math.random() * 1000000),
        avatar_url: `https://images.unsplash.com/photo-150700321117${githubHandle.length}?w=150&h=150&fit=crop&crop=face`,
        name: githubHandle === 'alexcoder' ? 'Alex Rodriguez' : 
              githubHandle === 'sarahdev' ? 'Sarah Chen' : 'Mike Johnson',
        company: '@CoreDevZero',
        blog: `https://${githubHandle}.dev`,
        location: 'San Francisco, CA',
        email: `${githubHandle}@example.com`,
        bio: 'Full-stack developer passionate about DeFi and Web3',
        public_repos: userData.repos,
        public_gists: Math.floor(userData.repos * 0.3),
        followers: userData.followers,
        following: userData.following,
        created_at: createdDate.toISOString()
      },
      repos: Array.from({ length: Math.min(10, userData.repos) }, (_, i) => ({
        id: i + 1,
        name: `project-${i + 1}`,
        full_name: `${githubHandle}/project-${i + 1}`,
        description: `Awesome project ${i + 1} description`,
        stargazers_count: Math.floor(userData.stars / userData.repos * (1 + Math.random())),
        forks_count: Math.floor(userData.stars / userData.repos * 0.2),
        language: ['TypeScript', 'Solidity', 'Python', 'JavaScript', 'Rust'][i % 5],
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        pushed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        size: Math.floor(Math.random() * 10000),
        open_issues_count: Math.floor(Math.random() * 20)
      })),
      events: Array.from({ length: 20 }, (_, i) => ({
        type: ['PushEvent', 'CreateEvent', 'IssuesEvent', 'PullRequestEvent'][Math.floor(Math.random() * 4)],
        created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        repo: {
          name: `${githubHandle}/project-${Math.floor(Math.random() * 5) + 1}`
        }
      }))
    };
  }
}
