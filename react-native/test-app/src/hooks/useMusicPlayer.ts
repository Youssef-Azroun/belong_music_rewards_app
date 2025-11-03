// useMusicPlayer hook - Audio hook implementation following exact specification
import { useCallback, useEffect, useState, useRef } from 'react';
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import { useMusicStore, selectCurrentTrack, selectIsPlaying } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import type { MusicChallenge, UseMusicPlayerReturn } from '../types';

export const useMusicPlayer = (): UseMusicPlayerReturn => {
  // TrackPlayer hooks - matching specification
  const playbackState = usePlaybackState();
  const progress = useProgress();
  
  // Local state - matching specification exactly
  const [currentTrack, setCurrentTrack] = useState<MusicChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Ref to track if points have been awarded for current track to prevent duplicates
  const pointsAwardedRef = useRef<string | null>(null);
  const completionTriggeredRef = useRef<string | null>(null);
  
  // Zustand store selectors for state synchronization
  const storeCurrentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const setStoreCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);
  const setCurrentPosition = useMusicStore((state) => state.setCurrentPosition);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const addPoints = useUserStore((state) => state.addPoints);
  const completeChallenge = useUserStore((state) => state.completeChallenge);
  const completedChallenges = useUserStore((state) => state.completedChallenges);
  
  // Sync local state with Zustand store
  useEffect(() => {
    if (storeCurrentTrack) {
      setCurrentTrack(storeCurrentTrack);
      // Reset completion state when track changes
      setIsCompleted(false);
      // Reset points awarded ref when track changes
      if (pointsAwardedRef.current !== storeCurrentTrack.id) {
        pointsAwardedRef.current = null;
        completionTriggeredRef.current = null;
      }
    } else {
      setIsCompleted(false);
      completionTriggeredRef.current = null;
    }
  }, [storeCurrentTrack]);

  // Track playback state changes
  useEffect(() => {
    // Some versions of usePlaybackState may return an object, so extract value if needed
    let stateValue: any = playbackState;
    if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
      stateValue = playbackState.state;
    }
    const isCurrentlyPlaying = stateValue === State.Playing;
    if (isCurrentlyPlaying !== isPlaying) {
      setIsPlaying(isCurrentlyPlaying);
    }
  }, [playbackState, isPlaying, setIsPlaying]);

  // Update position and calculate progress - Fixed to prevent duplicate point awards
  useEffect(() => {
    if (currentTrack && progress.position > 0 && progress.duration > 0) {
      setCurrentPosition(progress.position);
      
      // Calculate progress percentage
      const progressPercentage = (progress.position / progress.duration) * 100;
      updateProgress(currentTrack.id, Math.min(progressPercentage, 100));
    }
  }, [progress.position, progress.duration, currentTrack, setCurrentPosition, updateProgress]);

  // Handle track completion - Only trigger when song is truly at 100% or ended
  useEffect(() => {
    if (!currentTrack || !progress.duration || progress.duration === 0) return;
    
    const progressPercentage = (progress.position / progress.duration) * 100;
    const timeRemaining = progress.duration - progress.position;
    
    // Only complete when song is at 100% or within 0.5 seconds of end (essentially done)
    const completionThreshold = 100;
    const timeThreshold = 0.5; // seconds - very tight threshold
    
    // Check if truly completed (at 100% or essentially at the end)
    const isComplete = progressPercentage >= completionThreshold || (timeRemaining <= timeThreshold && progressPercentage >= 99.5);
    const alreadyTriggered = completionTriggeredRef.current === currentTrack.id;
    
    // Only trigger completion once per track when truly finished
    if (isComplete && !alreadyTriggered) {
      completionTriggeredRef.current = currentTrack.id;
      setIsCompleted(true);
      
      // Award points only once when song actually completes
      const alreadyAwarded = pointsAwardedRef.current === currentTrack.id;
      const isAlreadyCompleted = completedChallenges.includes(currentTrack.id);
      
      if (!alreadyAwarded && !isAlreadyCompleted) {
        pointsAwardedRef.current = currentTrack.id;
        addPoints(currentTrack.points);
        markChallengeComplete(currentTrack.id);
        completeChallenge(currentTrack.id);
      }
    }
  }, [progress.position, progress.duration, currentTrack, completedChallenges, addPoints, markChallengeComplete, completeChallenge]);

  // Handle track player events
  useTrackPlayerEvents(
    [Event.PlaybackError, Event.PlaybackTrackChanged, Event.PlaybackQueueEnded],
    (event) => {
      if (event.type === Event.PlaybackError) {
        setError(`Playback error: ${event.message}`);
        setLoading(false);
      }
      
      // Handle when playback queue ends (song finished)
      if (event.type === Event.PlaybackQueueEnded && currentTrack) {
        const alreadyTriggered = completionTriggeredRef.current === currentTrack.id;
        if (!alreadyTriggered) {
          completionTriggeredRef.current = currentTrack.id;
          setIsCompleted(true);
          
          // Award points only once when song actually completes
          const alreadyAwarded = pointsAwardedRef.current === currentTrack.id;
          const isAlreadyCompleted = completedChallenges.includes(currentTrack.id);
          
          if (!alreadyAwarded && !isAlreadyCompleted) {
            pointsAwardedRef.current = currentTrack.id;
            addPoints(currentTrack.points);
            markChallengeComplete(currentTrack.id);
            completeChallenge(currentTrack.id);
          }
        }
      }
      
      // Reset points awarded ref and completion when track changes
      if (event.type === Event.PlaybackTrackChanged) {
        pointsAwardedRef.current = null;
        completionTriggeredRef.current = null;
        setIsCompleted(false);
      }
    }
  );

  // Play method - matching exact specification pattern
  const play = useCallback(async (track: MusicChallenge) => {
    try {
      setLoading(true);
      setError(null);
      
      // Reset points awarded ref and completion when starting a new track
      pointsAwardedRef.current = null;
      completionTriggeredRef.current = null;
      setIsCompleted(false);
      
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.audioUrl,
        title: track.title,
        artist: track.artist,
      });
      
      await TrackPlayer.play();
      setCurrentTrack(track);
      setStoreCurrentTrack(track); // Sync with Zustand
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Playback failed');
    } finally {
      setLoading(false);
    }
  }, [setStoreCurrentTrack]);

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
    } catch (err) {
      console.error('Pause error:', err);
    }
  }, []);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
    }
  }, []);

  const resume = useCallback(async () => {
    try {
      await TrackPlayer.play();
    } catch (err) {
      console.error('Resume error:', err);
    }
  }, []);

  // Return matching exact specification
  // Handle playbackState which may be State enum or object
  let playbackStateValue: State;
  if (typeof playbackState === 'object' && playbackState !== null && 'state' in playbackState) {
    playbackStateValue = (playbackState as any).state;
  } else {
    playbackStateValue = playbackState as State;
  }

  return {
    isPlaying: playbackStateValue === State.Playing,
    currentTrack,
    currentPosition: progress.position,
    duration: progress.duration,
    play,
    pause,
    seekTo,
    resume,
    loading,
    error,
    isCompleted,
    resetCompletion: () => {
      setIsCompleted(false);
      completionTriggeredRef.current = null;
    },
  };
};