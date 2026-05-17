import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@bhagavad_gita:user_id';

let cachedUserId: string | null = null;

function generateUUID(): string {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getUserId(): Promise<string> {
  if (cachedUserId) {
    return cachedUserId;
  }

  try {
    const stored = await AsyncStorage.getItem(USER_ID_KEY);
    if (stored) {
      cachedUserId = stored;
      return stored;
    }
  } catch (error) {
    console.error('[getUserId] Error reading from storage:', error);
  }

  const newId = generateUUID();
  cachedUserId = newId;

  try {
    await AsyncStorage.setItem(USER_ID_KEY, newId);
  } catch (error) {
    console.error('[getUserId] Error saving to storage:', error);
  }

  return newId;
}

export async function clearUserId(): Promise<void> {
  cachedUserId = null;
  try {
    await AsyncStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('[clearUserId] Error clearing from storage:', error);
  }
}
