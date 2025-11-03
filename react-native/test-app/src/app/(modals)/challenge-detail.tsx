// Challenge Detail Screen - Gaming style redesign
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import {
  useMusicStore,
  selectChallenges,
  selectCurrentTrack,
  selectIsPlaying,
} from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

export default function ChallengeDetailScreen() {
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const { play, pause, resume } = useMusicPlayer();
  const completedChallenges = useUserStore((state) => state.completedChallenges);

  const challenge = challenges.find((c) => c.id === challengeId);
  const isCompleted = challenge ? completedChallenges.includes(challenge.id) : false;
  const isCurrentTrack = challenge?.id === currentTrack?.id;

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return THEME.colors.secondary;
      case 'medium':
        return THEME.colors.accent;
      case 'hard':
        return THEME.colors.primary;
      default:
        return THEME.colors.text.secondary;
    }
  };

  const handlePlayPauseResume = async () => {
    if (!challenge) return;

    if (isCurrentTrack) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      await play(challenge);
    }
    router.push('/(modals)/player');
  };

  if (!challenge) {
    return (
      <GradientBackground style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <View style={styles.backButtonInner}>
                <Text style={styles.backIcon}>◄</Text>
                <Text style={styles.backText}>BACK</Text>
              </View>
            </TouchableOpacity>
          </View>
          <GlassCard 
            style={styles.errorCard}
            gradientColors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']}
          >
            <Text style={styles.errorText}>⚠️ CHALLENGE NOT FOUND</Text>
          </GlassCard>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const buttonTitle = isCompleted
    ? '✓ COMPLETED'
    : isCurrentTrack && isPlaying
    ? '⏸ PAUSED'
    : isCurrentTrack && !isPlaying
    ? '▶ RESUME'
    : '▶ START CHALLENGE';

  return (
    <GradientBackground style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <View style={styles.backButtonInner}>
                <Text style={styles.backIcon}>◄</Text>
                <Text style={styles.backText}>BACK</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Challenge Info Card */}
          <GlassCard 
            style={styles.challengeCard}
            gradientColors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']}
          >
            <View style={styles.challengeContent}>
              {/* Title Section */}
              <View style={styles.titleSection}>
                <View style={styles.titleRow}>
                  <View style={styles.titleLeft}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeArtist}>{challenge.artist}</Text>
                  </View>
                  <View
                    style={StyleSheet.flatten([
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(challenge.difficulty) },
                    ])}
                  >
                    <Text style={styles.difficultyText}>
                      {challenge.difficulty.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statIconBox}>
                    <Text style={styles.statIcon}>⏱</Text>
                  </View>
                  <Text style={styles.statValue}>{formatDuration(challenge.duration)}</Text>
                  <Text style={styles.statLabel}>DURATION</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statCard}>
                  <View style={styles.statIconBox}>
                    <Text style={styles.statIcon}>⚡</Text>
                  </View>
                  <Text style={[styles.statValue, { color: THEME.colors.accent }]}>
                    {challenge.points}
                  </Text>
                  <Text style={styles.statLabel}>POINTS</Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Progress Card */}
          <GlassCard 
            style={styles.progressCard}
            gradientColors={isCompleted 
              ? ['rgba(52, 203, 118, 0.3)', 'rgba(52, 203, 118, 0.15)']
              : ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']
            }
          >
            <View style={styles.progressContent}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PROGRESS</Text>
                <View style={styles.sectionUnderline} />
              </View>

              <View style={styles.progressSection}>
                <View style={styles.gameProgressTrack}>
                  <View
                    style={[styles.gameProgressFill, { width: `${challenge.progress}%` }]}
                  />
                </View>
                <Text style={styles.progressPercent}>
                  {Math.round(challenge.progress)}% COMPLETE
                </Text>
              </View>

              {isCompleted && (
                <View style={styles.completionBadge}>
                  <Text style={styles.completionIcon}>✓</Text>
                  <Text style={styles.completionText}>
                    CHALLENGE COMPLETED! +{challenge.points} POINTS EARNED
                  </Text>
                </View>
              )}
            </View>
          </GlassCard>

          {/* Action Button */}
          <TouchableOpacity
            style={StyleSheet.flatten([
              styles.actionButton,
              isCompleted && styles.actionButtonCompleted,
              isCurrentTrack && styles.actionButtonActive
            ])}
            onPress={handlePlayPauseResume}
            activeOpacity={0.8}
            disabled={isCompleted}
          >
            <Text style={styles.actionButtonText}>{buttonTitle}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  header: {
    paddingLeft: THEME.spacing.xs,
    paddingRight: THEME.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: THEME.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    position: 'relative',
    overflow: 'hidden',
  },
  backIconGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(252, 190, 37, 0.2)',
    opacity: 0.5,
  },
  backIcon: {
    fontSize: 20,
    color: THEME.colors.accent,
    fontWeight: '900',
    marginRight: THEME.spacing.xs,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  backText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.accent,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  errorCard: {
    margin: THEME.spacing.xl,
    padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  errorText: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  challengeCard: {
    marginBottom: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  challengeContent: {
    padding: THEME.spacing.lg,
  },
  titleSection: {
    marginBottom: THEME.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  titleLeft: {
    flex: 1,
    marginRight: THEME.spacing.md,
  },
  challengeTitle: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs / 2,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  challengeArtist: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.text.secondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  difficultyText: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: '900',
    color: THEME.colors.background,
    letterSpacing: 2,
  },
  challengeDescription: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs / 2,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.secondary,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: THEME.spacing.md,
  },
  progressCard: {
    marginBottom: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressContent: {
    padding: THEME.spacing.lg,
  },
  sectionHeader: {
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    letterSpacing: 2,
    marginBottom: THEME.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sectionUnderline: {
    width: 100,
    height: 3,
    backgroundColor: THEME.colors.accent,
    borderRadius: 2,
  },
  progressSection: {
    marginTop: THEME.spacing.md,
  },
  gameProgressTrack: {
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: THEME.spacing.md,
  },
  gameProgressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  progressPercent: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '900',
    color: THEME.colors.accent,
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
    padding: THEME.spacing.md,
    backgroundColor: 'rgba(52, 203, 118, 0.2)',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: THEME.colors.secondary,
  },
  completionIcon: {
    fontSize: 24,
    marginRight: THEME.spacing.sm,
  },
  completionText: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: '900',
    color: THEME.colors.secondary,
    letterSpacing: 1,
    flex: 1,
    textShadowColor: 'rgba(52, 203, 118, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  actionButton: {
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.accent,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  actionButtonCompleted: {
    backgroundColor: THEME.colors.secondary,
    borderColor: 'rgba(52, 203, 118, 0.6)',
    shadowColor: THEME.colors.secondary,
    opacity: 0.8,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(252, 190, 37, 0.9)',
  },
  actionButtonText: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: '900',
    color: THEME.colors.background,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
