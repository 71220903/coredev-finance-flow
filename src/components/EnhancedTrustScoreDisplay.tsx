
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  TrendingUp, 
  Github, 
  Code2, 
  Users, 
  Layers, 
  Clock, 
  Lock,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ComprehensiveTrustScore, TrustFactor } from '@/services/enhancedTrustScore';

interface EnhancedTrustScoreDisplayProps {
  trustScore: ComprehensiveTrustScore;
  showDetails?: boolean;
  onImprove?: (factor: string) => void;
}

const EnhancedTrustScoreDisplay = ({ 
  trustScore, 
  showDetails = true,
  onImprove 
}: EnhancedTrustScoreDisplayProps) => {

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 65) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getFactorIcon = (factorKey: string) => {
    const icons = {
      githubActivity: Github,
      codeQuality: Code2,
      communityEngagement: Users,
      projectComplexity: Layers,
      consistencyReliability: Clock,
      securityPractices: Lock,
      onChainHistory: Activity,
      verificationStatus: CheckCircle
    };
    return icons[factorKey as keyof typeof icons] || Info;
  };

  const getFactorColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderFactorCard = (factorKey: string, factor: TrustFactor) => {
    const Icon = getFactorIcon(factorKey);
    const percentage = (factor.score / factor.maxScore) * 100;
    
    return (
      <Card key={factorKey} className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className={`h-5 w-5 ${getFactorColor(factor.score, factor.maxScore)}`} />
              <CardTitle className="text-sm">
                {factorKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {(factor.weight * 100).toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span className={`font-semibold ${getFactorColor(factor.score, factor.maxScore)}`}>
                {factor.score}/{factor.maxScore}
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          <p className="text-xs text-slate-600">{factor.description}</p>

          {factor.evidence.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-700">Evidence:</p>
              {factor.evidence.slice(0, 2).map((evidence, index) => (
                <p key={index} className="text-xs text-slate-600 flex items-start">
                  <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                  {evidence}
                </p>
              ))}
            </div>
          )}

          {factor.improvements.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-orange-700">Improvements:</p>
              {factor.improvements.slice(0, 2).map((improvement, index) => (
                <p key={index} className="text-xs text-orange-600 flex items-start">
                  <AlertTriangle className="h-3 w-3 text-orange-500 mr-1 mt-0.5 flex-shrink-0" />
                  {improvement}
                </p>
              ))}
              {factor.improvements.length > 0 && onImprove && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2 text-xs h-7"
                  onClick={() => onImprove(factorKey)}
                >
                  Get Improvement Tips
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!showDetails) {
    return (
      <Card className={`${getTrustScoreBgColor(trustScore.totalScore)}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className={`h-8 w-8 ${getTrustScoreColor(trustScore.totalScore)}`} />
              <div>
                <div className={`text-2xl font-bold ${getTrustScoreColor(trustScore.totalScore)}`}>
                  {trustScore.totalScore}
                </div>
                <div className="text-sm text-slate-600">Trust Score</div>
              </div>
            </div>
            <Badge className={getRiskBadgeColor(trustScore.riskCategory)}>
              {trustScore.riskCategory.toUpperCase()} RISK
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className={`${getTrustScoreBgColor(trustScore.totalScore)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className={`h-8 w-8 ${getTrustScoreColor(trustScore.totalScore)}`} />
              <div>
                <CardTitle className="text-2xl">Comprehensive Trust Score</CardTitle>
                <p className="text-slate-600">Based on 8 key factors</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getTrustScoreColor(trustScore.totalScore)}`}>
                {trustScore.totalScore}
              </div>
              <Badge className={getRiskBadgeColor(trustScore.riskCategory)}>
                {trustScore.riskCategory.toUpperCase()} RISK
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Overall Progress</p>
              <Progress value={trustScore.totalScore} className="h-3" />
              <p className="text-xs text-slate-600">{trustScore.totalScore}/100</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Risk Level</p>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${
                  trustScore.riskCategory === 'low' ? 'bg-green-500' :
                  trustScore.riskCategory === 'medium' ? 'bg-yellow-500' :
                  trustScore.riskCategory === 'high' ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                <span className="text-sm capitalize">{trustScore.riskCategory}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Last Updated</p>
              <p className="text-xs text-slate-600">
                {new Date(trustScore.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Tabs defaultValue="factors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="factors">Trust Factors</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="factors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(trustScore.factors).map(([key, factor]) => 
              renderFactorCard(key, factor)
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Personalized Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trustScore.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {trustScore.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">Great job! Your trust score is optimized.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTrustScoreDisplay;
