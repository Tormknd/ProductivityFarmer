import React, { useEffect } from 'react';
import { View, Text, TextProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface AnimatedTextProps extends TextProps {
  text: string;
  style?: any;
}

export default function AnimatedText({ text, style, ...props }: AnimatedTextProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 3000 }), // 3 seconds for one sweep
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-100, 400], // Sweep from left to right
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      progress.value,
      [0, 0.1, 0.9, 1],
      [0, 1, 1, 0], // Fade in, stay bright, fade out
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  return (
    <View style={{ position: 'relative', overflow: 'hidden' }}>
      <Text style={style} {...props}>
        {text}
      </Text>
      
      {/* Blinding light overlay */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFD54F',
            width: 60, // Light width
            borderRadius: 4,
            shadowColor: '#FFD54F',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
} 