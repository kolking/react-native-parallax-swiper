import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Swiper, SwiperView } from '@kolking/react-native-parallax-swiper';
import { PageIndicator } from 'react-native-page-indicator';

StatusBar.setBarStyle('light-content');

type Content = {
  title: string;
  text: string;
  images: ImageSourcePropType[];
};

const views: Content[] = [
  {
    title: 'Eiffel Tower',
    text: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. The Eiffel Tower is the most visited monument with an entrance fee in the world.',
    images: [
      require('./assets/Paris1.png'),
      require('./assets/Paris2.png'),
      require('./assets/Paris3.png'),
      require('./assets/Paris4.png'),
      require('./assets/Paris5.png'),
    ],
  },
  {
    title: 'Statue of Liberty',
    text: 'The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States. The copper statue was designed by French sculptor Frédéric Auguste Bartholdi and dedicated on October 28, 1886.',
    images: [
      require('./assets/NewYork1.png'),
      require('./assets/NewYork2.png'),
      require('./assets/NewYork3.png'),
      require('./assets/NewYork4.png'),
      require('./assets/NewYork5.png'),
    ],
  },
  {
    title: 'Sydney Opera House',
    text: 'The Sydney Opera House is a multi-venue performing arts centre in Sydney. Located on the banks of Sydney Harbour, it is widely regarded as one of the world’s most famous and distinctive buildings and a masterpiece of 20th century architecture.',
    images: [
      require('./assets/Sydney1.png'),
      require('./assets/Sydney2.png'),
      require('./assets/Sydney3.png'),
      require('./assets/Sydney4.png'),
      require('./assets/Sydney5.png'),
    ],
  },
];

type ButtonProps = {
  index: number;
  onPress: (index: number) => void;
};

const Button = ({ index, onPress }: ButtonProps) => {
  const isLast = index + 1 === views.length;

  const handlePress = useCallback(() => {
    onPress(isLast ? 0 : index + 1);
  }, [isLast, index, onPress]);

  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={handlePress}>
      <Text style={styles.buttonText}>{isLast ? 'Start Over' : 'Next'}</Text>
    </TouchableOpacity>
  );
};

const App = () => {
  const { width } = useWindowDimensions();
  const [current, setCurrent] = useState(0);
  const currentPage = useRef(new Animated.Value(0)).current;

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      currentPage.setValue(nativeEvent.contentOffset.x / width);
    },
    [currentPage, width],
  );

  return (
    <View style={styles.root}>
      <Swiper current={current} onChange={setCurrent} onScroll={handleScroll}>
        {views.map(({ title, text, images }, index) => (
          <SwiperView key={index} index={index} style={styles.view} images={images}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
            <Button index={index} onPress={setCurrent} />
          </SwiperView>
        ))}
      </Swiper>
      <View style={styles.pageIndicator}>
        <PageIndicator count={views.length} current={currentPage} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  view: {
    paddingVertical: 70,
    paddingHorizontal: 30,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: '#fffd',
    fontWeight: '400',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#fff4',
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  pageIndicator: {
    left: 0,
    right: 0,
    bottom: 35,
    alignItems: 'center',
    position: 'absolute',
  },
});

export default App;
