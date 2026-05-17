import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Colors } from '../constants/theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  style?: any;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = memo(
  ({
    value,
    onChangeText,
    placeholder = 'Search shlokas...',
    showSuggestions = false,
    suggestions = [],
    onSuggestionPress,
    style,
    autoFocus = false,
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestionModal, setShowSuggestionModal] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      // Show suggestions when focused and has suggestions
      setShowSuggestionModal(
        isFocused && showSuggestions && suggestions.length > 0 && value.length === 0
      );
    }, [isFocused, showSuggestions, suggestions.length, value.length]);

    const handleClear = useCallback(() => {
      onChangeText('');
      inputRef.current?.focus();
    }, [onChangeText]);

    const handleSuggestionPress = useCallback(
      (suggestion: string) => {
        onChangeText(suggestion);
        onSuggestionPress?.(suggestion);
        setShowSuggestionModal(false);
        setIsFocused(false);
        Keyboard.dismiss();
      },
      [onChangeText, onSuggestionPress]
    );

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      // Delay hiding suggestions to allow for suggestion press
      setTimeout(() => {
        setIsFocused(false);
      }, 150);
    }, []);

    const handleSubmitEditing = useCallback(() => {
      Keyboard.dismiss();
      setIsFocused(false);
    }, []);

    const renderSuggestionItem = useCallback(
      ({ item }: { item: string }) => (
        <Pressable
          onPress={() => handleSuggestionPress(item)}
          style={({ pressed }) => [styles.suggestionItem, pressed && styles.suggestionItemPressed]}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={Colors.gray[400]}
            style={styles.suggestionIcon}
          />
          <Text style={styles.suggestionText}>{item}</Text>
        </Pressable>
      ),
      [handleSuggestionPress]
    );

    const keyExtractor = useCallback((item: string, index: number) => `suggestion-${index}`, []);

    return (
      <>
        <View style={[styles.container, style]}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={Colors.gray[400]}
              style={styles.searchIcon}
            />

            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={Colors.gray[400]}
              style={styles.input}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmitEditing={handleSubmitEditing}
              returnKeyType="search"
              autoFocus={autoFocus}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              clearButtonMode="never"
            />

            {value.length > 0 && (
              <Pressable
                onPress={handleClear}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={20} color={Colors.gray[400]} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Suggestions Modal */}
        <Modal
          visible={showSuggestionModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSuggestionModal(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowSuggestionModal(false)}>
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>Popular Searches</Text>
              </View>

              <FlatList
                data={suggestions}
                renderItem={renderSuggestionItem}
                keyExtractor={keyExtractor}
                style={styles.suggestionsList}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={5}
                initialNumToRender={5}
              />
            </View>
          </Pressable>
        </Modal>
      </>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo optimization
    return (
      prevProps.value === nextProps.value &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.showSuggestions === nextProps.showSuggestions &&
      prevProps.suggestions === nextProps.suggestions &&
      prevProps.autoFocus === nextProps.autoFocus
    );
  }
);

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 0,
    color: Colors.gray[800],
  },
  clearButton: {
    marginLeft: 8,
  },
  // Modal and Suggestions Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 120, // Position below search bar
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  suggestionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  suggestionsList: {
    maxHeight: 240,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  suggestionItemPressed: {
    backgroundColor: Colors.gray[50],
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.gray[700],
  },
});
