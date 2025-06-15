
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Vote,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Gavel,
  Shield
} from "lucide-react";

const CommunityGovernance = () => {
  const [userVotes, setUserVotes] = useState<Record<string, 'yes' | 'no' | null>>({});

  // Sample governance data
  const activeProposals = [
    {
      id: 'GOV-001',
      title: 'Reduce minimum trust score requirement for lending',
      description: 'Lower the minimum trust score from 70 to 65 to increase platform accessibility while maintaining security standards.',
      proposer: 'CoreDev Foundation',
      status: 'active',
      votingEnds: '2024-07-20',
      votes: { yes: 1247, no: 523, total: 1770 },
      requiredQuorum: 2000,
      category: 'platform',
      discussion: 42
    },
    {
      id: 'GOV-002',
      title: 'Implement dynamic interest rate caps',
      description: 'Introduce smart contract-based interest rate caps that adjust based on market conditions and borrower trust scores.',
      proposer: 'Alex Rodriguez',
      status: 'active',
      votingEnds: '2024-07-25',
      votes: { yes: 892, no: 234, total: 1126 },
      requiredQuorum: 1500,
      category: 'economics',
      discussion: 28
    },
    {
      id: 'GOV-003',
      title: 'Add new achievement categories for SBTs',
      description: 'Expand the Soul-Bound Token achievement system to include categories for mentorship, security auditing, and cross-chain development.',
      proposer: 'DevDAO Collective',
      status: 'active',
      votingEnds: '2024-07-30',
      votes: { yes: 1567, no: 189, total: 1756 },
      requiredQuorum: 1800,
      category: 'features',
      discussion: 67
    }
  ];

  const pastProposals = [
    {
      id: 'GOV-004',
      title: 'Implement staking rewards for tCORE holders',
      status: 'passed',
      finalVotes: { yes: 2134, no: 456, total: 2590 },
      implementation: 'completed'
    },
    {
      id: 'GOV-005',
      title: 'Increase platform fee to 2.5%',
      status: 'rejected',
      finalVotes: { yes: 567, no: 1823, total: 2390 },
      implementation: 'n/a'
    }
  ];

  const governanceStats = {
    totalProposals: 28,
    activeVoters: 3247,
    totalVotingPower: 12450000,
    participationRate: 67.8
  };

  const handleVote = (proposalId: string, vote: 'yes' | 'no') => {
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: prev[proposalId] === vote ? null : vote
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'passed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'platform': return 'bg-blue-100 text-blue-800';
      case 'economics': return 'bg-green-100 text-green-800';
      case 'features': return 'bg-purple-100 text-purple-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            <Gavel className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{governanceStats.totalProposals}</div>
            <p className="text-xs text-muted-foreground">All time proposals</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Voters</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{governanceStats.activeVoters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Participating community members</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voting Power</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(governanceStats.totalVotingPower / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Total tCORE staked</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{governanceStats.participationRate}%</div>
            <p className="text-xs text-muted-foreground">Average proposal participation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Proposals</TabsTrigger>
          <TabsTrigger value="history">Voting History</TabsTrigger>
          <TabsTrigger value="create">Create Proposal</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeProposals.map((proposal) => (
            <Card key={proposal.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(proposal.category)}>
                        {proposal.category}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{proposal.title}</CardTitle>
                    <p className="text-muted-foreground">{proposal.description}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Ends {proposal.votingEnds}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Proposed by: <strong>{proposal.proposer}</strong></span>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{proposal.discussion} comments</span>
                  </div>
                </div>

                {/* Voting Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Voting Progress</span>
                    <span>{proposal.votes.total} / {proposal.requiredQuorum} required</span>
                  </div>
                  <Progress value={(proposal.votes.total / proposal.requiredQuorum) * 100} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Yes</span>
                      </div>
                      <span className="font-semibold">{proposal.votes.yes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>No</span>
                      </div>
                      <span className="font-semibold">{proposal.votes.no.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Progress value={(proposal.votes.yes / proposal.votes.total) * 100} className="h-2" />
                    <Progress value={(proposal.votes.no / proposal.votes.total) * 100} className="h-2" />
                  </div>
                </div>

                {/* Voting Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant={userVotes[proposal.id] === 'yes' ? 'default' : 'outline'}
                    onClick={() => handleVote(proposal.id, 'yes')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Vote Yes
                  </Button>
                  <Button
                    variant={userVotes[proposal.id] === 'no' ? 'destructive' : 'outline'}
                    onClick={() => handleVote(proposal.id, 'no')}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Vote No
                  </Button>
                  <Button variant="ghost">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Discuss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Recent Governance Decisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pastProposals.map((proposal) => (
                <div key={proposal.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{proposal.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                        {proposal.implementation && (
                          <Badge variant="outline">
                            {proposal.implementation}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4">
                          <span className="text-green-600">
                            ✓ {proposal.finalVotes.yes.toLocaleString()}
                          </span>
                          <span className="text-red-600">
                            ✗ {proposal.finalVotes.no.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Total: {proposal.finalVotes.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Create New Proposal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Proposal Creation Requirements</h3>
                <div className="space-y-2 text-sm text-muted-foreground max-w-md mx-auto">
                  <p>• Minimum 1,000 tCORE staked</p>
                  <p>• Trust score above 80</p>
                  <p>• Active community member for 30+ days</p>
                  <p>• Proposal bond: 500 tCORE</p>
                </div>
                <Button className="mt-6" disabled>
                  Create Proposal (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityGovernance;
