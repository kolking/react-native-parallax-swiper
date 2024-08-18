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
  const scrollRef = useRef<ScrollView>(null);
  const totalViews = React.Children.count(props.children);
  const contentOffset = { x: viewIndex.current * width, y: 0 };
  const scrollX = useRef(new Animated.Value(contentOffset.x)).current;

  useEffect(() => console.log('> MOUNTED SWIPER'), []);

  useEffect(() => {
    // Scroll to the current view in controlled mode
    if (current !== undefined) {
      scrollRef.current?.scrollTo({ x: current * width, y: 0, animated: true });
    }
  }, [current, width]);

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
        bounces={false}
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
