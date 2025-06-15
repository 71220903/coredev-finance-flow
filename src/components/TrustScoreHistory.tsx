
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Shield, 
  Github, 
  Users, 
  Code, 
  Activity,
  Calendar,
  Award
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface TrustScoreHistoryProps {
  userId?: string;
}

const TrustScoreHistory = ({ userId = "default" }: TrustScoreHistoryProps) => {
  // Sample trust score history data
  const trustScoreHistory = [
    { date: '2024-01', overall: 65, github: 20, codeQuality: 18, community: 15, onChain: 2 },
    { date: '2024-02', overall: 72, github: 25, codeQuality: 22, community: 18, onChain: 3 },
    { date: '2024-03', overall: 78, github: 28, codeQuality: 25, community: 20, onChain: 3 },
    { date: '2024-04', overall: 82, github: 32, codeQuality: 26, community: 19, onChain: 4 },
    { date: '2024-05', overall: 85, github: 34, codeQuality: 27, community: 20, onChain: 4 },
    { date: '2024-06', overall: 88, github: 35, codeQuality: 28, community: 20, onChain: 5 }
  ];

  const currentBreakdown = {
    github: { score: 35, max: 40, activities: ['15 commits this month', '3 PRs merged', '2 repos created'] },
    codeQuality: { score: 28, max: 30, activities: ['95% test coverage', 'Clean code practices', 'Documentation quality'] },
    community: { score: 20, max: 25, activities: ['5 code reviews', '3 issues resolved', 'Active discussions'] },
    onChain: { score: 5, max: 5, activities: ['Wallet verified', 'Transaction history', 'Smart contract interactions'] }
  };

  const radarData = [
    { subject: 'GitHub Activity', A: 35, B: 40, fullMark: 40 },
    { subject: 'Code Quality', A: 28, B: 30, fullMark: 30 },
    { subject: 'Community', A: 20, B: 25, fullMark: 25 },
    { subject: 'On-Chain', A: 5, B: 5, fullMark: 5 }
  ];

  const milestones = [
    {
      date: '2024-06-15',
      title: 'Trust Score: Excellent Tier',
      description: 'Achieved trust score above 85',
      type: 'achievement',
      icon: Award
    },
    {
      date: '2024-05-20',
      title: 'Community Contributor',
      description: 'Completed 50+ code reviews',
      type: 'community',
      icon: Users
    },
    {
      date: '2024-04-10',
      title: 'Code Quality Master',
      description: 'Maintained 95%+ test coverage for 3 months',
      type: 'quality',
      icon: Code
    },
    {
      date: '2024-03-05',
      title: 'GitHub Veteran',
      description: 'Reached 500+ contributions this year',
      type: 'github',
      icon: Github
    }
  ];

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 85) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 85) return { label: "Excellent", variant: "default" as const };
    if (percentage >= 70) return { label: "Good", variant: "secondary" as const };
    return { label: "Fair", variant: "outline" as const };
  };

  const currentScore = trustScoreHistory[trustScoreHistory.length - 1].overall;
  const previousScore = trustScoreHistory[trustScoreHistory.length - 2].overall;
  const scoreChange = currentScore - previousScore;

  return (
    <div className="space-y-6">
      {/* Current Trust Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Current Trust Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor(currentScore, 100)}`}>
                {currentScore}
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Badge {...getScoreBadge(currentScore, 100)}>
                  {getScoreBadge(currentScore, 100).label}
                </Badge>
                <div className="flex items-center text-sm">
                  {scoreChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={scoreChange > 0 ? "text-green-600" : "text-red-600"}>
                    {scoreChange > 0 ? '+' : ''}{scoreChange} this month
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500 inline mr-1" />
              Ranked in top 15% of developers
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 animate-fade-in">
          <CardHeader>
            <CardTitle>Score Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 40]} />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Maximum"
                  dataKey="B"
                  stroke="#E5E7EB"
                  fill="#E5E7EB"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="history">Score History</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="improvement">Improvement</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Trust Score Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trustScoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Overall Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="github" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="GitHub"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="codeQuality" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Code Quality"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="community" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Community"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="onChain" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="On-Chain"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(currentBreakdown).map(([key, data]) => (
              <Card key={key} className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 capitalize">
                    {key === 'github' && <Github className="h-5 w-5" />}
                    {key === 'codeQuality' && <Code className="h-5 w-5" />}
                    {key === 'community' && <Users className="h-5 w-5" />}
                    {key === 'onChain' && <Activity className="h-5 w-5" />}
                    <span>{key === 'codeQuality' ? 'Code Quality' : key === 'onChain' ? 'On-Chain' : key}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{data.score}</span>
                    <span className="text-muted-foreground">/ {data.max}</span>
                  </div>
                  <Progress value={(data.score / data.max) * 100} />
                  <div className="space-y-2">
                    {data.activities.map((activity, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        {activity}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Achievement Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <milestone.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {milestone.date}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{milestone.description}</p>
                    <Badge variant="outline" className="mt-2">{milestone.type}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900">GitHub Activity</h5>
                    <p className="text-sm text-blue-700">Maintain consistent commits to reach 40/40</p>
                    <Progress value={87.5} className="mt-2" />
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-900">Code Quality</h5>
                    <p className="text-sm text-green-700">Excellent! Keep up the high standards</p>
                    <Progress value={93.3} className="mt-2" />
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-900">Community</h5>
                    <p className="text-sm text-yellow-700">Participate in more discussions to reach 25/25</p>
                    <Progress value={80} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                    <div>
                      <p className="font-medium">Increase Community Engagement</p>
                      <p className="text-sm text-muted-foreground">Join 2 more technical discussions this week</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                    <div>
                      <p className="font-medium">Maintain Code Quality</p>
                      <p className="text-sm text-muted-foreground">Keep test coverage above 90%</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                    <div>
                      <p className="font-medium">GitHub Consistency</p>
                      <p className="text-sm text-muted-foreground">Aim for 3+ commits per week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrustScoreHistory;
