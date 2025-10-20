/**
 * Performance testing utilities for the Bhagavad Gita app
 */

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  searchTime: number;
  storageTime: number;
}

interface PerformanceTest {
  name: string;
  test: () => Promise<number> | number;
  threshold: number; // Maximum acceptable time in ms
}

/**
 * Measures the time taken to execute a function
 */
export const measureExecutionTime = async (fn: () => Promise<any> | any): Promise<number> => {
  const startTime = performance.now();
  await fn();
  const endTime = performance.now();
  return endTime - startTime;
};

/**
 * Tests search performance across different query types
 */
export const testSearchPerformance = async (
  shlokas: any[],
  queries: string[]
): Promise<PerformanceMetrics> => {
  const { searchShlokas } = require('./search');

  let totalSearchTime = 0;

  for (const query of queries) {
    const searchTime = await measureExecutionTime(() => {
      return searchShlokas(shlokas, query);
    });
    totalSearchTime += searchTime;
  }

  return {
    renderTime: 0,
    memoryUsage: 0,
    searchTime: totalSearchTime / queries.length,
    storageTime: 0,
  };
};

/**
 * Tests storage operation performance
 */
export const testStoragePerformance = async (): Promise<number> => {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  const testData = JSON.stringify(['1.1', '2.5', '3.10', '4.7', '5.15']);

  const storageTime = await measureExecutionTime(async () => {
    await AsyncStorage.setItem('test_favorites', testData);
    await AsyncStorage.getItem('test_favorites');
    await AsyncStorage.removeItem('test_favorites');
  });

  return storageTime;
};

/**
 * Tests component rendering performance
 */
export const testRenderPerformance = (componentCount: number): number => {
  const startTime = performance.now();

  // Simulate rendering multiple components
  for (let i = 0; i < componentCount; i++) {
    // Simulate component creation overhead
    const mockComponent = {
      id: `component_${i}`,
      props: { key: i, data: `test_data_${i}` },
      render: () => `<Component ${i} />`,
    };
    mockComponent.render();
  }

  const endTime = performance.now();
  return endTime - startTime;
};

/**
 * Comprehensive performance test suite
 */
export const runPerformanceTests = async (shlokas: any[]): Promise<PerformanceMetrics> => {
  console.log('🚀 Starting performance tests...');

  // Test search performance with various queries
  const searchQueries = ['dharma', 'karma', 'yoga', 'krishna', 'arjuna'];
  const searchMetrics = await testSearchPerformance(shlokas, searchQueries);

  // Test storage performance
  const storageTime = await testStoragePerformance();

  // Test render performance
  const renderTime = testRenderPerformance(100);

  const metrics: PerformanceMetrics = {
    renderTime,
    memoryUsage: 0, // Memory usage testing requires native modules
    searchTime: searchMetrics.searchTime,
    storageTime,
  };

  console.log('📊 Performance Test Results:');
  console.log(`  Render Time (100 components): ${renderTime.toFixed(2)}ms`);
  console.log(`  Search Time (average): ${searchMetrics.searchTime.toFixed(2)}ms`);
  console.log(`  Storage Time: ${storageTime.toFixed(2)}ms`);

  return metrics;
};

/**
 * Validates performance against thresholds
 */
export const validatePerformance = (metrics: PerformanceMetrics): boolean => {
  const thresholds = {
    renderTime: 100, // 100ms for 100 components
    searchTime: 50, // 50ms for search operations
    storageTime: 100, // 100ms for storage operations
  };

  const issues: string[] = [];

  if (metrics.renderTime > thresholds.renderTime) {
    issues.push(`Render time too slow: ${metrics.renderTime}ms > ${thresholds.renderTime}ms`);
  }

  if (metrics.searchTime > thresholds.searchTime) {
    issues.push(`Search time too slow: ${metrics.searchTime}ms > ${thresholds.searchTime}ms`);
  }

  if (metrics.storageTime > thresholds.storageTime) {
    issues.push(`Storage time too slow: ${metrics.storageTime}ms > ${thresholds.storageTime}ms`);
  }

  if (issues.length > 0) {
    console.warn('⚠️ Performance Issues Detected:');
    issues.forEach(issue => console.warn(`  - ${issue}`));
    return false;
  }

  console.log('✅ All performance tests passed!');
  return true;
};

/**
 * Memory usage estimation (simplified)
 */
export const estimateMemoryUsage = (shlokas: any[]): number => {
  // Rough estimation of memory usage
  const avgShlokaSize = JSON.stringify(shlokas[0] || {}).length;
  const totalDataSize = avgShlokaSize * shlokas.length;

  // Add overhead for app structure (estimated)
  const appOverhead = 1024 * 1024; // 1MB overhead

  return totalDataSize + appOverhead;
};

/**
 * Bundle size analysis
 */
export const analyzeBundleSize = (): void => {
  console.log('📦 Bundle Size Analysis:');
  console.log('  Note: Run "npx expo export" to get actual bundle size metrics');
  console.log('  Recommended: Keep total bundle under 20MB for optimal performance');

  // This would require actual bundle analysis tools in a real implementation
  const estimatedBundleSize = estimateMemoryUsage([]) / (1024 * 1024); // Convert to MB
  console.log(`  Estimated app size: ~${estimatedBundleSize.toFixed(1)}MB`);
};

/**
 * Device-specific performance recommendations
 */
export const getPerformanceRecommendations = (
  deviceType: 'phone' | 'tablet' | 'low-end'
): string[] => {
  const recommendations: Record<string, string[]> = {
    'low-end': [
      'Enable FlatList virtualization for large lists',
      'Reduce animation complexity',
      'Implement lazy loading for images',
      'Use React.memo for expensive components',
      'Minimize re-renders with proper key props',
    ],
    phone: [
      'Optimize for single-hand usage',
      'Ensure touch targets are at least 44pt',
      'Test on various screen sizes',
      'Optimize for portrait orientation',
    ],
    tablet: [
      'Utilize larger screen real estate',
      'Support landscape orientation',
      'Consider split-screen layouts',
      'Optimize typography for reading distance',
    ],
  };

  return recommendations[deviceType] || [];
};
