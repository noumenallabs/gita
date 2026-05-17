import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean;
}

async function checkConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://www.gstatic.com/generate_204', {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.status === 204 || response.ok;
  } catch {
    return false;
  }
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: true,
    isConnected: true,
  });

  const checkStatus = useCallback(async () => {
    const online = await checkConnectivity();
    setStatus({ isOnline: online, isConnected: online });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkStatus = async () => {
      const online = await checkConnectivity();
      if (!cancelled) {
        setStatus({ isOnline: online, isConnected: online });
      }
    };

    checkStatus();

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleOnline = () => { if (!cancelled) setStatus({ isOnline: true, isConnected: true }); };
      const handleOffline = () => { if (!cancelled) setStatus({ isOnline: false, isConnected: false }); };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        cancelled = true;
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    const interval = setInterval(checkStatus, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return status;
}
