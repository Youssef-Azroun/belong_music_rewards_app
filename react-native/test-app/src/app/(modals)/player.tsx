// Player modal - Modern full-screen audio player
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { CompletionModal } from '../../components/ui/CompletionModal';
import { AudioVisualizer } from '../../components/ui/AudioVisualizer';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useUserStore } from '../../stores/userStore';
import { THEME } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PlayerModal() {
  const { 
    currentTrack, 
    isPlaying, 
    currentPosition, 
    duration, 
    pause, 
    resume,
    seekTo,
    loading,
    error,
    isCompleted,
    resetCompletion
  } = useMusicPlayer();
  
  const totalPoints = useUserStore((state) => state.totalPoints);
  const [showCompletionModal, setShowCompletionModal] = React.useState(false);
  const modalShownRef = React.useRef<string | null>(null);

  // Show completion modal when song finishes - only once per track
  React.useEffect(() => {
    if (isCompleted && currentTrack) {
      // Only show if we haven't already shown it for this track
      if (modalShownRef.current !== currentTrack.id) {
        modalShownRef.current = currentTrack.id;
        setShowCompletionModal(true);
      }
    }
  }, [isCompleted, currentTrack]);

  // Reset modal tracking when track changes
  React.useEffect(() => {
    if (currentTrack) {
      // If this is a different track, reset the modal shown flag
      if (modalShownRef.current !== currentTrack.id) {
        modalShownRef.current = null;
        setShowCompletionModal(false);
      }
    } else {
      modalShownRef.current = null;
      setShowCompletionModal(false);
    }
  }, [currentTrack?.id]);

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    // Don't reset completion here - let the ref prevent it from showing again
    // The completion state will reset when a new track starts
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (!duration || duration === 0) return 0;
    return (currentPosition / duration) * 100;
  };


  const handlePlayPause = async () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        resume();
      }
    }
  };

  const handleBackward = () => {
    if (duration) {
      // Prevent rewinding if song has reached 100% completion
      const progress = getProgress();
      if (progress >= 100) {
        return;
      }
      const newPosition = Math.max(0, currentPosition - 10);
      seekTo(newPosition);
    }
  };

  const handleForward = () => {
    if (duration) {
      const newPosition = Math.min(duration, currentPosition + 10);
      seekTo(newPosition);
    }
  };

  if (error) {
    Alert.alert('Playback Error', error);
  }

  if (!currentTrack) {
    return (
      <GradientBackground style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyTitle}>No Track Selected</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.back()}
            >
              <Text style={styles.emptyButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.closeButton}
            activeOpacity={0.8}
          >
            <View style={styles.closeButtonInner}>
              <Text style={styles.closeIcon}>◄</Text>
              <Text style={styles.closeText}>BACK</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Track Info - Minimal & Modern */}
          <View style={styles.trackSection}>
            <View style={styles.trackArtwork}>
              <Text style={styles.trackArtworkIcon}>🎵</Text>
            </View>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
            
            {/* Audio Visualizer - Dancing bars */}
            <View style={styles.visualizerContainer}>
              <AudioVisualizer 
                isPlaying={isPlaying}
                barCount={24}
                barWidth={4}
                barSpacing={3}
                maxBarHeight={50}
                minBarHeight={6}
              />
            </View>
            
            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {isCompleted ? currentTrack.points : 0}
                </Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalPoints}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarTrack}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { width: `${getProgress()}%` }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
              <Text style={styles.progressPercent}>{Math.round(getProgress())}%</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controlsSection}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleBackward}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                style={styles.secondaryButtonGradient}
              >
                <View style={styles.secondaryButtonInner}>
                  <View style={styles.skipIcons}>
                    <View style={styles.skipIconLeft} />
                    <View style={[styles.skipIconLeft, styles.skipIconLeftSecond]} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
              activeOpacity={0.8}
              disabled={loading}
            >
              <LinearGradient
                colors={[THEME.colors.accent, 'rgba(252, 190, 37, 0.85)']}
                style={styles.playButtonGradient}
              >
                <View style={styles.playButtonContent}>
                  {loading ? (
                    <Text style={styles.playButtonIcon}>⏳</Text>
                  ) : isPlaying ? (
                    <View style={styles.pauseIcons}>
                      <View style={styles.pauseBar} />
                      <View style={styles.pauseBar} />
                    </View>
                  ) : (
                    <View style={styles.playIcon} />
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleForward}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                style={styles.secondaryButtonGradient}
              >
                <View style={styles.secondaryButtonInner}>
                  <View style={styles.skipIcons}>
                    <View style={styles.skipIconRight} />
                    <View style={[styles.skipIconRight, styles.skipIconRightSecond]} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Completion Modal */}
      {currentTrack && (
        <CompletionModal
          visible={showCompletionModal}
          points={currentTrack.points}
          trackTitle={currentTrack.title}
          trackArtist={currentTrack.artist}
          onClose={handleCloseCompletionModal}
        />
      )}
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
  header: {
    paddingLeft: THEME.spacing.xs,
    paddingRight: THEME.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 35 : 45,
    paddingBottom: THEME.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonInner: {
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
  closeIconGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(252, 190, 37, 0.2)',
    opacity: 0.5,
  },
  closeIcon: {
    fontSize: 20,
    color: THEME.colors.accent,
    fontWeight: '900',
    marginRight: THEME.spacing.xs,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  closeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.accent,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(252, 190, 37, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: THEME.spacing.lg,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: '700',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xl,
    textAlign: 'center',
  },
  emptyButton: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  emptyButtonText: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '700',
    color: THEME.colors.text.primary,
  },
  trackSection: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
  },
  trackArtwork: {
    width: 160,
    height: 160,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  trackArtworkIcon: {
    fontSize: 60,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xs,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  trackArtist: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  visualizerContainer: {
    width: '100%',
    marginVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.sm,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.accent,
    marginBottom: 3,
    textShadowColor: 'rgba(252, 190, 37, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statLabel: {
    fontSize: 10,
    color: THEME.colors.text.secondary,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  statDivider: {
    width: 1.5,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 1,
  },
  progressSection: {
    paddingVertical: THEME.spacing.md,
  },
  progressBarContainer: {
    marginBottom: THEME.spacing.md,
    paddingVertical: 16,
    paddingHorizontal: 0,
    justifyContent: 'center',
    width: '100%',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    color: THEME.colors.text.secondary,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 13,
    color: THEME.colors.accent,
    fontWeight: '800',
  },
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
  },
  secondaryButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    marginHorizontal: THEME.spacing.xl,
  },
  secondaryButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  skipIconLeft: {
    width: 0,
    height: 0,
    borderRightWidth: 9,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightColor: 'rgba(255, 255, 255, 0.9)',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginRight: 2,
  },
  skipIconLeftSecond: {
    marginRight: 0,
    marginLeft: -2,
  },
  skipIconRight: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  skipIconRightSecond: {
    marginLeft: -2,
  },
  playButton: {
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: 'hidden',
    marginHorizontal: THEME.spacing.lg,
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 46,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playButtonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonIcon: {
    fontSize: 36,
    opacity: 0.9,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: THEME.colors.background,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 3,
  },
  pauseIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
  },
  pauseBar: {
    width: 5,
    height: 24,
    backgroundColor: THEME.colors.background,
    borderRadius: 2,
    marginHorizontal: 2,
  },
});
