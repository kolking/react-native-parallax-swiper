# React Native Parallax Swiper

A React Native component for building an impressive horizontal swiper with a parallax effect. The parallax swiper is great for creating an onboarding UI for your app or for displaying multi-screen swipeable announcements that should catch users' attention. The component utilizes the Reanimated library to achieve seamless 120fps animations.

<p align="center">
  <img width="300" src="https://github.com/user-attachments/assets/cf291433-5842-4767-9b8a-af30fc3af42e">
</p>

## Installation

First of all, make sure you have installed and properly configured Reanimated. Please refer to the official [installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started#installation).

### yarn
```sh
yarn add @kolking/react-native-parallax-swiper
```
### npm
```sh
npm install @kolking/react-native-parallax-swiper
```

## Create Image Layers

To achieve the parallax effect, you need to create a set of image layers, with each layer representing a different depth of the scene. A minimum of 3 layers (though 5 would be better) is required for each slide. Your scene may contain details beyond the screen that will become visible during parallax movement. In such cases, make the layers wider than the device viewport. There are many instructions on how to create layers for parallax scenes, so if you've never done it before, be sure to Google it. Below is a simple example of the layers for a single slide:

![layers](https://github.com/user-attachments/assets/e9acb287-dc4b-4401-b374-010c7980d954)

## Basic Example

```jsx
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { Swiper, SwiperView } from '@kolking/react-native-parallax-swiper';

type Content = {
  images: ImageSourcePropType[];
};

const views: Content[] = [
  {
    images: [
      require('./assets/Slide1-Layer1.png'),
      require('./assets/Slide1-Layer2.png'),
      require('./assets/Slide1-Layer3.png'),
    ],
  },
  {
    images: [
      require('./assets/Slide2-Layer1.png'),
      require('./assets/Slide2-Layer2.png'),
      require('./assets/Slide2-Layer3.png'),
    ],
  },
];

const MyComponent = () => (
  <Swiper>
    {views.map(({ images }, index) => (
      <SwiperView key={index} index={index} images={images} />
    ))}
  </Swiper>
);

export default MyComponent;
```

## `Swiper` Props

The `Swiper` is a `ScrollView` component, so you can pass `ScrollViewProps` such as `onScroll`, `onMomentumScrollEnd`, and so on.

Prop | Type | Default | Description
---|---|---|---
`current` | number | | The current slide index, used in controlled mode
`style` | ViewStyle | | Style object applied to the ScrollView
`onChange` | (index: number) => void | | The callback that return the current slide index after change

## `SwiperView` Props

Prop | Type | Default | Description
---|---|---|---
`index` | number | | The view number (required)
`images` | ImageSourcePropType[] | | The array of image layers where background is the first and foreground is the last (required)
`parallax` | number | `1` | The amount of the parallax shift, where 0 means no parallax
`stiffness` | number | `50` | The stiffness of the spring animation
`damping` | number | `50` | The damping of the spring animation
`mass` | number | `1` | The mass of the spring animation
`style` | ViewStyle | | Style object applied to the view
`contentStyle` | ViewStyle | | Style object applied to the content wrapper

## Advanced Example

In the advanced example, the slides can also be swiped using buttons, and a [page indicator](https://github.com/kolking/react-native-page-indicator) is added to the bottom.

```jsx
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Swiper, SwiperView } from '@kolking/react-native-parallax-swiper';
import { PageIndicator } from 'react-native-page-indicator';

type Content = {
  title: string;
  text: string;
  images: ImageSourcePropType[];
};

const views: Content[] = [
  {
    title: 'Slide 1',
    text: 'Slide 1 description.',
    images: [
      require('./assets/Slide1-Layer1.png'),
      require('./assets/Slide1-Layer2.png'),
      require('./assets/Slide1-Layer3.png'),
    ],
  },
  {
    title: 'Slide 2',
    text: 'Slide 2 description.',
    images: [
      require('./assets/Slide2-Layer1.png'),
      require('./assets/Slide2-Layer2.png'),
      require('./assets/Slide2-Layer3.png'),
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

const MyComponent = () => {
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
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: 'skyblue',
  },
  buttonText: {
    fontSize: 17,
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

export default MyComponent;
```

## Feedback

I appreciate your feedback, so please star the repository if you like it. This is the best motivation for me to maintain the package and add new features. If you have any feature requests, found a bug, or have ideas for improvement, feel free to [open an issue](https://github.com/kolking/react-native-parallax-swiper/issues).

## License

Licensed under the MIT license.
