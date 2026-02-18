/**
 * Phase 24: Advanced Platform Features
 *
 * Exports all advanced feature components
 */

// Phase 24.1: Performance Optimization & Profiling
export {
  CPUProfiler,
  FunctionTimer,
  type SamplingMode,
  type TimeUnit,
  type StackFrame,
  type CallStack,
  type FunctionProfile,
  type FlameGraphNode,
} from './profiling/cpu-profiler';

export {
  MemoryProfiler,
  type MemoryAllocation,
  type HeapSnapshot,
  type GCStatistics,
  type LeakCandidate,
} from './profiling/memory-profiler';

export {
  BenchmarkRunner,
  type BenchmarkConfig,
  type BenchmarkResult,
  type BenchmarkComparison,
} from './profiling/benchmark-runner';

export {
  OptimizationRecommender,
  type RecommendationType,
  type SeverityLevel,
  type Recommendation,
  type PerformanceIssue,
} from './profiling/optimization-recommender';

export {
  PerformanceMonitor,
  type MetricSnapshot,
  type MetricAlert,
  type PerformanceThresholds,
} from './profiling/performance-monitor';
