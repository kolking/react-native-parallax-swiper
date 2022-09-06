import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { Context } from './context';

export type SwiperProps = ScrollViewProps & {
  current?: number;
  trackedIndex?: Animated.Value;
  onChange?: (index: number) => void;
};

export const Swiper = ({
  current,
  trackedIndex,
  style,
  onChange,
  onScroll,
  onMomentumScrollEnd,
  ...props
}: SwiperProps) => {
  const { width } = useWindowDimensions();

  const viewIndex = useRef(current || 0);
  const scrollRef = useRef<ScrollView>();
  const totalViews = React.Children.count(props.children);
  const contentOffset = { x: viewIndex.current * width, y: 0 };

  const scrollX = useRef(new Animated.Value(contentOffset.x)).current;
  const animatedIndex = useRef(Animated.divide(scrollX, width)).current;

  useEffect(() => console.log('> MOUNTED SWIPER'), []);

  useEffect(() => {
    if (current !== undefined) {
      // Scroll to the current view in controlled mode
      scrollRef.current?.scrollTo({ x: current * width, y: 0, animated: true });
    }
  }, [current, width]);

  useEffect(() => {
    if (trackedIndex) {
      // Tracking external animated value
      Animated.timing(trackedIndex, {
        duration: 0,
        toValue: animatedIndex,
        useNativeDriver: false,
      }).start();
    }
  }, [trackedIndex, animatedIndex]);

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

  console.log('RENDER SWIPER');

  return (
    <Context.Provider value={{ width, totalViews, scrollX }}>
      <Animated.ScrollView
        {...props}
        ref={scrollRef}
        style={[styles.root, style]}
        horizontal={true}
        pagingEnabled={true}
        scrollEventThrottle={16}
        pinchGestureEnabled={false}
        contentOffset={contentOffset}
        disableIntervalMomentum={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
          listener: onScroll,
        })}
      />
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
