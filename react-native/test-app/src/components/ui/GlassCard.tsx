// Glass design system components - Belong's signature UI
import React from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle, 
  TextStyle,
  StyleSheet,
  AccessibilityProps,
  AccessibilityRole
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

// Glass Card Component with gradient borders and accessibility
interface GlassCardProps extends AccessibilityProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: ViewStyle;
  gradientColors?: readonly string[];
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  blurIntensity = 30,
  borderRadius = 16,
  gradientColors = ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)'],
  style,
  accessible = true,
  accessibilityRole = 'none',
  accessibilityLabel,
  ...accessibilityProps
}) => {
    return (
      <View 
        style={StyleSheet.flatten([{ borderRadius, overflow: 'hidden' }, style])}
        accessible={accessible}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        {...accessibilityProps}
      >
        <BlurView 
          key={`blur-${borderRadius}-${gradientColors.join('-')}`}
          intensity={blurIntensity} 
          style={StyleSheet.absoluteFillObject}
          tint="dark"
          pointerEvents="none"
        />
        
        {/* Dark overlay for better visibility */}
        <View 
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
          ]}
          pointerEvents="none"
        />
        
        <LinearGradient
          key={gradientColors.join(',')}
          colors={gradientColors as [string, string]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />
        
        <View style={{ margin: 1, borderRadius: borderRadius - 1, overflow: 'hidden' }}>
          {children}
        </View>
      </View>
    );
};

// Glass Button Component with accessibility
interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const gradientColors = variant === 'primary' 
    ? THEME.glass.gradientColors.primary
    : THEME.glass.gradientColors.secondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={StyleSheet.flatten([styles.button, style])}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      <GlassCard
        gradientColors={gradientColors}
        style={styles.buttonGlass}
        accessibilityRole="none"
      >
        <View style={styles.buttonContent}>
          {loading ? (
            <ActivityIndicator color={THEME.colors.text.primary} size="small" />
          ) : (
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: THEME.spacing.md,
  },
  // Note: Content padding is now handled by the margin wrapper in GlassCard
  button: {
    height: 52,
    width: '100%',
    overflow: 'hidden',
  },
  buttonGlass: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 52,
  },
  buttonText: {
    color: THEME.colors.text.primary,
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});