
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, TrendingUp } from "lucide-react";

interface TrustScoreWidgetProps {
  score: number;
  breakdown?: {
    github: number;
    codeQuality: number;
    community: number;
    onChain: number;
  };
  compact?: boolean;
}

const TrustScoreWidget = ({ score, breakdown, compact = false }: TrustScoreWidgetProps) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 85) return { label: "Excellent", variant: "default" as const };
    if (score >= 70) return { label: "Good", variant: "secondary" as const };
    return { label: "Fair", variant: "outline" as const };
  };

  const badge = getTrustScoreBadge(score);

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Star className="h-4 w-4 text-yellow-500 fill-current" />
        <span className={`font-semibold ${getTrustScoreColor(score)}`}>{score}</span>
        <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trust Score</CardTitle>
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getTrustScoreColor(score)}`}>
            {score}
          </div>
          <Badge variant={badge.variant} className="mt-2">
            {badge.label}
          </Badge>
        </div>

        {breakdown && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700">Score Breakdown</div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>GitHub Activity</span>
                <span>{breakdown.github}/40</span>
              </div>
              <Progress value={(breakdown.github / 40) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Code Quality</span>
                <span>{breakdown.codeQuality}/30</span>
              </div>
              <Progress value={(breakdown.codeQuality / 30) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Community</span>
                <span>{breakdown.community}/25</span>
              </div>
              <Progress value={(breakdown.community / 25) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>On-Chain</span>
                <span>{breakdown.onChain}/5</span>
              </div>
              <Progress value={(breakdown.onChain / 5) * 100} className="h-2" />
            </div>
          </div>
        )}

        <div className="flex items-center text-xs text-slate-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          <span>Updated daily based on activity</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustScoreWidget;
