import { StyleSheet, Text, View } from "react-native";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = {
  label: string;
  tone?: "normal" | "momentum" | "recovery" | "warning";
};

export function Pill({ label, tone = "normal" }: Props) {
  const { colors, isDark } = useAppTheme();

  const bg =
    tone === "momentum"
      ? colors.modeMomentum
      : tone === "recovery"
      ? colors.modeRecovery
      : tone === "warning"
      ? isDark
        ? "#4A2E14"
        : "#FFF7ED"
      : colors.modeNormal;

  const textColor = tone === "warning" ? (isDark ? "#FCD9B6" : "#9A3412") : colors.text;

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderWidth: 1,
    minHeight: 34
  },
  text: {
    fontSize: tokens.type.micro,
    fontWeight: "700",
    fontFamily: tokens.font.body,
    letterSpacing: 0.35
  }
});
