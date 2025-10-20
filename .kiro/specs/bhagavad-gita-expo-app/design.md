# Design Document

## Overview

The Bhagavad Gita Expo mobile application will be built using React Native with Expo SDK 52+ to ensure cross-platform compatibility and native performance. The app will replicate the web application's functionality while optimizing for mobile interaction patterns, touch interfaces, and varying screen sizes.

The architecture follows a component-based approach with TypeScript for type safety, utilizing Expo's managed workflow for simplified development and deployment. The design emphasizes spiritual aesthetics with gradient backgrounds, smooth animations, and respectful presentation of sacred texts.

## Architecture

### Technology Stack
- **Framework**: Expo SDK 52+ with React Native
- **Language**: TypeScript for type safety and better development experience
- **Navigation**: Expo Router with tab-based navigation
- **Styling**: NativeWind (Tailwind CSS for React Native) for consistent styling
- **Animations**: React Native Reanimated 3 for smooth transitions
- **Storage**: Expo SecureStore/AsyncStorage for favorites and preferences
- **State Management**: React Context API with useReducer for global state
- **Icons**: Expo Vector Icons (Lucide icons equivalent)

### Project Structure
```
src/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab layout group
│   │   ├── index.tsx      # Home tab (Shloka of the Day)
│   │   ├── browse.tsx     # Browse chapters tab
│   │   ├── search.tsx     # Search tab
│   │   └── favorites.tsx  # Favorites tab
│   ├── chapter/[id].tsx   # Dynamic chapter detail page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── ShlokaCard.tsx    # Shloka display component
│   ├── AppHeader.tsx     # Header component
│   └── GitaLogo.tsx      # Custom logo component
├── data/                 # Static data and types
│   └── gita-data.ts      # Shloka and chapter data
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── constants/            # App constants and themes
```

### State Management Architecture
```typescript
interface AppState {
  favorites: Set<string>;
  currentTab: TabName;
  searchQuery: string;
  selectedChapter: number | null;
  theme: 'light' | 'dark';
}

interface AppContext {
  state: AppState;
  actions: {
    toggleFavorite: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setSelectedChapter: (id: number | null) => void;
    toggleTheme: () => void;
  };
}
```

## Components and Interfaces

### Core Components

#### 1. AppHeader Component
```typescript
interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}
```
- Displays gradient header with Gita logo
- Supports navigation back button for chapter details
- Responsive design for different screen sizes
- Animated logo with subtle hover effects

#### 2. ShlokaCard Component
```typescript
interface ShlokaCardProps {
  shloka: Shloka;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  showChapterInfo?: boolean;
}
```
- Displays Sanskrit text with collapsible sections
- Multiple translation view modes
- Favorite toggle with haptic feedback
- Smooth expand/collapse animations
- Optimized text rendering for mobile screens

#### 3. ChapterCard Component
```typescript
interface ChapterCardProps {
  chapter: Chapter;
  onPress: (chapterId: number) => void;
  hasShlokas: boolean;
}
```
- Chapter overview with gradient styling
- Visual indicators for available content
- Touch feedback and navigation
- Responsive card layout

#### 4. SearchBar Component
```typescript
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}
```
- Optimized mobile keyboard handling
- Search suggestions and popular terms
- Clear button and voice input support
- Debounced search for performance

#### 5. TabNavigation Component
- Bottom tab bar with animated indicators
- Custom tab icons with active states
- Safe area handling for different devices
- Haptic feedback on tab switches

### UI Component Library

#### Base Components
- **Button**: Multiple variants (primary, secondary, ghost) with proper touch targets
- **Card**: Elevated containers with gradient support and shadow effects
- **Input**: Text input with proper mobile keyboard types and validation
- **Badge**: Status indicators and counters
- **Sheet**: Bottom sheet for translation selection and settings
- **Toast**: Success/error notifications with auto-dismiss

#### Layout Components
- **SafeAreaView**: Proper safe area handling across devices
- **ScrollView**: Optimized scrolling with pull-to-refresh
- **FlatList**: Efficient list rendering for large datasets
- **KeyboardAvoidingView**: Proper keyboard handling for forms

## Data Models

### Core Data Types
```typescript
interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations: {
    english: string;
    wordByWord: string;
    commentary: string;
  };
}

interface Chapter {
  number: number;
  name: string;
  translation: string;
  verses: number;
  summary: string;
}

interface UserPreferences {
  favoriteShlokas: string[];
  defaultTranslationView: TranslationView;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  showSanskrit: boolean;
}
```

### Data Management Strategy
- **Static Data**: All shlokas and chapters bundled with the app
- **User Data**: Favorites and preferences stored in AsyncStorage
- **Search Index**: Pre-built search index for fast text searching
- **Caching**: Intelligent caching of rendered components and search results

## Error Handling

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}
```
- Global error boundary for crash prevention
- Graceful degradation for missing data
- User-friendly error messages
- Automatic error reporting (optional)

### Offline Handling
- All content available offline after initial app install
- Graceful handling of storage errors
- Fallback UI states for missing data
- Network status awareness for future online features

### Input Validation
- Search query sanitization
- Proper handling of special characters in Sanskrit text
- Validation of user preferences
- Safe parsing of stored data

## Testing Strategy

### Unit Testing
- **Framework**: Jest with React Native Testing Library
- **Coverage**: Core business logic, utility functions, and data transformations
- **Mock Strategy**: Mock AsyncStorage, navigation, and external dependencies

### Component Testing
- **Approach**: Render testing with user interaction simulation
- **Focus Areas**: 
  - ShlokaCard translation switching
  - Search functionality and filtering
  - Favorites toggle behavior
  - Navigation between screens

### Integration Testing
- **Navigation Flow**: Tab switching and deep linking
- **Data Flow**: Favorites persistence and retrieval
- **Search Integration**: End-to-end search functionality
- **State Management**: Context provider behavior

### Performance Testing
- **Metrics**: App startup time, scroll performance, memory usage
- **Tools**: Flipper integration for debugging
- **Optimization**: Bundle size analysis and code splitting

### Device Testing
- **Physical Devices**: iOS (iPhone 12+) and Android (Pixel 4+)
- **Simulators**: Various screen sizes and OS versions
- **Accessibility**: Screen reader compatibility and touch target sizes
- **Performance**: Low-end device testing for optimization

## Platform-Specific Considerations

### iOS Optimizations
- **Safe Area**: Proper handling of notches and home indicators
- **Haptic Feedback**: Native haptic patterns for interactions
- **Typography**: San Francisco font integration
- **Animations**: Core Animation integration through Reanimated

### Android Optimizations
- **Material Design**: Subtle material design elements where appropriate
- **Navigation**: Hardware back button handling
- **Typography**: Roboto font family usage
- **Permissions**: Proper permission handling for future features

### Cross-Platform Consistency
- **Design System**: Unified component library with platform adaptations
- **Behavior**: Consistent user experience across platforms
- **Performance**: Optimized for both platforms' specific characteristics
- **Testing**: Platform-specific testing strategies

## Accessibility

### Screen Reader Support
- Proper semantic labeling for all interactive elements
- Sanskrit text with pronunciation hints
- Translation content properly structured for screen readers
- Navigation announcements for tab switches

### Visual Accessibility
- High contrast mode support
- Scalable font sizes (small, medium, large)
- Color-blind friendly design choices
- Sufficient touch target sizes (44pt minimum)

### Motor Accessibility
- Large touch targets for all interactive elements
- Swipe gesture alternatives
- Voice control compatibility
- Reduced motion options for animations

## Performance Optimization

### Rendering Optimization
- **FlatList**: Virtualized lists for large datasets
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Dynamic imports for non-critical components
- **Image Optimization**: Proper image sizing and caching

### Memory Management
- **Text Rendering**: Efficient Sanskrit text rendering
- **State Cleanup**: Proper cleanup of event listeners and timers
- **Bundle Size**: Code splitting and tree shaking
- **Asset Optimization**: Compressed images and optimized fonts

### Animation Performance
- **Native Driver**: Use native driver for all animations
- **Layout Animations**: Minimize layout thrashing
- **Gesture Handling**: Optimized touch response
- **Frame Rate**: Maintain 60fps for smooth interactions

## Security Considerations

### Data Protection
- **Local Storage**: Secure storage for sensitive user preferences
- **Input Sanitization**: Proper handling of user input
- **Data Validation**: Validation of all stored and retrieved data
- **Privacy**: No external data transmission for core functionality

### App Security
- **Code Obfuscation**: Production build optimization
- **Asset Protection**: Secure bundling of app assets
- **Update Security**: Secure over-the-air updates through Expo
- **Platform Security**: Leverage platform-specific security features