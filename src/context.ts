import { createContext } from 'react';
import { Animated, Dimensions } from 'react-native';

type ContextType = {
  width: number;
  totalViews: number;
  scrollX: Animated.AnimatedValue;
};

export const Context = createContext<ContextType>({
  width: Dimensions.get('window').width,
  totalViews: 0,
  scrollX: new Animated.Value(0),
});
