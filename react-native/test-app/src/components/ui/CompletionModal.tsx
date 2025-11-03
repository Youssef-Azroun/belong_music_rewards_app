// Game-like completion modal for when songs finish
import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { THEME } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CompletionModalProps {
  visible: boolean;
  points: number;
  trackTitle: string;
  trackArtist: string;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  points,
  trackTitle,
  trackArtist,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pointsScaleAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.spring(pointsScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      pointsScaleAnim.setValue(0);
      sparkleAnim.setValue(0);
    }
  }, [visible]);

  const sparkleRotation = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} style={styles.blurContainer}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={[
                'rgba(252, 190, 37, 0.95)',
                'rgba(252, 190, 37, 0.85)',
                'rgba(117, 83, 219, 0.9)',
              ]}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Animated sparkles */}
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle1,
                  {
                    transform: [{ rotate: sparkleRotation }],
                    opacity: sparkleOpacity,
                  },
                ]}
              >
                <Text style={styles.sparkleText}>✨</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle2,
                  {
                    transform: [{ rotate: sparkleRotation }],
                    opacity: sparkleOpacity,
                  },
                ]}
              >
                <Text style={styles.sparkleText}>⭐</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle3,
                  {
                    transform: [{ rotate: sparkleRotation }],
                    opacity: sparkleOpacity,
                  },
                ]}
              >
                <Text style={styles.sparkleText}>💫</Text>
              </Animated.View>

              {/* Success Icon */}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>🎉</Text>
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>SONG COMPLETE!</Text>

              {/* Track Info */}
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{trackTitle}</Text>
                <Text style={styles.trackArtist}>{trackArtist}</Text>
              </View>

              {/* Points Display */}
              <Animated.View
                style={[
                  styles.pointsContainer,
                  {
                    transform: [{ scale: pointsScaleAnim }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                  style={styles.pointsGradient}
                >
                  <Text style={styles.pointsLabel}>POINTS EARNED</Text>
                  <Text style={styles.pointsValue}>+{points}</Text>
                </LinearGradient>
              </Animated.View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                  style={styles.closeButtonGradient}
                >
                  <Text style={styles.closeButtonText}>AWESOME!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  gradientBackground: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  sparkle: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle1: {
    top: 20,
    left: 20,
  },
  sparkle2: {
    top: 20,
    right: 20,
  },
  sparkle3: {
    bottom: 80,
    left: '50%',
    marginLeft: -30,
  },
  sparkleText: {
    fontSize: 32,
  },
  iconContainer: {
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: '900',
    color: THEME.colors.background,
    marginBottom: THEME.spacing.md,
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.md,
  },
  trackTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: '800',
    color: THEME.colors.background,
    marginBottom: THEME.spacing.xs,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: THEME.fonts.sizes.md,
    color: 'rgba(26, 26, 26, 0.8)',
    fontWeight: '600',
    textAlign: 'center',
  },
  pointsContainer: {
    width: '100%',
    marginBottom: THEME.spacing.lg,
  },
  pointsGradient: {
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: '700',
    color: THEME.colors.background,
    letterSpacing: 2,
    marginBottom: THEME.spacing.xs,
    opacity: 0.9,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '900',
    color: THEME.colors.background,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  closeButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  closeButtonGradient: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '800',
    color: THEME.colors.background,
    letterSpacing: 1.5,
  },
});

