import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

export function StatsScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Screen>
      <Text style={styles.title}>Stats</Text>
      <View style={styles.card}>
        <Text style={styles.h2}>Performance by stat</Text>
        {[
          ["Body", 74],
          ["Mind", 68],
          ["Career", 61],
          ["Focus", 57]
        ].map(([label, value]) => (
          <View key={String(label)} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${value}%` }]} />
            </View>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.h2}>Debt ledger</Text>
        <Text style={styles.meta}>Focus: 20 • Body: 12 • Career: 13</Text>
      </View>
    </Screen>
  );
}

const makeStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    title: {
      fontSize: tokens.type.display,
      fontWeight: "700",
      color: colors.text,
      fontFamily: tokens.font.display
    },
    card: {
      borderRadius: tokens.radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: tokens.spacing.md,
      gap: tokens.spacing.md,
      ...tokens.shadow.card
    },
    h2: {
      fontSize: tokens.type.h2,
      color: colors.text,
      fontWeight: "700",
      fontFamily: tokens.font.heading
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: tokens.spacing.sm
    },
    label: {
      width: 54,
      fontSize: tokens.type.caption,
      color: colors.text,
      fontFamily: tokens.font.body
    },
    track: {
      flex: 1,
      height: 8,
      borderRadius: tokens.radius.pill,
      backgroundColor: colors.surface2,
      overflow: "hidden"
    },
    fill: {
      height: 8,
      backgroundColor: colors.primary
    },
    value: {
      width: 24,
      textAlign: "right",
      color: colors.textMuted,
      fontSize: tokens.type.caption,
      fontFamily: tokens.font.body
    },
    meta: {
      color: colors.text,
      fontSize: tokens.type.body,
      fontFamily: tokens.font.body
    }
  });

