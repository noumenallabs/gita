import '../src/global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '../src/context/AppContext';
import { ResponsiveProvider } from '../src/context/ResponsiveContext';
import { BlockingSplashWrapper } from '../src/components/BlockingSplashWrapper';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { validateEnv } from '../src/utils/envValidation';
import { ApiError } from '../src/services/httpClient';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    const env = validateEnv();
    if (!env.valid) {
      console.error('[EnvValidation]', env.errors.join(', '));
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ResponsiveProvider>
            <AppProvider>
              <BlockingSplashWrapper>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="chapter/[id]" options={{ headerShown: false }} />
                </Stack>
              </BlockingSplashWrapper>
            </AppProvider>
          </ResponsiveProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
