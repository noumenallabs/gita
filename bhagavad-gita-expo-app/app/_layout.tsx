import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/context/AppContext';
import { ResponsiveProvider } from '../src/context/ResponsiveContext';
import { BlockingSplashWrapper } from '../src/components/BlockingSplashWrapper';

export default function RootLayout() {
  return (
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
  );
}
