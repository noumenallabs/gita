import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: '@bhagavad_gita:favorites',
  USER_PREFERENCES: '@bhagavad_gita:user_preferences',
  APP_VERSION: '@bhagavad_gita:app_version',
} as const;

// Current app version for data migration
const CURRENT_APP_VERSION = '1.0.0';

// Default user preferences
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  favoriteShlokas: [],
  defaultTranslationView: 'english',
  theme: 'light',
  fontSize: 'medium',
  showSanskrit: true,
};

/**
 * Storage service for managing app data persistence
 */
export class StorageService {
  /**
   * Save favorites to AsyncStorage
   */
  static async saveFavorites(favorites: string[]): Promise<void> {
    try {
      const favoritesData = JSON.stringify(favorites);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, favoritesData);
    } catch (error) {
      console.error('Error saving favorites:', error);
      throw new Error('Failed to save favorites');
    }
  }

  /**
   * Load favorites from AsyncStorage
   */
  static async loadFavorites(): Promise<string[]> {
    try {
      const favoritesData = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      
      if (favoritesData === null) {
        return [];
      }

      const favorites = JSON.parse(favoritesData);

      // Validate that it's an array of strings
      if (!Array.isArray(favorites) || !favorites.every(item => typeof item === 'string')) {
        console.warn('Invalid favorites data format, returning empty array');
        return [];
      }

      return favorites;
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * Add a shloka to favorites
   */
  static async addToFavorites(shlokaId: string): Promise<string[]> {
    try {
      const currentFavorites = await this.loadFavorites();

      if (!currentFavorites.includes(shlokaId)) {
        const updatedFavorites = [...currentFavorites, shlokaId];
        await this.saveFavorites(updatedFavorites);
        return updatedFavorites;
      }

      return currentFavorites;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  }

  /**
   * Remove a shloka from favorites
   */
  static async removeFromFavorites(shlokaId: string): Promise<string[]> {
    try {
      const currentFavorites = await this.loadFavorites();
      const updatedFavorites = currentFavorites.filter(id => id !== shlokaId);

      await this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  }

  /**
   * Toggle favorite status of a shloka
   */
  static async toggleFavorite(
    shlokaId: string
  ): Promise<{ favorites: string[]; isFavorite: boolean }> {
    try {
      const currentFavorites = await this.loadFavorites();
      const isFavorite = currentFavorites.includes(shlokaId);

      let updatedFavorites: string[];

      if (isFavorite) {
        updatedFavorites = await this.removeFromFavorites(shlokaId);
      } else {
        updatedFavorites = await this.addToFavorites(shlokaId);
      }

      return {
        favorites: updatedFavorites,
        isFavorite: !isFavorite,
      };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw new Error('Failed to toggle favorite');
    }
  }

  /**
   * Save user preferences to AsyncStorage
   */
  static async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      const preferencesData = JSON.stringify(preferences);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferencesData);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw new Error('Failed to save user preferences');
    }
  }

  /**
   * Load user preferences from AsyncStorage
   */
  static async loadUserPreferences(): Promise<UserPreferences> {
    try {
      const preferencesData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);

      if (preferencesData === null) {
        // Return default preferences and save them
        await this.saveUserPreferences(DEFAULT_USER_PREFERENCES);
        return DEFAULT_USER_PREFERENCES;
      }

      const preferences = JSON.parse(preferencesData);

      // Validate and merge with defaults to handle missing properties
      const validatedPreferences: UserPreferences = {
        ...DEFAULT_USER_PREFERENCES,
        ...preferences,
      };

      // Ensure favoriteShlokas is always an array
      if (!Array.isArray(validatedPreferences.favoriteShlokas)) {
        validatedPreferences.favoriteShlokas = [];
      }

      return validatedPreferences;
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return DEFAULT_USER_PREFERENCES;
    }
  }

  /**
   * Update specific user preference
   */
  static async updateUserPreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<UserPreferences> {
    try {
      const currentPreferences = await this.loadUserPreferences();
      const updatedPreferences = {
        ...currentPreferences,
        [key]: value,
      };

      await this.saveUserPreferences(updatedPreferences);
      return updatedPreferences;
    } catch (error) {
      console.error('Error updating user preference:', error);
      throw new Error('Failed to update user preference');
    }
  }

  /**
   * Clear all stored data (useful for debugging or reset functionality)
   */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.USER_PREFERENCES,
        STORAGE_KEYS.APP_VERSION,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * Get current app version from storage
   */
  static async getStoredAppVersion(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.APP_VERSION);
    } catch (error) {
      console.error('Error getting stored app version:', error);
      return null;
    }
  }

  /**
   * Set current app version in storage
   */
  static async setAppVersion(version: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_VERSION, version);
    } catch (error) {
      console.error('Error setting app version:', error);
      throw new Error('Failed to set app version');
    }
  }

  /**
   * Perform data migration if needed
   */
  static async performDataMigration(): Promise<void> {
    try {
      const storedVersion = await this.getStoredAppVersion();

      if (storedVersion === null) {
        // First time installation
        await this.setAppVersion(CURRENT_APP_VERSION);
        return;
      }

      if (storedVersion !== CURRENT_APP_VERSION) {
        // Perform migration based on version differences
        await this.migrateData(storedVersion, CURRENT_APP_VERSION);
        await this.setAppVersion(CURRENT_APP_VERSION);
      }
    } catch (error) {
      console.error('Error performing data migration:', error);
      // Don't throw here to prevent app crashes during migration
    }
  }

  /**
   * Migrate data between versions
   */
  private static async migrateData(fromVersion: string, toVersion: string): Promise<void> {
    console.log(`Migrating data from version ${fromVersion} to ${toVersion}`);

    // Future migration logic can be added here
    // For now, we'll just ensure data integrity

    try {
      // Validate and fix favorites data
      const favorites = await this.loadFavorites();
      await this.saveFavorites(favorites);

      // Validate and fix user preferences
      const preferences = await this.loadUserPreferences();
      await this.saveUserPreferences(preferences);

      console.log('Data migration completed successfully');
    } catch (error) {
      console.error('Error during data migration:', error);
      throw error;
    }
  }

  /**
   * Get storage usage statistics (for debugging)
   */
  static async getStorageStats(): Promise<{
    favoritesCount: number;
    hasPreferences: boolean;
    appVersion: string | null;
  }> {
    try {
      const favorites = await this.loadFavorites();
      const preferencesData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      const appVersion = await this.getStoredAppVersion();

      return {
        favoritesCount: favorites.length,
        hasPreferences: preferencesData !== null,
        appVersion,
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        favoritesCount: 0,
        hasPreferences: false,
        appVersion: null,
      };
    }
  }
}

// Export individual functions for convenience
export const {
  saveFavorites,
  loadFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  saveUserPreferences,
  loadUserPreferences,
  updateUserPreference,
  clearAllData,
  performDataMigration,
  getStorageStats,
} = StorageService;
