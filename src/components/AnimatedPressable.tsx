import React, {useRef} from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
  duration?: number;
}

export default function AnimatedPressable({
  children,
  style,
  pressedOpacity = 0.5,
  duration = 120,
  ...props
}: AnimatedPressableProps) {
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(animatedOpacity, {
      toValue: pressedOpacity,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={[style, {opacity: animatedOpacity}]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
