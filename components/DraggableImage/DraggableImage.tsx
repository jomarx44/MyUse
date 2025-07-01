import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Colors } from '../../constant/Color';

const AnimatedImage = Animated.createAnimatedComponent(Image);
type Props = {
  id: string;
  uri: string;
  initialX?: number;
  initialY?: number;
  onPositionChange: (id: string, x: number, y: number) => void;
  onPress?: () => void;
  selected?: boolean;
};

export default function DraggableImage({
  id,
  uri,
  initialX = 0,
  initialY = 0,
  onPositionChange,
  onPress,
  selected = false,
}: Props) {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);

  const startX = useSharedValue(initialX);
  const startY = useSharedValue(initialY);

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);

      runOnJS(onPositionChange)(id, translateX.value, translateY.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = e.rotation;
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (onPress) {
      runOnJS(onPress)();
    }
  });
  const composedGesture = Gesture.Simultaneous(
    Gesture.Simultaneous(dragGesture, pinchGesture, rotateGesture),
    tapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
    borderWidth: selected ? 2 : 0,
    borderColor: selected ? Colors.blue : 'transparent',
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <AnimatedImage
        source={{ uri }}
        style={[styles.image, animatedStyle]}
      />
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
