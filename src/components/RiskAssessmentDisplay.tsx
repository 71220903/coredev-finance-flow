
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  Brain, 
  Target, 
  Shield,
  Activity,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { RiskAssessment } from '@/types/market';

interface RiskAssessmentDisplayProps {
  riskAssessment: RiskAssessment;
  showDetails?: boolean;
}

const RiskAssessmentDisplay = ({ 
  riskAssessment, 
  showDetails = true 
}: RiskAssessmentDisplayProps) => {

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield className="h-5 w-5 text-green-600" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-slate-600" />;
    }
  };

  const getFactorIcon = (category: string) => {
    switch (category) {
      case 'credit': return <BarChart3 className="h-4 w-4" />;
      case 'market': return <TrendingUp className="h-4 w-4" />;
      case 'technical': return <Activity className="h-4 w-4" />;
      case 'liquidity': return <Target className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!showDetails) {
    return (
      <Card className={`border-2 ${getRiskColor(riskAssessment.overallRisk)}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getRiskIcon(riskAssessment.overallRisk)}
              <div>
                <div className="text-sm font-medium">Risk Assessment</div>
                <div className="text-xs text-slate-600">
                  Score: {riskAssessment.riskScore}/100
                </div>
              </div>
            </div>
            <Badge className={getRiskColor(riskAssessment.overallRisk)}>
              {riskAssessment.overallRisk.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Risk Assessment</span>
          <Badge className={getRiskColor(riskAssessment.overallRisk)}>
            {riskAssessment.overallRisk.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Risk Score</span>
                <span className="text-2xl font-bold">{riskAssessment.riskScore}/100</span>
              </div>
              <Progress value={100 - riskAssessment.riskScore} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Risk Level</p>
                  <div className="flex items-center space-x-2">
                    {getRiskIcon(riskAssessment.overallRisk)}
                    <span className="capitalize">{riskAssessment.overallRisk}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Last Updated</p>
                  <p className="text-sm text-slate-600">
                    {new Date(riskAssessment.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="factors" className="space-y-4">
            <div className="space-y-3">
              {riskAssessment.factors.map((factor, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-grow">
                      {getFactorIcon(factor.category)}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{factor.factor}</h4>
                          <Badge variant="outline" className="text-xs">
                            {factor.impact.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{factor.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-500">Weight:</span>
                          <span className="text-xs font-medium">{(factor.weight * 100).toFixed(0)}%</span>
                          <span className="text-xs text-slate-500">Value:</span>
                          <span className="text-xs font-medium">{factor.value}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>AI Insights</span>
                </h4>
                {riskAssessment.aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Recommended Actions</span>
                </h4>
                {riskAssessment.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentDisplay;
