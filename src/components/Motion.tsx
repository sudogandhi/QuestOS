import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";

export function FadeInUp({
  children,
  delay = 0,
  style
}: PropsWithChildren<{ delay?: number; style?: StyleProp<ViewStyle> }>) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        delay,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        useNativeDriver: true
      })
    ]).start();
  }, [delay, opacity, translateY]);

  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

export function PressScale({ children, style, ...rest }: PressableProps & { style?: StyleProp<ViewStyle> }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = (to: number) => {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 24,
      bounciness: 0
    }).start();
  };

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        {...rest}
        style={styles.fill}
        onPressIn={(e) => {
          animate(0.98);
          rest.onPressIn?.(e);
        }}
        onPressOut={(e) => {
          animate(1);
          rest.onPressOut?.(e);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
