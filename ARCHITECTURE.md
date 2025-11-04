# Architecture Documentation

This document outlines the architectural decisions, patterns, and structure of the MusicRewards React Native application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [Layer Architecture](#layer-architecture)
5. [State Management](#state-management)
6. [Component Architecture](#component-architecture)
7. [Data Flow](#data-flow)
8. [File Structure](#file-structure)
9. [Design Patterns](#design-patterns)
10. [Key Design Decisions](#key-design-decisions)

---

## Overview

The MusicRewards app follows a **layered architecture** with clear separation of concerns:

- **Presentation Layer**: React Native components and screens
- **Business Logic Layer**: Custom hooks that orchestrate state and side effects
- **State Management Layer**: Zustand stores for global state
- **Service Layer**: External service integrations (audio playback, API calls)
- **Data Persistence Layer**: AsyncStorage for local state persistence

The architecture emphasizes:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Reusability**: Components and hooks are designed to be reusable
- **Testability**: Business logic is separated from UI, making it easier to test
- **Maintainability**: Clear structure makes the codebase easy to navigate and modify

---

## Architecture Principles

### 1. Domain-Driven Design
The application is organized around domains:
- **Music Domain**: Challenges, tracks, playback state
- **User Domain**: Points, progress, completed challenges

Each domain has its own store and related hooks.

### 2. Unidirectional Data Flow
Data flows in one direction:
```
User Action → Hook → Store → Component Re-render
```

### 3. Container/Presenter Pattern
- **Containers** (Hooks): Handle business logic and state management
- **Presenters** (Components): Focus solely on rendering UI

### 4. Composition over Inheritance
Components are built through composition, making them flexible and reusable.

---

## Technology Stack

### Core Framework
- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain and runtime
- **TypeScript**: Type-safe JavaScript

### Navigation
- **Expo Router**: File-based routing system
  - Uses React Navigation under the hood
  - Supports tab navigation and modals
  - Type-safe navigation with typed routes

### State Management
- **Zustand**: Lightweight state management library
  - Minimal boilerplate
  - Built-in persistence middleware
  - Fine-grained subscriptions

### Audio Playback
- **react-native-track-player**: Professional audio playback library
  - Background playback support
  - Lock screen controls
  - Queue management
  - Event system

### Persistence
- **AsyncStorage**: Key-value storage for React Native
  - Used via Zustand's persist middleware
  - Stores user progress and challenge data

### Styling
- **StyleSheet**: React Native's built-in styling
- **expo-blur**: Glass morphism effects
- **expo-linear-gradient**: Gradient backgrounds

---

## Layer Architecture

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (Components, Screens, UI)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Business Logic Layer           │
│  (Custom Hooks: useMusicPlayer,     │
│   usePointsCounter, useChallenges)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      State Management Layer         │
│  (Zustand Stores: musicStore,       │
│   userStore)                         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│  (audioService, playbackService)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Persistence Layer               │
│  (AsyncStorage via Zustand)         │
└──────────────────────────────────────┘
```

### Layer Responsibilities

**Presentation Layer** (`components/`, `app/`)
- Renders UI components
- Handles user interactions
- Receives data via props and hooks
- No business logic

**Business Logic Layer** (`hooks/`)
- Orchestrates state updates
- Handles side effects (API calls, audio playback)
- Manages component lifecycle
- Coordinates between stores and services

**State Management Layer** (`stores/`)
- Stores application state
- Provides actions to modify state
- Handles persistence logic
- Exposes selectors for efficient subscriptions

**Service Layer** (`services/`)
- Abstracts external service integrations
- Handles audio playback setup and configuration
- Manages TrackPlayer lifecycle
- Provides service-specific error handling

**Persistence Layer** (AsyncStorage)
- Persists user data across app restarts
- Handles state hydration on app start
- Manages storage quotas and errors

---

## State Management

### Zustand Stores

#### MusicStore (`stores/musicStore.ts`)
Manages music-related state:

```typescript
interface MusicStore {
  // State
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  currentPosition: number;
  
  // Actions
  loadChallenges: () => void;
  setCurrentTrack: (track: MusicChallenge) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
}
```

**Persistence Strategy:**
- Only `challenges` array is persisted (using `partialize`)
- Ephemeral state (`currentTrack`, `isPlaying`, `currentPosition`) is not persisted

#### UserStore (`stores/userStore.ts`)
Manages user-related state:

```typescript
interface UserStore {
  // State
  totalPoints: number;
  completedChallenges: string[];
  
  // Actions
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  resetProgress: () => void;
}
```

**Persistence Strategy:**
- All state is persisted for user progress tracking

### Selector Pattern

Stores use selectors to prevent unnecessary re-renders:

```typescript
// Component only re-renders when challenges change
const challenges = useMusicStore((s) => s.challenges);

// Component only re-renders when isPlaying changes
const isPlaying = useMusicStore((s) => s.isPlaying);
```

### Store Actions

Actions follow a consistent pattern:
1. **Pure functions**: No side effects in actions
2. **Immutability**: State updates create new objects
3. **Type safety**: All actions are fully typed

---

## Component Architecture

### Component Hierarchy

```
App Root
├── RootLayout (_layout.tsx)
│   ├── Tabs Layout (_layout.tsx)
│   │   ├── Home Screen (index.tsx)
│   │   │   ├── ChallengeCarousel
│   │   │   │   └── ChallengeCard[]
│   │   │   └── GlassCard
│   │   └── Profile Screen (profile.tsx)
│   └── Modals Layout (_layout.tsx)
│       ├── Player Modal (player.tsx)
│       │   ├── AudioVisualizer
│       │   ├── ProgressBar
│       │   └── PlaybackControls
│       └── Challenge Detail Modal (challenge-detail.tsx)
```

### Component Types

#### 1. Screen Components (`app/`)
- Top-level route components
- Handle navigation and layout
- Compose feature components
- Use hooks for business logic

#### 2. Feature Components (`components/challenge/`)
- Domain-specific components
- May use multiple hooks
- Handle complex interactions
- Examples: `ChallengeCard`, `ChallengeCarousel`

#### 3. UI Components (`components/ui/`)
- Reusable, generic components
- No business logic
- Accept props for configuration
- Examples: `GlassCard`, `GlassButton`, `AudioVisualizer`

#### 4. Layout Components (`app/_layout.tsx`)
- Navigation structure
- Theme providers
- Global state initialization

### Component Patterns

#### Glass Design System
Components use a consistent glass morphism design:
- Blur effects via `expo-blur`
- Gradient borders
- Consistent spacing and typography
- Belong brand colors

#### Composition Pattern
Components are composed from smaller pieces:
```typescript
<GlassCard>
  <ChallengeCard challenge={challenge} />
</GlassCard>
```

---

## Data Flow

### Playing a Track

```
1. User taps play button
   ↓
2. Component calls hook: useMusicPlayer().play(track)
   ↓
3. Hook updates loading state
   ↓
4. Hook calls audioService: TrackPlayer.add(), TrackPlayer.play()
   ↓
5. TrackPlayer emits events
   ↓
6. Hook listens to progress updates via useProgress()
   ↓
7. Hook updates musicStore: setCurrentTrack(), updateProgress()
   ↓
8. Hook updates userStore: addPoints() (on completion)
   ↓
9. Components re-render via Zustand subscriptions
   ↓
10. UI reflects new state
```

### Loading Challenges

```
1. App starts / Screen mounts
   ↓
2. Component calls useChallenges()
   ↓
3. Hook checks musicStore for existing challenges
   ↓
4. If empty, hook calls musicStore.loadChallenges()
   ↓
5. Store loads from AsyncStorage (if persisted)
   ↓
6. Store updates state with challenges
   ↓
7. Component receives challenges via selector
   ↓
8. Component renders ChallengeCard components
```

### Points Counter

```
1. Audio plays (via TrackPlayer)
   ↓
2. useProgress() hook receives position updates
   ↓
3. usePointsCounter calculates progress percentage
   ↓
4. Hook calculates points earned based on progress
   ↓
5. Hook updates local state: currentPoints
   ↓
6. Component displays animated counter
   ↓
7. On completion (100%), hook calls userStore.addPoints()
   ↓
8. Points persisted to AsyncStorage
```

---

## File Structure

```
src/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx            # Home screen
│   │   ├── profile.tsx          # Profile screen
│   │   └── _layout.tsx          # Tab layout config
│   ├── (modals)/                # Modal navigation group
│   │   ├── player.tsx          # Audio player modal
│   │   ├── challenge-detail.tsx # Challenge detail modal
│   │   └── _layout.tsx         # Modal layout config
│   └── _layout.tsx              # Root layout
│
├── components/                  # React components
│   ├── ui/                     # Reusable UI components
│   │   ├── AudioVisualizer.tsx
│   │   ├── CompletionModal.tsx
│   │   ├── GlassCard.tsx
│   │   └── GradientBackground.tsx
│   ├── challenge/              # Challenge-specific components
│   │   ├── ChallengeCard.tsx
│   │   └── ChallengeCarousel.tsx
│   └── ErrorBoundary.tsx       # Error boundary component
│
├── hooks/                      # Custom React hooks
│   ├── useChallenges.ts        # Challenge management logic
│   ├── useMusicPlayer.ts      # Audio playback logic
│   └── usePointsCounter.ts    # Points calculation logic
│
├── stores/                     # Zustand stores
│   ├── musicStore.ts          # Music/audio state
│   └── userStore.ts           # User state
│
├── services/                   # External service integrations
│   ├── audioService.ts        # TrackPlayer setup & utilities
│   └── playbackService.ts     # TrackPlayer service worker
│
├── constants/                 # Constants and configuration
│   └── theme.ts               # Design tokens, colors, sample data
│
└── types/                     # TypeScript type definitions
    └── index.ts              # Shared interfaces and types
```

### Naming Conventions

- **Components**: PascalCase (`ChallengeCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMusicPlayer.ts`)
- **Stores**: camelCase with `Store` suffix (`musicStore.ts`)
- **Services**: camelCase with `Service` suffix (`audioService.ts`)
- **Types**: PascalCase (`MusicChallenge`, `UseMusicPlayerReturn`)

---

## Design Patterns

### 1. Custom Hooks Pattern
Business logic is encapsulated in custom hooks:

```typescript
// Hook encapsulates all audio playback logic
const { play, pause, isPlaying, currentTrack } = useMusicPlayer();

// Component only uses the hook's API
<Button onPress={() => play(track)}>Play</Button>
```

**Benefits:**
- Separation of concerns
- Reusability
- Testability
- Clean component code

### 2. Selector Pattern
Stores expose selectors for efficient subscriptions:

```typescript
// Only re-renders when challenges change
const challenges = useMusicStore((s) => s.challenges);

// Only re-renders when isPlaying changes
const isPlaying = useMusicStore((s) => s.isPlaying);
```

**Benefits:**
- Prevents unnecessary re-renders
- Better performance
- Explicit dependencies

### 3. Service Abstraction Pattern
External services are abstracted behind service files:

```typescript
// audioService.ts abstracts TrackPlayer API
import { playTrack, pauseTrack } from '../services/audioService';
```

**Benefits:**
- Easy to swap implementations
- Centralized error handling
- Consistent API across app

### 4. Partial Persistence Pattern
Only relevant state is persisted:

```typescript
partialize: (state) => ({
  challenges: state.challenges,
  // currentTrack, isPlaying NOT persisted
})
```

**Benefits:**
- Faster app startup
- Smaller storage footprint
- Fresh state on app start

### 5. Error Boundary Pattern
Error boundaries catch component errors:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Benefits:**
- Prevents app crashes
- Graceful error handling
- Better user experience

---

## Key Design Decisions

### 1. Why Zustand over Redux?

**Decision**: Use Zustand for state management

**Rationale**:
- **Simplicity**: Less boilerplate than Redux
- **Performance**: Fine-grained subscriptions prevent unnecessary re-renders
- **Bundle Size**: ~1KB vs Redux's ~8KB+
- **TypeScript**: Excellent support without configuration
- **Persistence**: Built-in AsyncStorage middleware

**Trade-offs**:
- Less ecosystem than Redux
- No DevTools (though third-party tools exist)
- Smaller community

### 2. Why react-native-track-player over expo-av?

**Decision**: Use react-native-track-player for audio playback

**Rationale**:
- **Background Playback**: Native support for background audio
- **Lock Screen Controls**: System media controls integration
- **Queue Management**: Built-in playlist handling
- **Production-Ready**: Designed for music apps

**Trade-offs**:
- Requires native builds (not Expo Go compatible)
- More complex setup
- Larger bundle size

### 3. Why Custom Hooks over Direct Store Access?

**Decision**: Components use hooks, not direct store access

**Rationale**:
- **Encapsulation**: Business logic hidden from components
- **Testability**: Easier to test hooks in isolation
- **Reusability**: Hooks can be shared across components
- **Side Effects**: Hooks handle async operations and side effects

**Trade-offs**:
- Additional abstraction layer
- More files to maintain

### 4. Why Expo Router over React Navigation?

**Decision**: Use Expo Router for navigation

**Rationale**:
- **File-Based Routing**: Familiar web-like routing
- **Type Safety**: Typed routes with TypeScript
- **Code Splitting**: Automatic route-based code splitting
- **Deep Linking**: Built-in support

**Trade-offs**:
- Less flexible than React Navigation
- Newer library (less mature)

### 5. Why Domain Separation?

**Decision**: Separate stores by domain (musicStore, userStore)

**Rationale**:
- **Clarity**: Clear boundaries between concerns
- **Maintainability**: Easier to find and modify code
- **Scalability**: Easy to add new domains
- **Testability**: Easier to test isolated domains

**Trade-offs**:
- More stores to manage
- Potential state synchronization issues

### 6. Why Selective Persistence?

**Decision**: Only persist essential data, not ephemeral state

**Rationale**:
- **Performance**: Faster app startup
- **Storage**: Smaller storage footprint
- **Fresh State**: Ephemeral state resets on app start (desired behavior)

**Trade-offs**:
- User loses playback position on app restart
- May need to reinitialize some state

---

## Future Considerations

### Potential Improvements

1. **Offline Support**
   - Cache audio files locally
   - Implement download queue
   - Sync when online

2. **State Migration**
   - Version state schema
   - Handle migrations when schema changes
   - Graceful degradation

3. **Error Recovery**
   - Retry logic for failed operations
   - Offline queue for failed actions
   - Better error messaging

4. **Performance Optimization**
   - Virtualize long lists
   - Lazy load images
   - Memoize expensive computations

5. **Testing**
   - Unit tests for hooks
   - Integration tests for stores
   - E2E tests for critical flows

---

## Conclusion

This architecture provides a solid foundation for the MusicRewards app:

- **Clear separation of concerns** via layered architecture
- **Maintainable codebase** through consistent patterns
- **Scalable structure** that can grow with the app
- **Performance optimized** via selectors and selective persistence
- **Type-safe** with TypeScript throughout

The architecture balances simplicity with functionality, making it suitable for both the current assessment scope and future production development.

