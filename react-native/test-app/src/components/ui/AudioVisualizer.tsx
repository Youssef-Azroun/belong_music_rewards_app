// AudioVisualizer - Animated bars that dance with the music
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { THEME } from '../../constants/theme';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  barWidth?: number;
  barSpacing?: number;
  maxBarHeight?: number;
  minBarHeight?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 20,
  barWidth = 4,
  barSpacing = 3,
  maxBarHeight = 60,
  minBarHeight = 8,
}) => {
  // Create animated values for each bar
  const animations = useRef(
    Array.from({ length: barCount }, () => ({
      height: new Animated.Value(minBarHeight),
      opacity: new Animated.Value(0.6),
    }))
  ).current;

  // Animation refs for cleanup
  const animationRefs = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    // Clear any existing animations
    animationRefs.current.forEach(anim => anim.stop());
    animationRefs.current = [];

    if (isPlaying) {
      // Create unique animations for each bar with different delays and speeds
      animations.forEach((anim, index) => {
        // Each bar has a different phase and speed for natural variation
        const delay = (index * 50) % 400; // Staggered delays
        const duration = 300 + (index % 3) * 100; // Varied durations (300-500ms)
        const targetHeight = minBarHeight + Math.random() * (maxBarHeight - minBarHeight);
        
        // Create a looping animation
        const animation = Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(anim.height, {
                toValue: targetHeight,
                duration: duration,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: false,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0.9,
                duration: duration / 2,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
            ]),
            Animated.parallel([
              Animated.timing(anim.height, {
                toValue: minBarHeight + (targetHeight - minBarHeight) * 0.3,
                duration: duration,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: false,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0.6,
                duration: duration / 2,
                easing: Easing.in(Easing.quad),
                useNativeDriver: false,
              }),
            ]),
            Animated.parallel([
              Animated.timing(anim.height, {
                toValue: targetHeight * 0.7,
                duration: duration * 0.8,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: false,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0.8,
                duration: duration / 2,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
            ]),
            Animated.parallel([
              Animated.timing(anim.height, {
                toValue: minBarHeight,
                duration: duration,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: false,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0.5,
                duration: duration / 2,
                easing: Easing.in(Easing.quad),
                useNativeDriver: false,
              }),
            ]),
          ])
        );

        animationRefs.current.push(animation);
        animation.start();
      });
    } else {
      // When paused, animate all bars to minimum height smoothly
      animations.forEach((anim) => {
        const animation = Animated.parallel([
          Animated.timing(anim.height, {
            toValue: minBarHeight,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0.3,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
        ]);
        animationRefs.current.push(animation);
        animation.start();
      });
    }

    // Cleanup function
    return () => {
      animationRefs.current.forEach(anim => anim.stop());
      animationRefs.current = [];
    };
  }, [isPlaying, animations, minBarHeight, maxBarHeight]);

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {animations.map((anim, index) => {
          // Alternate colors for visual interest - center bars are accent color
          const isCenterBar = Math.abs(index - barCount / 2) < 3;
          const barColor = isCenterBar 
            ? THEME.colors.accent 
            : index % 3 === 0 
              ? THEME.colors.primary 
              : THEME.colors.secondary;

          return (
            <Animated.View
              key={index}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  marginHorizontal: barSpacing / 2,
                  height: anim.height,
                  backgroundColor: barColor,
                  opacity: anim.opacity,
                  shadowColor: barColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                  elevation: 3,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.md,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  bar: {
    borderRadius: 2,
    alignSelf: 'flex-end',
  },
});

