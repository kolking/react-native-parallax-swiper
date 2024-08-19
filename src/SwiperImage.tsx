import React, { useContext } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { Context } from './context';
import { useImageDimensions } from './hooks';

type SwiperImageProps = {
  index: number;
  offset: number;
  source: ImageSourcePropType;
  stiffness: number;
  damping: number;
  mass: number;
};

const SwiperImage = ({ index, offset, source, stiffness, damping, mass }: SwiperImageProps) => {
  const { width: screenWidth, scrollX } = useContext(Context);
  const { width, height } = useImageDimensions(source);
  const aspectRatio = width / height;
  const position = index * screenWidth;
  const positionPrev = position - screenWidth;
  const positionNext = position + screenWidth;

  const animatedStyles = useAnimatedStyle(() => ({
    height: '100%',
    aspectRatio,
    transform: [
      {
        translateX: withSpring(
          interpolate(
            scrollX.value,
            [positionPrev, position, positionNext],
            [offset, 0, -offset],
            Extrapolation.CLAMP,
          ),
          {
            stiffness,
            damping,
            mass,
          },
        ),
      },
    ],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.Image source={source} style={animatedStyles} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(SwiperImage);
