# README.md

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Expo CLI** (optional, but recommended for better development experience)
- **iOS Simulator** (for macOS users) or **Android Studio** (for Android development)
- **Xcode** (macOS only, for iOS development)
- **Android Studio** (for Android development, optional if using Expo Go)

### Installation Steps

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Navigate to the project directory**
   ```bash
   cd react-native/test-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   
   Note: The `postinstall` script will automatically run `patch-package` to apply any necessary patches.

4. **Start the Metro bundler**
   ```bash
   npm start
   ```
   
   Or use Expo CLI:
   ```bash
   npx expo start
   ```

### How to Run the App

#### iOS Development

**Option 1: Using Expo Go (Recommended for quick testing)**
```bash
npm start
# Press 'i' to open in iOS simulator
# Or scan QR code with Expo Go app on your device
```

**Option 2: Using Native Build**
```bash
npm run ios
# or
npx expo run:ios
```

#### Android Development

**Option 1: Using Expo Go**
```bash
npm start
# Press 'a' to open in Android emulator
# Or scan QR code with Expo Go app on your device
```

**Option 2: Using Native Build**
```bash
npm run android
# or
npx expo run:android
```

#### Web Development
```bash
npm run web
# or
npx expo start --web
```

### Troubleshooting

- **Clear Metro cache**: If you encounter build issues, try clearing the cache:
  ```bash
  npx expo start -c
  ```

- **Reset node_modules**: If dependencies are corrupted:
  ```bash
  rm -rf node_modules
  npm install
  ```

- **iOS Build Issues**: Ensure Xcode command line tools are installed:
  ```bash
  xcode-select --install
  ```

- **Android Build Issues**: Ensure Android SDK and Java are properly configured in your environment.

ARCHITECTURE:

This structure follows Belong's mobile app architecture patterns:

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/
│   │   ├── index.tsx       # Home screen with challenge list
│   │   ├── profile.tsx     # Profile with user progress
│   │   └── _layout.tsx     # Tab navigation setup
│   ├── (modals)/
│   │   ├── challenge-detail.tsx  # Challenge detail modal
│   │   ├── player.tsx      # Full-screen audio player
│   │   └── _layout.tsx     # Modal navigation setup
│   └── _layout.tsx         # Root layout
├── components/
│   ├── ui/                 # Glass design system components
│   │   ├── AudioVisualizer.tsx
│   │   ├── CompletionModal.tsx
│   │   ├── GlassCard.tsx
│   │   └── GradientBackground.tsx
│   ├── challenge/          # Challenge-specific components
│   │   ├── ChallengeCard.tsx
│   │   └── ChallengeCarousel.tsx
│   └── ErrorBoundary.tsx   # Error boundary component
├── hooks/                  # Business logic hooks
│   ├── useChallenges.ts
│   ├── useMusicPlayer.ts
│   └── usePointsCounter.ts
├── stores/                 # Zustand stores
│   ├── musicStore.ts
│   └── userStore.ts
├── services/               # External services
│   ├── audioService.ts
│   └── playbackService.ts
├── constants/              # Theme and configuration
│   └── theme.ts
└── types/                  # TypeScript definitions
    └── index.ts
```

## Known Issues or Limitations

### Audio Playback

- **react-native-track-player Patch Required**: A patch file (`react-native-track-player+4.1.2.patch`) is applied to fix null pointer issues in the Android implementation. This patch is automatically applied during `npm install` via the `postinstall` script.
- **Background Playback**: Background audio playback may require additional native configuration for production builds. Ensure proper audio session configuration for iOS and Android.
- **Audio Interruptions**: Phone calls and other system audio interruptions may pause playback. The app should handle these scenarios gracefully, but recovery may vary by platform.
- **Network Dependencies**: Audio files are loaded from remote URLs. Poor network connectivity may cause playback failures or delays. Consider implementing retry logic and offline caching for production use.
- **iOS Simulator Limitations**: Audio playback may not work reliably in the iOS Simulator. Testing on a physical device is recommended for accurate audio functionality.

### Platform-Specific Issues

- **iOS Requirements**: Requires Xcode and iOS development environment (macOS only). Native builds require Apple Developer account for device testing.
- **Android Requirements**: Requires Android Studio and Android SDK setup. Native builds may require additional Gradle configuration.
- **Expo Go Limitations**: Some native modules, particularly `react-native-track-player`, may have limited functionality or require custom development builds. Full audio features may not work in Expo Go.
- **Web Platform**: Audio playback through `react-native-track-player` is not supported on web. The `npm run web` command may not function correctly with audio features.

### Dependencies & Compatibility

- **React 19.1.0**: This is a very new version of React. Some third-party libraries may not have full compatibility yet. The package.json includes an `overrides` field to ensure React 19.1.0 is used consistently.
- **React Native 0.81.4**: Some Expo packages may have compatibility constraints with this React Native version. Ensure all Expo dependencies are compatible with the SDK version.
- **TypeScript Strictness**: The codebase uses TypeScript, but some type definitions may need refinement. Ensure strict mode is enabled for production builds.

### State Management & Persistence

- **AsyncStorage Limitations**: AsyncStorage has size limitations (~6MB on iOS, ~10MB on Android). Large amounts of persisted data may cause issues. Consider implementing data cleanup strategies for production.
- **State Persistence**: State persistence relies on AsyncStorage. Clearing app data or reinstalling the app will reset all user progress and points.
- **Concurrent Updates**: Multiple rapid state updates may cause race conditions. Ensure proper synchronization in Zustand stores.

### Performance Considerations

- **Large Track Lists**: Rendering hundreds of challenge cards may impact performance. Consider implementing virtualization or pagination for large lists.
- **Memory Management**: Long-running audio playback sessions may consume significant memory. Ensure proper cleanup of audio resources when switching tracks or closing the app.
- **Blur Effects**: The glass design system uses `expo-blur` which may impact performance on lower-end devices, especially with multiple blur components rendered simultaneously.

### Development Environment

- **Metro Bundler Cache**: First-time builds may take several minutes. Subsequent builds should be faster, but cache issues may require clearing Metro cache.
- **Patch Package**: The `patch-package` dependency requires the patch file to be maintained. If `react-native-track-player` is updated, the patch may need to be reapplied or updated.
- **Build Times**: Native iOS and Android builds can take 5-10+ minutes depending on your machine. Use Expo Go for faster development iteration.

### Feature Limitations

- **Offline Mode**: The app currently requires network connectivity to load audio tracks. Offline playback is not implemented.
- **Audio Visualization**: Basic audio visualization may be implemented, but advanced spectrum analysis requires additional native modules.
- **Social Features**: No social sharing or user authentication features are included in this assessment app.
- **Analytics**: No analytics or crash reporting is implemented. Error handling is basic and may need enhancement for production.

### Testing Considerations

- **Unit Tests**: No test suite is included. Consider adding Jest and React Native Testing Library tests for critical functionality.
- **E2E Tests**: No end-to-end testing framework is configured. Consider Detox or Maestro for E2E testing.
- **Device Testing**: Thorough testing on both iOS and Android physical devices is recommended before production deployment.

## Technical Assessment Questions & Answers

### Architecture: "Walk me through your state management approach. Why Zustand over Redux?"

**State Management Approach:**

The app uses **Zustand** for state management with a domain-driven architecture:

1. **Domain Separation**: Two separate stores (`musicStore` and `userStore`) handle different concerns:
   - `musicStore`: Manages audio playback state, challenges, and progress tracking
   - `userStore`: Manages user-specific data like total points and completed challenges

2. **Persistence Strategy**: Zustand's `persist` middleware with AsyncStorage:
   - Only persistent data (challenges, user progress) is saved to AsyncStorage
   - Ephemeral state (current playback position, `isPlaying`) is not persisted
   - Uses `partialize` to selectively persist state

3. **Selector Pattern**: Following Belong's pattern, stores export selector functions:
   ```typescript
   useMusicStore((s) => s.challenges) // Efficient re-render only when challenges change
   ```

4. **Custom Hooks Layer**: Business logic is abstracted into hooks (`useMusicPlayer`, `usePointsCounter`, `useChallenges`) that orchestrate store actions and handle side effects.

**Why Zustand over Redux?**

- **Simplicity**: No boilerplate (no actions, reducers, dispatch). Direct state mutations with immutability.
- **Performance**: Fine-grained subscriptions via selectors prevent unnecessary re-renders.
- **Bundle Size**: ~1KB vs Redux's ~8KB+ (with middleware).
- **TypeScript**: Excellent TypeScript support without extra configuration.
- **Persistence**: Built-in middleware for AsyncStorage integration.
- **React Native Fit**: Designed for React/React Native, minimal setup required.
- **Developer Experience**: Less cognitive overhead, easier to reason about for small-to-medium apps.

For this music app's scale, Zustand provides the right balance of simplicity and power without Redux's complexity.

---

### Audio Implementation: "How does react-native-track-player differ from expo-av? What are the tradeoffs?"

**react-native-track-player:**

**Strengths:**
- **Background Playback**: Native background audio support with lock screen controls
- **Queue Management**: Built-in playlist/queue handling
- **Remote Control**: System media controls (lock screen, notification, Control Center)
- **Audio Session Management**: Proper iOS/Android audio session handling
- **Events System**: Comprehensive event handling (playback errors, track changes, queue ended)
- **Production-Ready**: Designed for music apps with advanced features

**Tradeoffs:**
- Requires native code configuration (not Expo Go compatible)
- More complex setup (service registration, native configuration)
- Larger bundle size
- Learning curve for advanced features

**expo-av:**

**Strengths:**
- **Expo Go Compatible**: Works out of the box with Expo Go
- **Simpler API**: Easier to get started
- **Unified API**: Works for audio and video
- **Documentation**: Well-documented Expo ecosystem

**Tradeoffs:**
- **Limited Background Support**: Requires additional configuration for background playback
- **No Queue Management**: Must implement playlist logic manually
- **Limited Lock Screen Controls**: Less comprehensive than TrackPlayer
- **Performance**: May have limitations with long audio files or complex playback scenarios

**Why TrackPlayer for This App:**

For a music rewards app requiring:
- Background playback continuation
- Lock screen controls
- Queue management for challenges
- Professional audio handling

`react-native-track-player` is the better choice despite requiring native builds. It provides the features needed for a production music app.

---

### Performance: "How would you optimize this app for 1000+ tracks and 50+ concurrent users?"

**Client-Side Optimizations:**

1. **Virtualization**: Use `FlatList` with `removeClippedSubviews` for challenge lists:
   ```typescript
   <FlatList
     data={challenges}
     renderItem={renderChallengeCard}
     keyExtractor={(item) => item.id}
     removeClippedSubviews={true}
     maxToRenderPerBatch={10}
     windowSize={5}
     initialNumToRender={10}
   />
   ```

2. **Image Optimization**: 
   - Lazy load challenge images
   - Use thumbnail/preview images initially
   - Implement image caching with `expo-image` or `react-native-fast-image`

3. **Pagination**: Implement infinite scroll or pagination:
   ```typescript
   const [page, setPage] = useState(1);
   const PAGE_SIZE = 20;
   // Load challenges in chunks
   ```

4. **Memoization**: 
   - `React.memo` for expensive components
   - `useMemo` for computed values
   - `useCallback` for event handlers

5. **State Optimization**:
   - Store only essential challenge data in Zustand
   - Use selectors to prevent unnecessary re-renders
   - Implement state normalization (ID-based lookups)

6. **Audio Preloading**: Preload next track in queue, cache frequently played tracks

**Server-Side Optimizations:**

1. **API Pagination**: Return paginated challenge lists
2. **CDN**: Host audio files on CDN with edge caching
3. **Compression**: Compress audio files (AAC/MP3) with appropriate bitrates
4. **Caching Headers**: Set proper cache headers for static assets
5. **GraphQL/Field Selection**: Allow clients to request only needed fields

**Backend Architecture:**

1. **Database Indexing**: Index challenge IDs, user IDs, completion status
2. **Read Replicas**: Use read replicas for challenge queries
3. **Caching Layer**: Redis cache for frequently accessed challenges
4. **Rate Limiting**: Implement rate limiting per user
5. **Background Jobs**: Process points awards asynchronously

**Monitoring:**

- Track render performance with React DevTools Profiler
- Monitor audio playback errors and network failures
- Set up performance budgets (bundle size, memory usage)

---

### Error Handling: "Show me how you handle audio loading failures and network issues."

**Current Implementation:**

```typescript
// In useMusicPlayer hook
const play = useCallback(async (track: MusicChallenge) => {
  try {
    setLoading(true);
    setError(null);
    
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: track.id,
      url: track.audioUrl,
      title: track.title,
      artist: track.artist,
    });
    
    await TrackPlayer.play();
    setCurrentTrack(track);
    setStoreCurrentTrack(track);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Playback failed');
    // Could add retry logic here
  } finally {
    setLoading(false);
  }
}, [setStoreCurrentTrack]);
```

**Enhanced Error Handling Strategy:**

1. **Retry Logic with Exponential Backoff**:
   ```typescript
   const playWithRetry = async (track: MusicChallenge, retries = 3) => {
     for (let i = 0; i < retries; i++) {
       try {
         await playTrack(track);
         return;
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
       }
     }
   };
   ```

2. **Network State Detection**:
   ```typescript
   import NetInfo from '@react-native-community/netinfo';
   
   const checkNetworkAndPlay = async (track: MusicChallenge) => {
     const netInfo = await NetInfo.fetch();
     if (!netInfo.isConnected) {
       setError('No internet connection. Please check your network.');
       return;
     }
     await playWithRetry(track);
   };
   ```

3. **TrackPlayer Event Listeners**:
   ```typescript
   useTrackPlayerEvents([Event.PlaybackError], (event) => {
     if (event.type === Event.PlaybackError) {
       const errorCode = event.code;
       switch (errorCode) {
         case 'network_error':
           setError('Network error. Retrying...');
           retryPlayback();
           break;
         case 'playback_error':
           setError('Playback failed. Try another track.');
           break;
         default:
           setError(`Audio error: ${event.message}`);
       }
     }
   });
   ```

4. **Offline Caching**:
   - Cache successfully played tracks locally
   - Implement download queue for offline playback
   - Show cached indicator in UI

5. **User Feedback**:
   - Display error messages in user-friendly language
   - Provide retry buttons
   - Show network status indicators
   - Fallback to cached content when available

---

### Scaling: "How would you add features like playlists, user accounts, and social sharing?"

**Architecture Evolution:**

1. **Backend API Integration**:
   ```typescript
   // New service layer
   src/services/
     ├── apiService.ts      # HTTP client with auth
     ├── authService.ts     # Authentication
     ├── playlistService.ts # Playlist management
     └── socialService.ts   # Social sharing
   ```

2. **State Management Expansion**:
   ```typescript
   // New stores
   stores/
     ├── authStore.ts       # User authentication state
     ├── playlistStore.ts   # Playlist management
     └── socialStore.ts     # Social interactions
   ```

3. **Authentication Flow**:
   - Implement OAuth2/JWT authentication
   - Add `authStore` for user session management
   - Protected routes with Expo Router
   - Token refresh mechanism

4. **Playlist Feature**:
   ```typescript
   interface Playlist {
     id: string;
     name: string;
     challenges: string[]; // Challenge IDs
     userId: string;
     isPublic: boolean;
   }
   
   // New hook
   usePlaylists() {
     // Create, update, delete playlists
     // Sync with backend
   }
   ```

5. **User Accounts**:
   - Profile screen with user stats
   - Achievement system
   - Settings and preferences
   - Sync across devices via backend

6. **Social Sharing**:
   ```typescript
   // Using expo-sharing
   import * as Sharing from 'expo-sharing';
   
   const shareChallenge = async (challenge: MusicChallenge) => {
     const message = `Check out this challenge: ${challenge.title}!`;
     await Sharing.shareAsync(message);
   };
   ```

**Database Schema (Backend):**

```sql
Users (id, email, username, avatar_url)
Challenges (id, title, artist, audio_url, points)
User_Challenges (user_id, challenge_id, completed_at, points_earned)
Playlists (id, user_id, name, is_public, created_at)
Playlist_Challenges (playlist_id, challenge_id, order)
Social_Shares (id, user_id, challenge_id, platform, shared_at)
```

**API Endpoints:**

- `POST /auth/login` - User authentication
- `GET /users/:id` - User profile
- `GET /playlists` - User playlists
- `POST /playlists` - Create playlist
- `POST /share/challenge` - Share challenge

---

### Testing: "What would be your testing strategy for the audio playback functionality?"

**Testing Pyramid:**

1. **Unit Tests (Jest)**:
   ```typescript
   // useMusicPlayer.test.ts
   describe('useMusicPlayer', () => {
     it('should play track successfully', async () => {
       const track = mockChallenge;
       const { result } = renderHook(() => useMusicPlayer());
       
       await act(async () => {
         await result.current.play(track);
       });
       
       expect(result.current.isPlaying).toBe(true);
       expect(result.current.currentTrack).toBe(track);
     });
     
     it('should handle playback errors', async () => {
       TrackPlayer.play.mockRejectedValue(new Error('Network error'));
       // Test error handling
     });
   });
   ```

2. **Integration Tests**:
   ```typescript
   // Test store + hook integration
   describe('Music Store Integration', () => {
     it('should update store when track plays', async () => {
       // Test Zustand store updates
     });
   });
   ```

3. **Component Tests (React Native Testing Library)**:
   ```typescript
   // PlayerModal.test.tsx
   it('should display current track info', () => {
     render(<PlayerModal />);
     expect(screen.getByText('Track Title')).toBeTruthy();
   });
   ```

4. **E2E Tests (Detox/Maestro)**:
   ```typescript
   // e2e/audio-playback.e2e.ts
   describe('Audio Playback Flow', () => {
     it('should play track and earn points', async () => {
       await element(by.id('challenge-card-1')).tap();
       await element(by.id('play-button')).tap();
       await waitFor(element(by.id('points-counter')))
         .toBeVisible()
         .withTimeout(5000);
     });
   });
   ```

5. **Audio-Specific Testing**:
   - Mock TrackPlayer responses
   - Test error scenarios (network failures, invalid URLs)
   - Test playback state transitions
   - Test points calculation accuracy
   - Test completion detection

**Test Coverage Goals:**
- Critical paths: 90%+
- Audio playback logic: 85%+
- Error handling: 80%+
- Overall: 70%+

---

### Production: "What changes would you make before releasing this to the App Store?"

**Critical Pre-Production Checklist:**

1. **Security**:
   - Remove console.logs and debug code
   - Secure API endpoints (HTTPS only)
   - Implement proper authentication/authorization
   - Add certificate pinning for API calls
   - Obfuscate sensitive code (if needed)

2. **Performance**:
   - Enable Hermes engine (React Native)
   - Optimize bundle size (code splitting, tree shaking)
   - Reduce image sizes and implement lazy loading
   - Add performance monitoring (Firebase Performance, Sentry)
   - Optimize re-renders with React.memo

3. **Error Handling & Monitoring**:
   - Integrate crash reporting (Sentry, Crashlytics)
   - Add error boundaries at route level
   - Implement error logging service
   - Add user-friendly error messages
   - Set up error alerting

4. **Audio Configuration**:
   - Configure iOS audio session properly (Info.plist)
   - Set Android audio focus settings
   - Test background playback thoroughly
   - Handle audio interruptions (calls, alarms)
   - Configure lock screen controls

5. **State Management**:
   - Add state migration for AsyncStorage
   - Implement state recovery on app crash
   - Add state versioning
   - Handle storage quota exceeded errors

6. **UI/UX Polish**:
   - Add loading skeletons
   - Implement proper error states
   - Add empty states
   - Optimize animations (60fps)
   - Test on multiple device sizes
   - Accessibility improvements (VoiceOver, TalkBack)

7. **App Store Requirements**:
   - Privacy policy and terms of service
   - App Store screenshots and descriptions
   - Age rating configuration
   - App icons and launch screens
   - App Store Connect metadata

8. **Analytics**:
   - Add analytics (Firebase Analytics, Mixpanel)
   - Track key user events
   - Monitor audio playback metrics
   - Track errors and crashes

9. **Testing**:
   - Internal testing (TestFlight, Internal Testing)
   - Beta testing with real users
   - Performance testing on low-end devices
   - Battery consumption testing
   - Network condition testing (3G, offline)

10. **Documentation**:
    - Update README with production setup
    - Document environment variables
    - Create runbooks for common issues
    - API documentation

---

### Memory Management: "How do you prevent memory leaks with audio playback and long-running timers?"

**Audio Playback Memory Management:**

1. **TrackPlayer Cleanup**:
   ```typescript
   useEffect(() => {
     return () => {
       // Cleanup on unmount
       TrackPlayer.reset().catch(console.error);
     };
   }, []);
   ```

2. **Event Listener Cleanup**:
   ```typescript
   useEffect(() => {
     const subscription = TrackPlayer.addEventListener(Event.PlaybackState, handler);
     return () => {
       subscription.remove();
     };
   }, []);
   ```

3. **State Cleanup**:
   ```typescript
   // In useMusicPlayer hook
   useEffect(() => {
     return () => {
       // Clear refs
       pointsAwardedRef.current = null;
       completionTriggeredRef.current = null;
       // Reset state
       setError(null);
       setLoading(false);
     };
   }, []);
   ```

**Timer Management:**

1. **useRef for Timers**:
   ```typescript
   const intervalRef = useRef<NodeJS.Timeout>();
   
   useEffect(() => {
     intervalRef.current = setInterval(() => {
       // Update progress
     }, 1000);
     
     return () => {
       if (intervalRef.current) {
         clearInterval(intervalRef.current);
       }
     };
   }, []);
   ```

2. **TrackPlayer Progress Hook** (Better than manual timers):
   ```typescript
   // Use TrackPlayer's built-in useProgress hook
   // No manual timer needed - TrackPlayer handles this
   const progress = useProgress();
   ```

**Component Memory Management:**

1. **Unmount Cleanup**:
   ```typescript
   useEffect(() => {
     return () => {
       // Cancel pending requests
       // Clear subscriptions
       // Reset state
     };
   }, []);
   ```

2. **Conditional Subscriptions**:
   ```typescript
   useEffect(() => {
     if (!isActive) return;
     
     const subscription = subscribe();
     return () => subscription.unsubscribe();
   }, [isActive]);
   ```

**Store Cleanup:**

1. **Selective Persistence**: Only persist necessary data:
   ```typescript
   partialize: (state) => ({
     challenges: state.challenges,
     // Don't persist playback state
   })
   ```

2. **Memory Monitoring**:
   ```typescript
   // Monitor memory usage in development
   if (__DEV__) {
     const memory = performance.memory;
     console.log('Memory usage:', memory.usedJSHeapSize);
   }
   ```

**Best Practices:**

- Use `useEffect` cleanup functions religiously
- Avoid creating timers/intervals in render functions
- Use TrackPlayer's built-in hooks instead of manual timers
- Clear all refs on unmount
- Cancel pending async operations
- Use `AbortController` for fetch requests
- Implement proper error boundaries to prevent memory leaks from crashes
