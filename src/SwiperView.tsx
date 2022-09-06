import React, { useContext, useEffect, useRef } from 'react';
import { Animated, ImageSourcePropType, StyleProp, View, ViewProps, ViewStyle } from 'react-native';

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
  stiffness = 50,
  damping = 50,
  mass = 1,
  style,
  contentStyle,
  children,
  ...props
}: SwiperViewProps) => {
  const { width, totalViews, scrollX } = useContext(Context);
  const animatedOffset = useRef(new Animated.Value(0)).current;
  const shiftImage = (width * parallax) / (images.length - 1);
  const position = width * index;

  useEffect(() => {
    Animated.spring(animatedOffset, {
      toValue: scrollX.interpolate({
        inputRange: [position - width, position, position + width],
        outputRange: [1, 0, -1],
        extrapolate: 'clamp',
      }) as Animated.Value,
      stiffness,
      damping,
      mass,
      useNativeDriver: false,
    }).start();
  }, [animatedOffset, scrollX, position, width, stiffness, damping, mass]);

  // To compensate edge bounces
  const rightEdge = (totalViews - 1) * width;
  const translateX = scrollX.interpolate({
    inputRange: [-1, 0, rightEdge, rightEdge + 1],
    outputRange: [-1, 0, 0, 1],
  });

  console.log('RENDER VIEW', index);

  return (
    <Animated.View {...props} style={[style, { width, transform: [{ translateX }] }]}>
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
