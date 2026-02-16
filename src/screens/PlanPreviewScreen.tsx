import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "PlanPreview">;

export function PlanPreviewScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const summary = route.params?.importSummary;

  return (
    <Screen>
      <Text style={styles.title}>Plan preview</Text>
      <Text style={styles.subtitle}>Edit before activating.</Text>
      {summary && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Import ID: {summary.importId}</Text>
          <Text style={styles.summaryText}>Goals created: {summary.goalsCreated}</Text>
          <Text style={styles.summaryText}>Actions created: {summary.actionsCreated}</Text>
          <Text style={styles.summaryText}>Schedule rows: {summary.scheduleCreated}</Text>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.h2}>Today preview: 3 core + 2 optional + recovery</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.h2}>Milestones timeline</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.h2}>Actions with difficulty and XP</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          label="Activate plan"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] })}
        />
        <PrimaryButton label="Import another CSV" variant="secondary" onPress={() => navigation.navigate("PromptImport")} />
        <PrimaryButton label="Back to setup" variant="secondary" onPress={() => navigation.navigate("SetupChoice")} />
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
    subtitle: {
      fontSize: tokens.type.body,
      color: colors.textMuted,
      fontFamily: tokens.font.body
    },
    summaryCard: {
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      borderColor: colors.info,
      backgroundColor: colors.primarySoft,
      padding: tokens.spacing.md,
      gap: tokens.spacing.xs
    },
    summaryText: {
      fontSize: tokens.type.caption,
      color: colors.info,
      fontFamily: tokens.font.body
    },
    card: {
      minHeight: 80,
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: tokens.spacing.md,
      justifyContent: "center",
      ...tokens.shadow.card
    },
    h2: {
      color: colors.text,
      fontSize: tokens.type.body,
      fontWeight: "600",
      fontFamily: tokens.font.heading
    },
    actions: {
      gap: tokens.spacing.sm
    }
  });
