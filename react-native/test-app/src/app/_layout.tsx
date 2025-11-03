// Root layout for Expo Router
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import { setupTrackPlayer, cleanupTrackPlayer } from '../services/audioService';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  useEffect(() => {
    // Register the playback service first
    TrackPlayer.registerPlaybackService(() => require('../services/playbackService'));
    
    // Then initialize TrackPlayer when app starts
    setupTrackPlayer().catch((error) => {
      console.error('Failed to setup TrackPlayer:', error);
    });

    // Cleanup on unmount
    return () => {
      cleanupTrackPlayer().catch((error) => {
        console.error('Cleanup error:', error);
      });
    };
  }, []);

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(modals)" 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
}