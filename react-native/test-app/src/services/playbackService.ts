// Playback service for react-native-track-player
// This file handles background playback events and audio interruptions
import TrackPlayer, { Event, State } from 'react-native-track-player';

export default async function playbackService() {
  // This service needs to be registered in order for the TrackPlayer to work
  // when the app is in the background
  
  // Remote control events
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    TrackPlayer.seekTo(event.position);
  });

  // Audio interruption handling - when another app takes audio focus
  TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
    // Handle state changes (e.g., when phone call interrupts)
    if (event.state === State.Connecting || event.state === State.Buffering) {
      // Track is loading/buffering
      console.log('Playback state:', event.state);
    }
  });

  // Handle audio session interruptions (phone calls, other apps)
  TrackPlayer.addEventListener(Event.RemoteJumpForward, () => {
    // Handle jump forward from lock screen/notification
    TrackPlayer.seekBy(10);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, () => {
    // Handle jump backward from lock screen/notification
    TrackPlayer.seekBy(-10);
  });

  // Handle playback queue ended
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
    console.log('Playback queue ended:', event);
    // Optionally reset player state when queue ends
  });

  // Handle playback track changed (useful for queue management)
  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (event) => {
    console.log('Track changed:', event);
  });

  // Handle playback errors with recovery
  TrackPlayer.addEventListener(Event.PlaybackError, async (event) => {
    console.error('Playback error:', event);
    
    // Attempt to recover from error
    try {
      // Reset player on critical errors
      if (event.code === 'playback-source' || event.code === 'playback-queue') {
        await TrackPlayer.reset();
      }
    } catch (recoveryError) {
      console.error('Error recovery failed:', recoveryError);
    }
  });
}

// Also export as module.exports for compatibility
module.exports = playbackService;