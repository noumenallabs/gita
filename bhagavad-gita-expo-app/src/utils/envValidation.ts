const REQUIRED_ENV_VARS = ['EXPO_PUBLIC_API_URL'] as const;

export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      errors.push(`Missing environment variable: ${key}`);
    } else if (key === 'EXPO_PUBLIC_API_URL') {
      try {
        new URL(value);
      } catch {
        errors.push(`Invalid URL in ${key}: ${value}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getApiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      'EXPO_PUBLIC_API_URL is not set. Check your .env file.'
    );
  }
  return url.replace(/\/+$/, '');
}
