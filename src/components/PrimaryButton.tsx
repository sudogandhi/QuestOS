import { StyleSheet, Text, ViewStyle } from "react-native";
import { PressScale } from "./Motion";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, variant = "primary", style }: Props) {
  const { colors } = useAppTheme();

  return (
    <PressScale
      onPress={onPress}
      style={[
        styles.base,
        variant === "primary"
          ? { backgroundColor: colors.primary, borderColor: "rgba(0,0,0,0.1)" }
          : { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
        style
      ]}
    >
      <Text style={[styles.text, variant === "secondary" ? { color: colors.text } : { color: colors.primaryText }]}>
        {label}
      </Text>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    ...tokens.shadow.floating
  },
  text: {
    fontSize: tokens.type.body,
    fontWeight: "700",
    fontFamily: tokens.font.heading,
    letterSpacing: 0.35
  }
});
