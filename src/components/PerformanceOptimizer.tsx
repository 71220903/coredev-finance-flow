
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Zap,
  Gauge,
  Clock,
  Database,
  Wifi,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  networkRequests: number;
  cacheHitRate: number;
}

interface OptimizationSettings {
  lazyLoading: boolean;
  imageOptimization: boolean;
  caching: boolean;
  compression: boolean;
  prefetching: boolean;
  minification: boolean;
}

const PerformanceOptimizer = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 2.4,
    renderTime: 1.2,
    bundleSize: 847,
    memoryUsage: 45,
    networkRequests: 23,
    cacheHitRate: 78
  });

  const [settings, setSettings] = useState<OptimizationSettings>({
    lazyLoading: true,
    imageOptimization: true,
    caching: true,
    compression: false,
    prefetching: false,
    minification: true
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  // Calculate performance score
  const performanceScore = useMemo(() => {
    const loadTimeScore = Math.max(0, 100 - (metrics.loadTime * 10));
    const renderTimeScore = Math.max(0, 100 - (metrics.renderTime * 20));
    const bundleSizeScore = Math.max(0, 100 - (metrics.bundleSize / 10));
    const memoryScore = Math.max(0, 100 - metrics.memoryUsage);
    const cacheScore = metrics.cacheHitRate;
    
    return Math.round((loadTimeScore + renderTimeScore + bundleSizeScore + memoryScore + cacheScore) / 5);
  }, [metrics]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700";
    if (score >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const optimizationSuggestions = [
    {
      id: 1,
      title: "Enable Bundle Compression",
      description: "Reduce bundle size by 30-40% with gzip compression",
      impact: "High",
      setting: "compression",
      enabled: settings.compression
    },
    {
      id: 2,
      title: "Implement Route Prefetching",
      description: "Preload critical routes for faster navigation",
      impact: "Medium",
      setting: "prefetching",
      enabled: settings.prefetching
    },
    {
      id: 3,
      title: "Optimize Bundle Splitting",
      description: "Split code into smaller chunks for better caching",
      impact: "High",
      setting: "minification",
      enabled: settings.minification
    }
  ];

  const updateSetting = (key: keyof OptimizationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Simulate performance impact
    if (value) {
      setTimeout(() => {
        setMetrics(prev => ({
          ...prev,
          loadTime: Math.max(0.5, prev.loadTime - 0.2),
          bundleSize: Math.max(100, prev.bundleSize - 50),
          cacheHitRate: Math.min(100, prev.cacheHitRate + 5)
        }));
      }, 1000);
    }
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setMetrics(prev => ({
      loadTime: Math.max(0.5, prev.loadTime * 0.8),
      renderTime: Math.max(0.3, prev.renderTime * 0.7),
      bundleSize: Math.max(200, prev.bundleSize * 0.6),
      memoryUsage: Math.max(20, prev.memoryUsage * 0.8),
      networkRequests: Math.max(5, prev.networkRequests * 0.8),
      cacheHitRate: Math.min(100, prev.cacheHitRate * 1.2)
    }));
    
    setIsOptimizing(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span>Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(performanceScore)}>{performanceScore}</span>
              <span className="text-slate-400">/100</span>
            </div>
            <Badge className={getScoreBadge(performanceScore)}>
              {performanceScore >= 80 ? "Excellent" : performanceScore >= 60 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
          <Progress value={performanceScore} className="h-3" />
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.loadTime}s</div>
              <div className="text-sm text-slate-600">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.bundleSize}KB</div>
              <div className="text-sm text-slate-600">Bundle Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.cacheHitRate}%</div>
              <div className="text-sm text-slate-600">Cache Hit Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Current Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Page Load Time</span>
              </div>
              <span className="font-medium">{metrics.loadTime}s</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Render Time</span>
              </div>
              <span className="font-medium">{metrics.renderTime}s</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-500" />
                <span>Memory Usage</span>
              </div>
              <span className="font-medium">{metrics.memoryUsage}MB</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-purple-500" />
                <span>Network Requests</span>
              </div>
              <span className="font-medium">{metrics.networkRequests}</span>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Optimization Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <p className="text-sm text-slate-600">
                    {key === 'lazyLoading' && "Load components when needed"}
                    {key === 'imageOptimization' && "Compress and resize images"}
                    {key === 'caching' && "Cache API responses and assets"}
                    {key === 'compression' && "Compress bundle with gzip"}
                    {key === 'prefetching' && "Preload critical resources"}
                    {key === 'minification' && "Minify JavaScript and CSS"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateSetting(key as keyof OptimizationSettings, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Optimization Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border rounded-lg transition-all duration-200 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <Badge variant={suggestion.impact === 'High' ? 'destructive' : 'secondary'}>
                        {suggestion.impact} Impact
                      </Badge>
                      {suggestion.enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{suggestion.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={suggestion.enabled ? "outline" : "default"}
                    onClick={() => updateSetting(suggestion.setting as keyof OptimizationSettings, !suggestion.enabled)}
                  >
                    {suggestion.enabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={runOptimization} 
              disabled={isOptimizing}
              className="transition-all duration-200 hover:scale-105"
            >
              {isOptimizing ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Full Optimization
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOptimizer;
