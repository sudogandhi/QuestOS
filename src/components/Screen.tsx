import { PropsWithChildren } from "react";
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type ScreenProps = PropsWithChildren<{
  centered?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, centered = false, contentContainerStyle }: ScreenProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View pointerEvents="none" style={[styles.bgOrbA, { backgroundColor: isDark ? "#4A2132" : "#FFE2EC" }]} />
      <View pointerEvents="none" style={[styles.bgOrbB, { backgroundColor: isDark ? "#2A3B44" : "#D8F8FF" }]} />
      <View pointerEvents="none" style={[styles.bgOrbC, { backgroundColor: isDark ? "#3D2D1E" : "#FFF4BF" }]} />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, centered && styles.contentCentered, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  bgOrbA: {
    position: "absolute",
    right: -56,
    top: -32,
    width: 210,
    height: 210,
    borderRadius: 999,
    opacity: 0.8
  },
  bgOrbB: {
    position: "absolute",
    left: -74,
    top: 188,
    width: 172,
    height: 172,
    borderRadius: 999,
    opacity: 0.75
  },
  bgOrbC: {
    position: "absolute",
    right: 56,
    bottom: 96,
    width: 124,
    height: 124,
    borderRadius: 999,
    opacity: 0.65
  },
  content: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.x2 + 40
  },
  contentCentered: {
    flexGrow: 1,
    justifyContent: "center"
  }
});
