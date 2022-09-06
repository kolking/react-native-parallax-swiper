import React from 'react';
import { Animated, ImageProps, StyleSheet, View } from 'react-native';

import { useImageDimensions } from './hooks';

type SwiperImageProps = ImageProps & {
  imageOffset: number;
  animatedValue: Animated.AnimatedInterpolation;
};

const SwiperImage = ({ imageOffset, animatedValue, ...props }: SwiperImageProps) => {
  const { width, height } = useImageDimensions(props.source);

  const translateX = animatedValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-imageOffset, 0, imageOffset],
    extrapolate: 'clamp',
  });

  console.log('RENDER IMAGE');

  return (
    <View style={styles.image}>
      <Animated.Image {...props} style={[{ width, height, transform: [{ translateX }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(SwiperImage);
