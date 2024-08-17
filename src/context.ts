import { createContext } from 'react';
import { Dimensions } from 'react-native';
import { makeMutable, SharedValue } from 'react-native-reanimated';

type ContextType = {
  width: number;
  totalViews: number;
  scrollX: SharedValue<number>;
};

export const Context = createContext<ContextType>({
  width: Dimensions.get('window').width,
  totalViews: 0,
  scrollX: makeMutable(0),
});
