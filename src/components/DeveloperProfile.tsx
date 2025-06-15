
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Github, 
  Star, 
  Code2, 
  Trophy, 
  ExternalLink, 
  Shield,
  Calendar,
  GitBranch,
  Users
} from "lucide-react";

interface DeveloperProfileProps {
  developerId: string;
}

const DeveloperProfile = ({ developerId }: DeveloperProfileProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - would come from API in real implementation
  const developerData = {
    name: "Alex Rodriguez",
    githubHandle: "@alexcoder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Full-stack developer passionate about DeFi and Web3 innovation",
    trustScore: 88,
    totalRepos: 42,
    totalStars: 1230,
    followers: 450,
    contributions: 890,
    yearsActive: 5,
    languages: ["TypeScript", "Solidity", "Python", "Rust"],
    achievements: [
      { id: 1, title: "ETH Global Winner", date: "2023", verified: true },
      { id: 2, title: "Top 10 Gitcoin Grants", date: "2023", verified: true },
      { id: 3, title: "Hackathon Champion", date: "2022", verified: false }
    ],
    projects: [
      { name: "DeFi Yield Aggregator", stars: 340, language: "Solidity" },
      { name: "Web3 Analytics Dashboard", stars: 280, language: "TypeScript" },
      { name: "Cross-chain Bridge", stars: 450, language: "Rust" }
    ],
    onChainMetrics: {
      walletAge: "2.5 years",
      transactionCount: 1250,
      protocolInteractions: ["Uniswap", "Aave", "Compound", "1inch"],
      nftCollections: 3
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    return "Fair";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={developerData.avatar} 
                alt={developerData.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <CardTitle className="text-2xl">{developerData.name}</CardTitle>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Github className="h-4 w-4" />
                  <span>{developerData.githubHandle}</span>
                </div>
                <p className="text-slate-600 mt-1">{developerData.bio}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getTrustScoreColor(developerData.trustScore)}`}>
                {developerData.trustScore}
              </div>
              <Badge variant="outline" className="mt-1">
                {getTrustScoreBadge(developerData.trustScore)}
              </Badge>
              <div className="text-sm text-slate-600 mt-1">Trust Score</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-slate-600">Repositories</span>
            </div>
            <div className="text-2xl font-bold">{developerData.totalRepos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-slate-600">Total Stars</span>
            </div>
            <div className="text-2xl font-bold">{developerData.totalStars}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-600">Followers</span>
            </div>
            <div className="text-2xl font-bold">{developerData.followers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-slate-600">Contributions</span>
            </div>
            <div className="text-2xl font-bold">{developerData.contributions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="onchain">On-Chain</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Breakdown</CardTitle>
              <CardDescription>Factors contributing to overall trust score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>GitHub Activity</span>
                  <span>35/40</span>
                </div>
                <Progress value={87.5} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Code Quality</span>
                  <span>28/30</span>
                </div>
                <Progress value={93.3} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Community Reputation</span>
                  <span>20/25</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>On-Chain History</span>
                  <span>5/5</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages & Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {developerData.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Featured Projects</CardTitle>
              <CardDescription>Top repositories by stars and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {developerData.projects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-slate-600">{project.language}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{project.stars}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verified Achievements</CardTitle>
              <CardDescription>Hackathon wins and community recognition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {developerData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-slate-600">{achievement.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {achievement.verified ? (
                        <Badge className="bg-green-100 text-green-700">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>On-Chain Activity</CardTitle>
              <CardDescription>Blockchain interaction history and metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Wallet Age</div>
                  <div className="font-semibold">{developerData.onChainMetrics.walletAge}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Transactions</div>
                  <div className="font-semibold">{developerData.onChainMetrics.transactionCount}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-slate-600 mb-2">Protocol Interactions</div>
                <div className="flex flex-wrap gap-2">
                  {developerData.onChainMetrics.protocolInteractions.map((protocol) => (
                    <Badge key={protocol} variant="outline">{protocol}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeveloperProfile;
