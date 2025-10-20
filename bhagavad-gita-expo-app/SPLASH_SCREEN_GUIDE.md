# Splash Screen Implementation Guide

## Overview

The app now includes a beautiful, animated splash screen system that matches your web design. The splash screen features:

- **Gradient background** with orange/amber colors matching your brand
- **Animated GitaLogo** with spring animation
- **Decorative circles** with fade-in effects
- **Text animations** with slide-up effects
- **Loading progress** (optional) with progress bar
- **Pulse overlay** for subtle visual feedback

## Components

### 1. `SplashScreen` (Basic)
A simple animated splash screen without loading progress.

```tsx
import { SplashScreen } from '../src/components/SplashScreen';

<SplashScreen onAnimationComplete={() => console.log('Animation done!')} />
```

### 2. `LoadingSplashScreen` (Advanced)
An enhanced splash screen with loading progress and custom text.

```tsx
import { LoadingSplashScreen } from '../src/components/LoadingSplashScreen';

<LoadingSplashScreen 
  onAnimationComplete={handleComplete}
  loadingProgress={0.7}
  loadingText="Loading data..."
  showProgress={true}
/>
```

## Hooks

### 1. `useSplashScreen` (Configurable)
The main hook with full configuration options.

```tsx
const { 
  isAppReady, 
  showCustomSplash, 
  loadingProgress, 
  currentLoadingText,
  handleCustomSplashComplete 
} = useSplashScreen({
  loadingTasks: [
    {
      name: 'Loading preferences...',
      task: async () => {
        await StorageService.loadUserPreferences();
      },
    },
    // ... more tasks
  ],
  minimumSplashTime: 2000,
  showProgress: true,
});
```

### 2. `useSimpleSplashScreen` (Simple)
For basic splash screen without loading tasks.

```tsx
const { isAppReady, showCustomSplash, handleCustomSplashComplete } = useSimpleSplashScreen();
```

### 3. `useLoadingSplashScreen` (With Tasks)
For splash screen with specific loading tasks.

```tsx
const loadingTasks = [
  { name: 'Loading data...', task: async () => { /* load data */ } },
  { name: 'Preparing UI...', task: async () => { /* prepare UI */ } },
];

const { 
  isAppReady, 
  showCustomSplash, 
  loadingProgress, 
  currentLoadingText,
  handleCustomSplashComplete 
} = useLoadingSplashScreen(loadingTasks);
```

## Current Implementation

The app is currently configured with the `LoadingSplashScreen` and `useLoadingSplashScreen` hook in `app/_layout.tsx`:

```tsx
const loadingTasks = [
  {
    name: 'Loading preferences...',
    task: async () => {
      await StorageService.loadUserPreferences();
    },
  },
  {
    name: 'Loading favorites...',
    task: async () => {
      await StorageService.loadFavorites();
    },
  },
  {
    name: 'Preparing data...',
    task: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    },
  },
  {
    name: 'Finalizing...',
    task: async () => {
      await StorageService.performDataMigration();
    },
  },
];
```

## Configuration Options

### LoadingSplashScreen Props
- `onAnimationComplete?: () => void` - Callback when animation completes
- `loadingProgress?: number` - Progress from 0 to 1
- `loadingText?: string` - Text to show during loading
- `showProgress?: boolean` - Whether to show progress bar

### useSplashScreen Options
- `loadingTasks?: LoadingTask[]` - Array of tasks to execute
- `minimumSplashTime?: number` - Minimum time to show splash (default: 2000ms)
- `showProgress?: boolean` - Whether to show loading progress

### LoadingTask Interface
```tsx
interface LoadingTask {
  name: string;           // Text to display during this task
  task: () => Promise<void>; // Async function to execute
}
```

## Native Splash Screen Integration

The system integrates with Expo's native splash screen:

1. **Native splash** shows immediately on app launch
2. **Custom splash** shows after React Native loads
3. **Native splash** is hidden when custom splash starts
4. **Custom splash** handles all loading and animations

### Configuration in app.json
```json
{
  "splash": {
    "image": "./assets/splash-icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#f97316"
  },
  "plugins": [
    [
      "expo-splash-screen",
      {
        "backgroundColor": "#f97316",
        "image": "./assets/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain"
      }
    ]
  ]
}
```

## Customization

### Colors
The splash screen uses your brand colors:
- Primary: `#f97316` (orange)
- Secondary: `#f59e0b` (amber)
- Accent: `#ea580c` (darker orange)

### Animations
All animations are configurable:
- **Duration**: Modify timing values in the component
- **Easing**: Change animation curves
- **Delays**: Adjust staggered animation timing
- **Spring effects**: Customize bounce and tension

### Loading Tasks
Add your own loading tasks:

```tsx
const customTasks = [
  {
    name: 'Checking authentication...',
    task: async () => {
      // Check if user is logged in
      await AuthService.checkAuth();
    },
  },
  {
    name: 'Syncing data...',
    task: async () => {
      // Sync with server
      await DataService.sync();
    },
  },
  {
    name: 'Loading fonts...',
    task: async () => {
      // Load custom fonts
      await Font.loadAsync({
        'custom-font': require('./assets/fonts/custom.ttf'),
      });
    },
  },
];
```

## Performance Considerations

1. **Minimum splash time** prevents flickering on fast devices
2. **Progress tracking** provides user feedback during long loads
3. **Error handling** ensures app loads even if tasks fail
4. **Native integration** provides seamless experience

## Testing

Test the splash screen on different devices:

1. **Fast devices**: Ensure minimum time is respected
2. **Slow devices**: Verify loading doesn't timeout
3. **Network issues**: Test offline behavior
4. **Error scenarios**: Ensure graceful fallbacks

## Troubleshooting

### Splash screen not showing
- Check that `expo-splash-screen` is installed
- Verify `SplashScreen.preventAutoHideAsync()` is called
- Ensure native splash configuration is correct

### Animations not smooth
- Use `useNativeDriver: true` where possible
- Avoid layout animations during splash
- Test on physical devices, not just simulator

### Loading takes too long
- Optimize loading tasks
- Add timeout handling
- Consider lazy loading non-critical data

### White flash between screens
- Ensure proper timing between native and custom splash
- Check background colors match
- Verify StatusBar configuration