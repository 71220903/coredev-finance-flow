
import { useEffect, useCallback, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentMounts: number;
  reRenders: number;
  lastUpdate: number;
}

interface PerformanceHook {
  metrics: PerformanceMetrics;
  startTiming: (label: string) => void;
  endTiming: (label: string) => void;
  logMetric: (name: string, value: number) => void;
  getAverageRenderTime: () => number;
}

export const usePerformanceMonitor = (componentName: string): PerformanceHook => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMounts: 0,
    reRenders: 0,
    lastUpdate: Date.now()
  });

  const [timings, setTimings] = useState<Map<string, number>>(new Map());
  const [renderTimes, setRenderTimes] = useState<number[]>([]);

  // Track component mounts and re-renders
  useEffect(() => {
    const startTime = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      componentMounts: prev.componentMounts + 1,
      lastUpdate: Date.now()
    }));

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setRenderTimes(prev => [...prev.slice(-9), renderTime]); // Keep last 10
      setMetrics(prev => ({
        ...prev,
        renderTime,
        reRenders: prev.reRenders + 1
      }));
    };
  }, []);

  const startTiming = useCallback((label: string) => {
    setTimings(prev => new Map(prev.set(label, performance.now())));
  }, []);

  const endTiming = useCallback((label: string) => {
    const startTime = timings.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`${componentName} - ${label}: ${duration.toFixed(2)}ms`);
      setTimings(prev => {
        const newMap = new Map(prev);
        newMap.delete(label);
        return newMap;
      });
    }
  }, [timings, componentName]);

  const logMetric = useCallback((name: string, value: number) => {
    console.log(`${componentName} - ${name}: ${value}`);
  }, [componentName]);

  const getAverageRenderTime = useCallback(() => {
    if (renderTimes.length === 0) return 0;
    return renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
  }, [renderTimes]);

  // Log performance warnings
  useEffect(() => {
    if (metrics.renderTime > 16) { // 60fps threshold
      console.warn(`${componentName} render took ${metrics.renderTime.toFixed(2)}ms (>16ms)`);
    }
    
    if (metrics.reRenders > 10) {
      console.warn(`${componentName} has re-rendered ${metrics.reRenders} times`);
    }
  }, [metrics.renderTime, metrics.reRenders, componentName]);

  return {
    metrics,
    startTiming,
    endTiming,
    logMetric,
    getAverageRenderTime
  };
};

