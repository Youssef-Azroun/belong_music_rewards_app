// usePointsCounter hook - Points counter logic matching exact specification
import { useState, useCallback, useEffect, useRef } from 'react';
import { useProgress } from 'react-native-track-player';
import type { UsePointsCounterReturn, PointsCounterConfig } from '../types';

export const usePointsCounter = (): UsePointsCounterReturn => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<PointsCounterConfig | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const progress = useProgress();

  const startCounting = useCallback((newConfig: PointsCounterConfig) => {
    setConfig(newConfig);
    setIsActive(true);
    setCurrentPoints(0);
    setPointsEarned(0);
  }, []);

  const stopCounting = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Calculate points based on progress - matching exact specification
  useEffect(() => {
    if (!isActive || !config) return;

    const progressPercentage = (progress.position / progress.duration) * 100;
    const earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints);

    if (earnedPoints > pointsEarned) {
      setPointsEarned(earnedPoints);
      setCurrentPoints(earnedPoints);
    }
  }, [progress.position, progress.duration, isActive, config, pointsEarned]);

  return {
    currentPoints,
    pointsEarned,
    progress: config ? (progress.position / progress.duration) * 100 : 0,
    isActive,
    startCounting,
    stopCounting,
    resetProgress: () => {
      setCurrentPoints(0);
      setPointsEarned(0);
    },
  };
};

