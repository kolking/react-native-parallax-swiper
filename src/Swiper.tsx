import React, { useCallback, useRef } from 'react';
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollViewProps,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { Context } from './context';

export type SwiperProps = ScrollViewProps & {
  current?: number;
  onChange?: (index: number) => void;
};

export const Swiper = ({
  current,
  style,
  onChange,
  onScroll,
  onMomentumScrollEnd,
  ...props
}: SwiperProps) => {
  const { width } = useWindowDimensions();
  const viewIndex = useRef(current || 0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useScrollViewOffset(scrollRef);
  const totalViews = React.Children.count(props.children);
  const contentOffset = { x: viewIndex.current * width, y: 0 };

  useDerivedValue(() => {
    // Scroll to the current view in controlled mode
    if (current !== undefined) {
      scrollTo(scrollRef, current * width, 0, true);
    }
  });

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);

      if (newIndex !== viewIndex.current) {
        viewIndex.current = newIndex;
        onChange && onChange(newIndex);
      }

      onMomentumScrollEnd && onMomentumScrollEnd(e);
    },
    [width, onChange, onMomentumScrollEnd],
  );

  return (
    <Context.Provider value={{ width, totalViews, scrollX }}>
      <Animated.ScrollView
        {...props}
        ref={scrollRef}
        style={[styles.root, style]}
        horizontal={true}
        pagingEnabled={true}
        scrollEventThrottle={8}
        pinchGestureEnabled={false}
        contentOffset={contentOffset}
        disableIntervalMomentum={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={onScroll}
      />
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
