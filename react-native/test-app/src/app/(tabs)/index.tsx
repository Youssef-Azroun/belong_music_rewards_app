// Home screen - Challenge list (Expo Router)
import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChallengeCarousel } from '../../components/challenge/ChallengeCarousel';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore, selectChallenges, selectCurrentTrack, selectIsPlaying } from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

export default function HomeScreen() {
  const challenges = useMusicStore(selectChallenges);
  const currentTrack = useMusicStore(selectCurrentTrack);
  const isPlaying = useMusicStore(selectIsPlaying);
  const { play } = useMusicPlayer();
  const totalPoints = useUserStore((state) => state.totalPoints);
  const completedChallenges = useUserStore((state) => state.completedChallenges);

  const handlePlayChallenge = async (challenge: MusicChallenge) => {
    try {
      await play(challenge);
      // Navigate to player modal after starting playback
      router.push('/(modals)/player');
    } catch (error) {
      console.error('Failed to play challenge:', error);
    }
  };

  const totalChallenges = challenges.length;
  const completionRate = totalChallenges > 0 ? (completedChallenges.length / totalChallenges) * 100 : 0;

  return (
    <GradientBackground style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.topHeaderTitle}>CHALLENGES</Text>
          <View style={styles.titleUnderline} />
        </View>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      {/* Game-like Stats HUD */}
      <View style={styles.hudContainer}>
        <GlassCard 
          style={styles.hudCard}
          gradientColors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']}
        >
          <View style={styles.hudContent}>
            <View style={styles.hudStat}>
              <View style={styles.hudIconContainer}>
                <Text style={styles.hudIcon}>⚡</Text>
              </View>
              <View style={styles.hudStatInfo}>
                <Text style={styles.hudValue}>{totalPoints}</Text>
                <Text style={styles.hudLabel}>POINTS</Text>
              </View>
            </View>
            
            <View style={styles.hudDivider} />
            
            <View style={styles.hudStat}>
              <View style={styles.hudIconContainer}>
                <Text style={styles.hudIcon}>✓</Text>
              </View>
              <View style={styles.hudStatInfo}>
                <Text style={styles.hudValue}>{completedChallenges.length}/{totalChallenges}</Text>
                <Text style={styles.hudLabel}>DONE</Text>
              </View>
            </View>
            
            <View style={styles.hudDivider} />
            
            <View style={styles.hudStat}>
              <View style={styles.hudIconContainer}>
                <Text style={styles.hudIcon}>🎯</Text>
              </View>
              <View style={styles.hudStatInfo}>
                <Text style={styles.hudValue}>{Math.round(completionRate)}%</Text>
                <Text style={styles.hudLabel}>STATUS</Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </View>
      
      <ChallengeCarousel
        challenges={challenges}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlay={handlePlayChallenge}
      />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: THEME.spacing.md,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  topHeaderTitle: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    letterSpacing: 2,
    textShadowColor: 'rgba(117, 83, 219, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: THEME.colors.accent,
    marginTop: THEME.spacing.xs,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  hudContainer: {
    marginBottom: THEME.spacing.lg,
  },
  hudCard: {
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  hudContent: {
    flexDirection: 'row',
    padding: THEME.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  hudStat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  hudIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(252, 190, 37, 0.4)',
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  hudIcon: {
    fontSize: 20,
  },
  hudStatInfo: {
    flex: 1,
  },
  hudValue: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.accent,
    letterSpacing: 1,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  hudLabel: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.secondary,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: 2,
  },
  hudDivider: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: THEME.spacing.xs,
  },
});