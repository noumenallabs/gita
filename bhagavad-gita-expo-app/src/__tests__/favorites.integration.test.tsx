import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppProvider } from '../context/AppContext';
import { useFavorites } from '../hooks/useFavorites';
import { View, Text, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage to prevent state bleed
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const FavoritesTestComponent = () => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  return (
    <View>
      <Text testID="favorites-count">{favorites.length}</Text>
      <Text testID="is-favorite-1-1">{isFavorite('1.1') ? 'true' : 'false'}</Text>
      
      <Pressable testID="toggle-btn-1-1" onPress={() => toggleFavorite('1.1')}>
        <Text>Toggle Verse 1.1</Text>
      </Pressable>
    </View>
  );
};

describe('Favorites Integration Test', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should seamlessly toggle a verse in and out of favorites globally', async () => {
    const { getByTestId } = render(
      <AppProvider>
        <FavoritesTestComponent />
      </AppProvider>
    );

    // 1. Initial State Check
    expect(getByTestId('favorites-count').props.children).toBe(0);
    expect(getByTestId('is-favorite-1-1').props.children).toBe('false');

    // 2. User Clicks Favorite Button
    fireEvent.press(getByTestId('toggle-btn-1-1'));

    // 3. Verify Verse 1.1 was Added
    await waitFor(() => {
      expect(getByTestId('favorites-count').props.children).toBe(1);
      expect(getByTestId('is-favorite-1-1').props.children).toBe('true');
    });

    // 4. User Clicks Favorite Button Again (Remove)
    fireEvent.press(getByTestId('toggle-btn-1-1'));

    // 5. Verify Verse 1.1 was Removed
    await waitFor(() => {
      expect(getByTestId('favorites-count').props.children).toBe(0);
      expect(getByTestId('is-favorite-1-1').props.children).toBe('false');
    });
  });
});
