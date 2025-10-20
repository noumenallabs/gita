import { Shloka } from '../types';

/**
 * Utility functions for managing daily shloka selection
 */

/**
 * Get a deterministic shloka based on the current date
 * This ensures the same shloka is shown for the same date across all users
 */
export function getDailyShloka(shlokas: Shloka[], date?: Date): Shloka {
  const targetDate = date || new Date();

  // Create a deterministic seed based on the date
  const dateString = formatDateForSeed(targetDate);
  const seed = hashString(dateString);

  // Use the seed to select a shloka index
  const index = seed % shlokas.length;

  return shlokas[index];
}

/**
 * Get the current date in a consistent format for seeding
 */
function formatDateForSeed(date: Date): string {
  // Use UTC to ensure consistency across timezones
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Simple hash function to convert a string to a number
 * This creates a deterministic pseudo-random number from the date string
 */
function hashString(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Ensure positive number
  return Math.abs(hash);
}

/**
 * Get the formatted date string for display
 */
export function getFormattedDate(date?: Date): string {
  const targetDate = date || new Date();

  return targetDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get the next shloka that would be shown (for tomorrow)
 * Useful for testing the rotation logic
 */
export function getNextDailyShloka(shlokas: Shloka[], date?: Date): Shloka {
  const targetDate = date || new Date();
  const tomorrow = new Date(targetDate);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  return getDailyShloka(shlokas, tomorrow);
}

/**
 * Get the previous shloka that was shown (yesterday)
 * Useful for testing the rotation logic
 */
export function getPreviousDailyShloka(shlokas: Shloka[], date?: Date): Shloka {
  const targetDate = date || new Date();
  const yesterday = new Date(targetDate);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  return getDailyShloka(shlokas, yesterday);
}

/**
 * Check if it's a new day since the last check
 * This can be used to trigger updates when the date changes
 */
export function isNewDay(lastCheckDate: Date, currentDate?: Date): boolean {
  const current = currentDate || new Date();

  const lastDateString = formatDateForSeed(lastCheckDate);
  const currentDateString = formatDateForSeed(current);

  return lastDateString !== currentDateString;
}

/**
 * Get a random shloka for manual refresh functionality
 * This provides a different shloka than the daily one
 */
export function getRandomShloka(shlokas: Shloka[], excludeId?: string): Shloka {
  let availableShlokas = shlokas;

  // Exclude the current daily shloka if specified
  if (excludeId) {
    availableShlokas = shlokas.filter(shloka => shloka.id !== excludeId);
  }

  // If no shlokas available after filtering, return a random one from all
  if (availableShlokas.length === 0) {
    availableShlokas = shlokas;
  }

  const randomIndex = Math.floor(Math.random() * availableShlokas.length);
  return availableShlokas[randomIndex];
}

/**
 * Calculate how many days it would take to cycle through all shlokas
 */
export function getDaysToCycleAllShlokas(totalShlokas: number): number {
  return totalShlokas;
}

/**
 * Get statistics about the daily shloka rotation
 */
export function getDailyShlokaStats(shlokas: Shloka[]) {
  const totalShlokas = shlokas.length;
  const daysToCycle = getDaysToCycleAllShlokas(totalShlokas);

  // Calculate chapters represented
  const chaptersSet = new Set(shlokas.map(shloka => shloka.chapter));
  const chaptersCount = chaptersSet.size;

  return {
    totalShlokas,
    daysToCycle,
    chaptersRepresented: chaptersCount,
    averageShlokaPerChapter: Math.round(totalShlokas / chaptersCount),
  };
}

/**
 * Validate that the daily shloka algorithm is working correctly
 * This is useful for testing and debugging
 */
export function validateDailyShlokaAlgorithm(shlokas: Shloka[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Test that the same date always returns the same shloka
  const testDate = new Date('2024-01-01');
  const shloka1 = getDailyShloka(shlokas, testDate);
  const shloka2 = getDailyShloka(shlokas, testDate);

  if (shloka1.id !== shloka2.id) {
    errors.push('Algorithm is not deterministic - same date returns different shlokas');
  }

  // Test that different dates return different shlokas (most of the time)
  const testDates = [
    new Date('2024-01-01'),
    new Date('2024-01-02'),
    new Date('2024-01-03'),
    new Date('2024-01-04'),
    new Date('2024-01-05'),
  ];

  const selectedShlokas = testDates.map(date => getDailyShloka(shlokas, date));
  const uniqueShlokas = new Set(selectedShlokas.map(s => s.id));

  // We expect at least 80% of the test dates to have unique shlokas
  const uniquePercentage = (uniqueShlokas.size / testDates.length) * 100;
  if (uniquePercentage < 80) {
    errors.push(
      `Low variety in shloka selection: only ${uniquePercentage}% unique shlokas in test dates`
    );
  }

  // Test that all shlokas can be selected
  const allPossibleIndices = new Set<number>();
  for (let i = 0; i < shlokas.length * 2; i++) {
    const testDate = new Date('2024-01-01');
    testDate.setUTCDate(testDate.getUTCDate() + i);
    const shloka = getDailyShloka(shlokas, testDate);
    const index = shlokas.findIndex(s => s.id === shloka.id);
    allPossibleIndices.add(index);
  }

  if (allPossibleIndices.size < shlokas.length * 0.8) {
    errors.push('Algorithm may not be able to select all shlokas over time');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
