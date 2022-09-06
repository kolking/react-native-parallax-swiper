import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swiper, SwiperView } from 'react-native-parallax-intro';
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

// async function preloadImages() {
//   const images = views.reduce((acc: ImageSourcePropType[], curr) => {
//     return acc.concat(...curr.images);
//   }, []);

//   return Promise.all(
//     images.map(async (image) => {
//       const { uri } = Image.resolveAssetSource(image);
//       console.log('prefetching', uri);
//       return Image.prefetch(uri);
//     }),
//   );
// }

type ButtonProps = {
  index: number;
  total: number;
  onPress: (index: number) => void;
};

const Button = ({ index, total, onPress }: ButtonProps) => {
  const isLast = index + 1 === total;

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
  const [current, setCurrent] = useState(0);
  const animatedCurrent = useRef(new Animated.Value(0)).current;
  // const [loading, setLoading] = useState(true);

  // useLayoutEffect(() => {
  //   preloadImages().then(() => {
  //     console.log('DONE PRELOADING');
  //     setLoading(false);
  //   });
  // }, []);

  return (
    <View style={styles.root}>
      <Swiper current={current} trackedIndex={animatedCurrent} onChange={setCurrent}>
        {views.map(({ title, text, images }, index) => (
          <SwiperView key={index} index={index} style={styles.view} images={images}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
            <Button index={index} total={views.length} onPress={setCurrent} />
          </SwiperView>
        ))}
      </Swiper>
      <PageIndicator
        style={styles.pageIndicator}
        count={views.length}
        current={animatedCurrent}
        color="white"
      />
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
    position: 'absolute',
  },
});

export default App;
