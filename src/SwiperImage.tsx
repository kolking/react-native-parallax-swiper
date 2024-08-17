import React from 'react';
import { ImageProps, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useImageDimensions } from './hooks';

type SwiperImageProps = ImageProps & {
  imageOffset: number;
  source: ImageSourcePropType;
  animatedValue: SharedValue<number>;
};

const SwiperImage = ({ imageOffset, animatedValue, ...props }: SwiperImageProps) => {
  const { width, height } = useImageDimensions(props.source);

  const animatedStyles = useAnimatedStyle(() => ({
    width,
    height,
    transform: [
      {
        translateX: interpolate(
          animatedValue.value,
          [-1, 0, 1],
          [-imageOffset, 0, imageOffset],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  console.log('RENDER IMAGE');

  return (
    <View style={styles.image}>
      <Animated.Image {...props} style={animatedStyles} />
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
