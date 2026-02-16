import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type TabIconProps = {
  name: string;
  label: string;
  focused: boolean;
};

export function TabBrandIcon({ name, label, focused }: TabIconProps) {
  const { colors } = useAppTheme();
  const scale = useRef(new Animated.Value(focused ? 1 : 0.92)).current;
  const lift = useRef(new Animated.Value(focused ? -2 : 0)).current;
  const halo = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1 : 0.92,
        useNativeDriver: true,
        speed: 22,
        bounciness: 0
      }),
      Animated.spring(lift, {
        toValue: focused ? -2 : 0,
        useNativeDriver: true,
        speed: 22,
        bounciness: 0
      }),
      Animated.timing(halo, {
        toValue: focused ? 1 : 0,
        duration: 220,
        useNativeDriver: true
      })
    ]).start();
  }, [focused, halo, lift, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY: lift }] }}>
      <View style={styles.wrap}>
        <Animated.View
          style={[
            styles.halo,
            {
              opacity: halo,
              backgroundColor: colors.primarySoft
            }
          ]}
        />
        <View style={[styles.iconWrap, { backgroundColor: focused ? colors.primarySoft : "transparent" }]}>
          <Ionicons name={name as never} size={18} color={focused ? colors.primary : colors.textMuted} />
        </View>
        <Text style={[styles.label, { color: focused ? colors.primary : colors.textMuted }]}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 3
  },
  halo: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 999,
    top: 0
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    fontSize: 10,
    fontFamily: tokens.font.body,
    fontWeight: "700",
    letterSpacing: 0.2
  }
});
