// ChallengeCarousel component - Swipeable card carousel
import React, { useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ChallengeCard } from './ChallengeCard';
import { THEME } from '../../constants/theme';
import type { MusicChallenge } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Card width with proper padding for centering (2x padding on each side = 4x total)
const CARD_PADDING = THEME.spacing.md * 2;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 2);

interface ChallengeCarouselProps {
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  onPlay: (challenge: MusicChallenge) => void;
}

export const ChallengeCarousel: React.FC<ChallengeCarouselProps> = ({
  challenges,
  currentTrack,
  isPlaying,
  onPlay,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const startIndex = useRef(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // Allow visual updates during scroll for indicators
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        if (index !== currentIndex && index >= 0 && index < challenges.length) {
          setCurrentIndex(index);
        }
      },
    }
  );

  const handleScrollBeginDrag = () => {
    // Store the starting index when user begins dragging
    startIndex.current = currentIndex;
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const calculatedIndex = Math.round(offsetX / SCREEN_WIDTH);
    
    // Determine which page the scroll ended on
    const endIndex = Math.max(0, Math.min(calculatedIndex, challenges.length - 1));
    
    // Calculate the difference from start
    const indexDelta = endIndex - startIndex.current;
    
    // Limit movement to only one page forward or backward, regardless of swipe intensity
    let targetIndex = startIndex.current;
    if (indexDelta > 0) {
      // Swiped right/forward - move exactly one page forward
      targetIndex = Math.min(startIndex.current + 1, challenges.length - 1);
    } else if (indexDelta < 0) {
      // Swiped left/backward - move exactly one page backward
      targetIndex = Math.max(startIndex.current - 1, 0);
    }
    // If indexDelta === 0, stay on current page
    
    // Always snap to the target (one page from start)
    if (targetIndex !== endIndex) {
      setCurrentIndex(targetIndex);
      scrollViewRef.current?.scrollTo({
        x: targetIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  };


  if (challenges.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Cards ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        removeClippedSubviews={false}
      >
        {challenges.map((challenge, index) => (
          <View key={challenge.id} style={styles.cardContainer}>
            <ChallengeCard
              challenge={challenge}
              onPlay={onPlay}
              isCurrentTrack={currentTrack?.id === challenge.id}
              isPlaying={isPlaying && currentTrack?.id === challenge.id}
            />
          </View>
        ))}
      </ScrollView>

      {/* Page Indicators */}
      {challenges.length > 1 && (
        <View style={styles.indicators}>
          {challenges.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 500,
    marginVertical: THEME.spacing.md,
    marginHorizontal: -THEME.spacing.md, // Counteract parent padding for perfect centering
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // No padding - each container is full screen width for proper paging
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CARD_PADDING,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  indicatorActive: {
    width: 24,
    backgroundColor: THEME.colors.primary,
  },
});

