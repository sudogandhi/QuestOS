import { StyleSheet, Text, View } from "react-native";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = {
  level: number;
  xpToNext: number;
  progress: number;
};

export function LevelBar({ level, xpToNext, progress }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Level {level}</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>+{xpToNext} XP to next</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
        <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.spacing.sm
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    fontSize: tokens.type.caption,
    fontWeight: "700",
    fontFamily: tokens.font.heading
  },
  sub: {
    fontSize: tokens.type.caption,
    fontFamily: tokens.font.body
  },
  track: {
    height: 14,
    borderRadius: tokens.radius.pill,
    overflow: "hidden",
    borderWidth: 1
  },
  fill: {
    height: 14,
    backgroundColor: tokens.colors.primary
  }
});
