import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getPlanPreviewData, PlanPreviewData } from "../storage/planImport";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "PlanPreview">;
type PreviewSection = "today" | "milestones" | "actions";

export function PlanPreviewScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const summary = route.params?.importSummary;
  const [activeSection, setActiveSection] = useState<PreviewSection | null>("today");
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<PlanPreviewData>({
    todayCounts: { core: 0, optional: 0, recovery: 0 },
    milestones: [],
    actionStats: { easy: 0, medium: 0, hard: 0, totalXp: 0 }
  });

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10);
        const data = await getPlanPreviewData(today);
        setPreview(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

      <PreviewCard
        title="Today preview"
        active={activeSection === "today"}
        onPress={() => setActiveSection((prev) => (prev === "today" ? null : "today"))}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.detailText}>
            {preview.todayCounts.core} core + {preview.todayCounts.optional} optional + {preview.todayCounts.recovery} recovery
          </Text>
        )}
      </PreviewCard>

      <PreviewCard
        title="Milestones timeline"
        active={activeSection === "milestones"}
        onPress={() => setActiveSection((prev) => (prev === "milestones" ? null : "milestones"))}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : preview.milestones.length === 0 ? (
          <Text style={styles.detailText}>No milestones yet. Import goals with target dates to see timeline.</Text>
        ) : (
          preview.milestones.map((m) => (
            <Text key={`${m.title}-${m.targetDate ?? "none"}`} style={styles.detailText}>
              • {m.title} {m.targetDate ? `(${m.targetDate})` : "(no target date)"} - {m.status}
            </Text>
          ))
        )}
      </PreviewCard>

      <PreviewCard
        title="Actions with difficulty and XP"
        active={activeSection === "actions"}
        onPress={() => setActiveSection((prev) => (prev === "actions" ? null : "actions"))}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <Text style={styles.detailText}>Easy: {preview.actionStats.easy}</Text>
            <Text style={styles.detailText}>Medium: {preview.actionStats.medium}</Text>
            <Text style={styles.detailText}>Hard: {preview.actionStats.hard}</Text>
            <Text style={styles.detailText}>Total XP budget: {preview.actionStats.totalXp}</Text>
          </>
        )}
      </PreviewCard>

      <View style={styles.actions}>
        <PrimaryButton
          label="Activate plan"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] })}
        />
        <PrimaryButton label="Import another CSV" variant="secondary" onPress={() => navigation.navigate("OnboardingWizard")} />
        <PrimaryButton label="Back to setup" variant="secondary" onPress={() => navigation.navigate("SetupChoice")} />
      </View>
    </Screen>
  );
}

function PreviewCard({
  title,
  active,
  onPress,
  children
}: {
  title: string;
  active: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, active && { borderColor: colors.primary, backgroundColor: colors.primarySoft }, pressed && { opacity: 0.9 }]}
    >
      <Text style={styles.h2}>{title}</Text>
      {active && <View style={styles.detailWrap}>{children}</View>}
      {!active && <Text style={styles.tapHint}>Tap to view details</Text>}
    </Pressable>
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
      minHeight: 72,
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: tokens.spacing.md,
      gap: tokens.spacing.xs,
      ...tokens.shadow.card
    },
    h2: {
      color: colors.text,
      fontSize: tokens.type.body,
      fontWeight: "600",
      fontFamily: tokens.font.heading
    },
    tapHint: {
      color: colors.textMuted,
      fontSize: tokens.type.caption,
      fontFamily: tokens.font.body
    },
    detailWrap: {
      gap: 4
    },
    detailText: {
      color: colors.text,
      fontSize: tokens.type.caption,
      fontFamily: tokens.font.body
    },
    actions: {
      gap: tokens.spacing.sm
    }
  });
