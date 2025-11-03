// Profile screen - User progress and stats
import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useMusicStore, selectChallenges } from '../../stores/musicStore';
import { useUserStore, selectTotalPoints, selectCompletedChallenges } from '../../stores/userStore';
import { THEME } from '../../constants/theme';

export default function ProfileScreen() {
  const challenges = useMusicStore(selectChallenges);
  const totalPoints = useUserStore(selectTotalPoints);
  const completedChallenges = useUserStore(selectCompletedChallenges);

  const totalChallenges = challenges.length;
  const completionRate = totalChallenges > 0 ? (completedChallenges.length / totalChallenges) * 100 : 0;

  return (
    <GradientBackground style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.topHeaderTitle}>PROFILE</Text>
          <View style={styles.titleUnderline} />
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {/* Game Stats HUD */}
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
                <Text style={styles.hudValue}>{completedChallenges.length}</Text>
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

      {/* Challenge Progress - Game Style */}
      <GlassCard 
        style={styles.progressCard}
        gradientColors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MISSIONS</Text>
          <View style={styles.sectionUnderline} />
        </View>
        <View style={styles.missionsContainer}>
          {challenges.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          return (
            <GlassCard 
              key={challenge.id} 
              style={styles.missionCard}
              gradientColors={isCompleted 
                ? ['rgba(52, 203, 118, 0.3)', 'rgba(52, 203, 118, 0.15)']
                : ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
              }
            >
              <View style={styles.missionContent}>
                <View style={styles.missionHeader}>
                  <View style={styles.missionTitleRow}>
                    <View style={styles.missionIconBox}>
                      <Text style={styles.missionIcon}>{isCompleted ? '✓' : '▶'}</Text>
                    </View>
                    <View style={styles.missionTitleSection}>
                      <Text style={styles.missionTitle}>{challenge.title}</Text>
                      <Text style={styles.missionArtist}>{challenge.artist}</Text>
                    </View>
                  </View>
                  {isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>DONE</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.gameProgressTrack}>
                  <View 
                    style={[
                      styles.gameProgressFill,
                      { width: `${challenge.progress}%` }
                    ]} 
                  />
                </View>
                <View style={styles.missionStats}>
                  <Text style={styles.missionStat}>
                    <Text style={styles.missionStatLabel}>PROGRESS: </Text>
                    {Math.round(challenge.progress)}%
                  </Text>
                  <Text style={styles.missionStat}>
                    <Text style={styles.missionStatLabel}>REWARD: </Text>
                    <Text style={styles.rewardText}>{challenge.points} PTS</Text>
                  </Text>
                </View>
              </View>
            </GlassCard>
          );
        })}
        </View>
      </GlassCard>

      {/* Achievements - Game Style */}
      <GlassCard 
        style={styles.achievementsCard}
        gradientColors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)']}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
          <View style={styles.sectionUnderline} />
        </View>
        
        <View style={styles.achievementsContainer}>
          {totalPoints >= 100 && (
          <View style={styles.achievementCard}>
            <View style={styles.achievementIconBox}>
              <Text style={styles.achievementIcon}>🏆</Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>FIRST 100 POINTS</Text>
              <Text style={styles.achievementDesc}>Reached milestone</Text>
            </View>
          </View>
        )}
        
        {completedChallenges.length >= 1 && (
          <View style={styles.achievementCard}>
            <View style={styles.achievementIconBox}>
              <Text style={styles.achievementIcon}>🎵</Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>MUSIC LOVER</Text>
              <Text style={styles.achievementDesc}>Completed a challenge</Text>
            </View>
          </View>
        )}
        
        {completionRate >= 100 && (
          <View style={styles.achievementCard}>
            <View style={styles.achievementIconBox}>
              <Text style={styles.achievementIcon}>🌟</Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>PERFECT SCORE</Text>
              <Text style={styles.achievementDesc}>100% completion rate</Text>
            </View>
          </View>
        )}

          {totalPoints === 0 && completedChallenges.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔒</Text>
              <Text style={styles.emptyText}>
                Complete challenges to unlock achievements!
              </Text>
            </View>
          )}
        </View>
      </GlassCard>
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
  progressCard: {
    marginBottom: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  sectionHeader: {
    marginBottom: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
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
  missionsContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
  },
  missionCard: {
    marginBottom: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  missionContent: {
    padding: THEME.spacing.md,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.md,
  },
  missionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  missionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  missionIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  missionTitleSection: {
    flex: 1,
  },
  missionTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs / 2,
    letterSpacing: 0.5,
  },
  missionArtist: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    fontWeight: '600',
  },
  completedBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: 8,
    backgroundColor: THEME.colors.secondary,
    borderWidth: 2,
    borderColor: 'rgba(52, 203, 118, 0.8)',
  },
  completedText: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: '900',
    color: THEME.colors.background,
    letterSpacing: 1.5,
  },
  gameProgressTrack: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: THEME.spacing.sm,
  },
  gameProgressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 3,
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  missionStat: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  missionStatLabel: {
    color: THEME.colors.text.secondary,
    fontSize: THEME.fonts.sizes.xs,
  },
  rewardText: {
    color: THEME.colors.accent,
    fontWeight: '900',
  },
  achievementsCard: {
    marginBottom: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  achievementsContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  achievementIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(252, 190, 37, 0.3)',
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '900',
    color: THEME.colors.text.primary,
    letterSpacing: 1,
    marginBottom: THEME.spacing.xs / 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  achievementDesc: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.secondary,
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: THEME.spacing.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});