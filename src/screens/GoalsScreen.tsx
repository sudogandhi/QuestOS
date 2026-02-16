import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

export function GoalsScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Screen>
      <Text style={styles.title}>Goals</Text>
      {["Get fit", "Switch career", "Sleep better"].map((goal) => (
        <View key={goal} style={styles.card}>
          <Text style={styles.goal}>{goal}</Text>
          <Text style={styles.meta}>Progress 42% • Due in 48 days</Text>
          <View style={styles.track}>
            <View style={styles.fill} />
          </View>
          <Text style={styles.next}>Next milestone: 5 consistent days</Text>
        </View>
      ))}
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
      gap: tokens.spacing.sm,
      ...tokens.shadow.card
    },
    goal: {
      fontSize: tokens.type.h2,
      fontWeight: "700",
      color: colors.text,
      fontFamily: tokens.font.heading
    },
    meta: {
      color: colors.textMuted,
      fontSize: tokens.type.caption,
      fontFamily: tokens.font.body
    },
    track: {
      height: 8,
      backgroundColor: colors.surface2,
      borderRadius: tokens.radius.pill,
      overflow: "hidden"
    },
    fill: {
      width: "42%",
      height: 8,
      backgroundColor: colors.primary
    },
    next: {
      color: colors.text,
      fontSize: tokens.type.caption,
      fontFamily: tokens.font.body
    }
  });

