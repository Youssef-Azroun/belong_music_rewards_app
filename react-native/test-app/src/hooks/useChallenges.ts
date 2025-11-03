// useChallenges hook - Challenge management logic following Belong patterns
import { useState, useCallback, useEffect } from 'react';
import { useMusicStore, selectChallenges } from '../stores/musicStore';
import { useUserStore, selectCompletedChallenges } from '../stores/userStore';
import type { UseChallengesReturn } from '../types';
import { SAMPLE_CHALLENGES } from '../constants/theme';

export const useChallenges = (): UseChallengesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use selector pattern: useStore(s => s.specificProperty)
  const challenges = useMusicStore(selectChallenges);
  const completedChallenges = useUserStore(selectCompletedChallenges);
  
  const loadChallenges = useMusicStore((state) => state.loadChallenges);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const completeChallenge = useUserStore((state) => state.completeChallenge);
  const addPoints = useUserStore((state) => state.addPoints);

  const refreshChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - in real app, this would fetch from backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Reload challenges from store
      loadChallenges();
      
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh challenges';
      setError(errorMessage);
      setLoading(false);
      console.error('Error refreshing challenges:', err);
    }
  }, [loadChallenges]);

  const completeChallengeAction = useCallback(async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Find the challenge
      const challenge = challenges.find((c) => c.id === challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Check if already completed
      if (completedChallenges.includes(challengeId)) {
        setLoading(false);
        return;
      }

      // Mark as complete in music store
      markChallengeComplete(challengeId);
      
      // Update user store
      completeChallenge(challengeId);
      
      // Add points
      addPoints(challenge.points);

      // Simulate API call - in real app, this would sync with backend
      await new Promise((resolve) => setTimeout(resolve, 300));

      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete challenge';
      setError(errorMessage);
      setLoading(false);
      console.error('Error completing challenge:', err);
    }
  }, [challenges, completedChallenges, markChallengeComplete, completeChallenge, addPoints]);

  // Load challenges on mount
  useEffect(() => {
    if (challenges.length === 0) {
      loadChallenges();
    }
  }, []);

  return {
    challenges,
    completedChallenges,
    loading,
    error,
    refreshChallenges,
    completeChallenge: completeChallengeAction,
  };
};

