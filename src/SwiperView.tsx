import React, { useContext } from 'react';
import { ImageSourcePropType, StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import SwiperImage from './SwiperImage';
import { Context } from './context';

export type SwiperViewProps = ViewProps & {
  index: number;
  images: ImageSourcePropType[];
  parallax?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  contentStyle?: StyleProp<ViewStyle>;
};

export const SwiperView = ({
  index,
  images,
  parallax = 1,
  stiffness = 100,
  damping = 50,
  mass = 1,
  style,
  contentStyle,
  children,
  ...props
}: SwiperViewProps) => {
  const { width, totalViews, scrollX } = useContext(Context);
  const animatedOffset = useSharedValue(0);
  const shiftImage = (width * parallax) / (images.length - 1);

  useDerivedValue(() => {
    const toValue = (scrollX.value - width * index) / -width;
    animatedOffset.value = withSpring(toValue, {
      stiffness,
      damping,
      mass,
    });
  });

  // Compensate edge bounces
  const rightEdge = (totalViews - 1) * width;
  const animatedStyles = useAnimatedStyle(() => ({
    width,
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          [-1, 0, rightEdge, rightEdge + 1],
          [-1, 0, 0, 1],
          Extrapolation.EXTEND,
        ),
      },
    ],
  }));

  console.log('RENDER VIEW', index);

  return (
    <Animated.View {...props} style={[style, animatedStyles]}>
      {images.map((image, imageIndex) => (
        <SwiperImage
          key={imageIndex}
          source={image}
          animatedValue={animatedOffset}
          imageOffset={shiftImage * imageIndex}
        />
      ))}
      <View style={contentStyle}>{children}</View>
    </Animated.View>
  );
};
