// ChallengeCard component - Individual challenge display
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Card width will be determined by parent container in carousel mode
const CARD_WIDTH = SCREEN_WIDTH - (THEME.spacing.md * 4);

interface ChallengeCardProps {
  challenge: MusicChallenge;
  onPlay: (challenge: MusicChallenge) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPlay,
  isCurrentTrack = false,
  isPlaying = false,
}) => {
  // Animated values for game-like effects
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  // Check if challenge is 100% completed
  const isCompleted = challenge.completed || challenge.progress >= 100;

  useEffect(() => {
    if (isCompleted) {
      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Shimmer effect
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    } else {
      // Reset animations when not completed
      glowAnimation.setValue(0);
      shimmerAnimation.setValue(0);
    }
  }, [isCompleted]);

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  // Shimmer animation: travels from completely off-screen left to completely off-screen right
  const shimmerTranslateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH - 100, CARD_WIDTH + 100],
  });

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return THEME.colors.secondary;
      case 'medium': return THEME.colors.accent;
      case 'hard': return THEME.colors.primary;
      default: return THEME.colors.text.secondary;
    }
  };

  const getButtonTitle = () => {
    if (challenge.completed) return 'Completed ✓';
    if (isCurrentTrack && isPlaying) return 'Playing...';
    if (isCurrentTrack && !isPlaying) return 'Resume';
    return 'Play Challenge';
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/(modals)/challenge-detail' as any,
      params: { challengeId: challenge.id },
    });
  };

  return (
    <View style={styles.cardWrapper}>
      <GlassCard
          key={`${challenge.id}-${isCompleted}`}
          style={StyleSheet.flatten([
            styles.card,
            isCompleted && styles.currentTrackCard,
            { opacity: 1 } // Explicitly ensure visibility
          ])}
          gradientColors={
            isCompleted
              ? ['rgba(252, 190, 37, 0.7)', 'rgba(117, 83, 219, 0.5)']
              : THEME.glass.gradientColors.card
          }
          borderRadius={THEME.borderRadius.lg}
        >
          {/* Animated glow effect for highlighted card - inside card */}
          {isCompleted && (
            <Animated.View
              style={[
                styles.glowContainer,
                {
                  opacity: glowOpacity,
                },
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[
                  'rgba(252, 190, 37, 0.2)',
                  'rgba(117, 83, 219, 0.15)',
                  'rgba(252, 190, 37, 0.2)',
                ]}
                style={styles.glowGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
          )}

          {/* Corner decorations for game-like UI - inside card */}
          {isCompleted && (
            <>
              <View style={[styles.cornerDecoration, styles.topLeft]} />
              <View style={[styles.cornerDecoration, styles.topRight]} />
              <View style={[styles.cornerDecoration, styles.bottomLeft]} />
              <View style={[styles.cornerDecoration, styles.bottomRight]} />
            </>
          )}

          {/* Shimmer effect overlay */}
          {isCompleted && (
            <Animated.View
              style={[
                styles.shimmerOverlay,
                {
                  transform: [{ translateX: shimmerTranslateX }],
                },
              ]}
              pointerEvents="none"
            >
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(255, 255, 255, 0.2)',
                  'transparent',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          )}
        <View style={styles.cardContent}>
          <TouchableOpacity 
            onPress={handleCardPress} 
            activeOpacity={0.7} 
            style={styles.cardPressArea}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.titleSection}>
                <Text style={[
                  styles.title,
                  isCompleted && styles.activeTitle
                ]}>
                  {challenge.title}
                </Text>
                <Text style={styles.artist}>{challenge.artist}</Text>
              </View>
              <View style={StyleSheet.flatten([
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(challenge.difficulty) }
              ])}>
                <Text style={styles.difficultyText}>
                  {challenge.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={2}>
              {challenge.description}
            </Text>

            {/* Game Stats Grid */}
            <View style={styles.gameStatsGrid}>
              <View style={styles.gameStatCard}>
                <View style={styles.gameStatIconBox}>
                  <Text style={styles.gameStatIcon}>⏱</Text>
                </View>
                <Text style={styles.gameStatValue}>{formatDuration(challenge.duration)}</Text>
                <Text style={styles.gameStatLabel}>TIME</Text>
              </View>
              
              <View style={styles.gameStatCard}>
                <View style={[styles.gameStatIconBox, styles.rewardBox]}>
                  <Text style={styles.gameStatIcon}>⭐</Text>
                </View>
                <Text style={[styles.gameStatValue, styles.rewardValue]}>
                  {challenge.points}
                </Text>
                <Text style={styles.gameStatLabel}>REWARD</Text>
              </View>
              
              <View style={styles.gameStatCard}>
                <View style={styles.gameStatIconBox}>
                  <Text style={styles.gameStatIcon}>📊</Text>
                </View>
                <Text style={styles.gameStatValue}>{Math.round(challenge.progress)}%</Text>
                <Text style={styles.gameStatLabel}>DONE</Text>
              </View>
            </View>

            {/* Star Rating System */}
            <View style={styles.starRatingContainer}>
              <View style={styles.starsRow}>
                {[0, 1, 2, 3, 4].map((index) => {
                  const filledStars = Math.floor(challenge.progress / 20);
                  const isFilled = index < filledStars;
                  return (
                    <View key={index} style={styles.starWrapper}>
                      <Text style={[styles.star, isFilled && styles.starFilled]}>
                        {isFilled ? '⭐' : '☆'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>

          {/* Play Button */}
          <View style={styles.buttonContainer}>
            <GlassButton
              title={getButtonTitle()}
              onPress={() => onPlay(challenge)}
              variant={isCompleted ? 'primary' : 'secondary'}
              disabled={challenge.completed}
              style={styles.playButton}
            />
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

ChallengeCard.displayName = 'ChallengeCard';

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    alignSelf: 'stretch', // Make sure it takes full available width
    opacity: 1, // Explicitly ensure visibility
    position: 'relative', // Needed for absolute positioned glow and corners
    paddingVertical: 8, // Add padding to prevent pulse clipping
    marginVertical: -8, // Negative margin to maintain spacing
  },
  card: {
    width: '100%',
    overflow: 'hidden',
  },
  currentTrackCard: {
    borderWidth: 3,
    borderColor: THEME.colors.accent,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: THEME.borderRadius.lg,
    zIndex: 0,
  },
  glowGradient: {
    flex: 1,
    borderRadius: THEME.borderRadius.lg,
  },
  cornerDecoration: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    zIndex: 100,
  },
  topLeft: {
    top: 4,
    left: 4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 4,
    right: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 4,
    left: 4,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 4,
    right: 4,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 150, // Width of the shimmer effect
    bottom: 0,
    borderRadius: THEME.borderRadius.lg,
    zIndex: 1,
    overflow: 'hidden',
  },
  cardContent: {
    padding: THEME.spacing.lg,
  },
  cardPressArea: {
    flex: 1,
    marginBottom: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  titleSection: {
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  activeTitle: {
    color: THEME.colors.accent,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  artist: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '900',
    color: THEME.colors.background,
    letterSpacing: 2,
  },
  description: {
    fontSize: 13,
    color: THEME.colors.text.secondary,
    lineHeight: 20,
    marginBottom: THEME.spacing.lg,
  },
  gameStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  gameStatCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: THEME.borderRadius.sm,
    padding: THEME.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: THEME.spacing.xs / 2,
  },
  gameStatIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  rewardBox: {
    backgroundColor: 'rgba(252, 190, 37, 0.3)',
    borderColor: THEME.colors.accent,
  },
  gameStatIcon: {
    fontSize: 24,
  },
  gameStatValue: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs / 2,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rewardValue: {
    color: THEME.colors.accent,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowRadius: 5,
  },
  gameStatLabel: {
    fontSize: 11,
    color: THEME.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  starRatingContainer: {
    marginBottom: THEME.spacing.md,
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: THEME.spacing.xs / 2,
  },
  star: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.3)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  starFilled: {
    color: THEME.colors.accent,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowRadius: 4,
  },
  buttonContainer: {
    marginTop: THEME.spacing.xs,
  },
  playButton: {
    marginTop: 0,
  },
});