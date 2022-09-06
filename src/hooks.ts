import { Image, ImageSourcePropType, useWindowDimensions } from 'react-native';

export const useImageDimensions = (source: ImageSourcePropType) => {
  const window = useWindowDimensions();
  // TODO: check for external image source
  const asset = Image.resolveAssetSource(source);
  const ratio = asset.width / asset.height;
  const width = Math.max(window.width, window.height * ratio);
  const height = width / ratio;

  return { width, height };
};
