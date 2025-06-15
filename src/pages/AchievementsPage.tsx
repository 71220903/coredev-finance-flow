
import AchievementsWidget from "@/components/AchievementsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Medal, Award, Target, Zap } from "lucide-react";
import AppLayout from "@/components/navigation/AppLayout";

const AchievementsPage = () => {
  const breadcrumbItems = [
    { label: "Achievements" }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: "First Investment",
      description: "Made your first investment in a developer project",
      icon: Trophy,
      earnedAt: "2024-01-15",
      category: "Investment"
    },
    {
      id: 2,
      title: "Trust Builder", 
      description: "Reached trust score of 75+",
      icon: Star,
      earnedAt: "2024-01-10",
      category: "Trust"
    },
    {
      id: 3,
      title: "Portfolio Diversifier",
      description: "Invested in 5 different projects",
      icon: Medal,
      earnedAt: "2024-01-05",
      category: "Portfolio"
    }
  ];

  const progressGoals = [
    {
      title: "Market Explorer",
      description: "Browse 50 different projects",
      progress: 32,
      target: 50,
      icon: Target
    },
    {
      title: "Active Investor",
      description: "Make 10 successful investments",
      progress: 7,
      target: 10,
      icon: Zap
    },
    {
      title: "Community Leader",
      description: "Refer 5 new users to the platform",
      progress: 2,
      target: 5,
      icon: Award
    }
  ];

  return (
    <AppLayout
      breadcrumbItems={breadcrumbItems}
      pageTitle="Achievements"
      pageDescription="Track your progress and unlock achievements on CoreDev Zero"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Achievements Widget */}
          <AchievementsWidget />

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <achievement.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{achievement.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="secondary">{achievement.category}</Badge>
                          <span className="text-xs text-slate-500">{achievement.earnedAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span>Progress Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressGoals.map((goal, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <goal.icon className="h-5 w-5 text-slate-600" />
                        <div>
                          <h3 className="font-medium text-slate-900">{goal.title}</h3>
                          <p className="text-sm text-slate-600">{goal.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {goal.progress}/{goal.target}
                      </span>
                    </div>
                    <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AchievementsPage;
