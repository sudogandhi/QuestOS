import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

export function ReviewScreen() {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Screen>
      <Text style={styles.title}>Weekly review</Text>
      {["What worked?", "What blocked you?", "Suggested adjustments"].map((q) => (
        <View key={q} style={styles.card}>
          <Text style={styles.h2}>{q}</Text>
          <Text style={styles.body}>Reflect and tune your workload for next week.</Text>
        </View>
      ))}
      <PrimaryButton label="Apply adjustments" onPress={() => {}} />
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
    h2: {
      fontSize: tokens.type.h2,
      fontWeight: "700",
      color: colors.text,
      fontFamily: tokens.font.heading
    },
    body: {
      fontSize: tokens.type.body,
      color: colors.textMuted,
      fontFamily: tokens.font.body
    }
  });

