import { ReactNode, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, LayoutAnimation, Modal, Platform, Pressable, StyleSheet, Text, UIManager, View } from "react-native";
import { QuestCard } from "../components/QuestCard";
import { Screen } from "../components/Screen";
import { LevelBar } from "../components/LevelBar";
import { FadeInUp } from "../components/Motion";
import { Pill } from "../components/Pill";
import { PrimaryButton } from "../components/PrimaryButton";
import { sampleQuests, todaySummary } from "../data/mockData";
import { Quest } from "../types/domain";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";
import { logEvent } from "../storage/eventLog";
import { getTodaySchedule, logWrongDeed, updateScheduleStatus } from "../storage/planImport";
import { getUserProfile } from "../storage/userProfile";

export function TodayScreen() {
  const { colors } = useAppTheme();
  const [quests, setQuests] = useState(sampleQuests);
  const [userName, setUserName] = useState<string | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    void loadSchedule();
    void loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await getUserProfile();
    setUserName(profile?.name ?? null);
  };

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);
      const rows = await getTodaySchedule(today);
      if (rows.length === 0) {
        setQuests(sampleQuests);
      } else {
        setQuests(
          rows.map((row) => ({
            id: row.schedule_id,
            title: row.title,
            stat: row.stat,
            xp: row.xp,
            durationMin: row.duration_min,
            difficulty: row.difficulty,
            kind: row.kind,
            status: row.status
          }))
        );
      }
    } catch (error) {
      Alert.alert("Failed to load quests", error instanceof Error ? error.message : "Unknown error");
      setQuests(sampleQuests);
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(
    () => ({
      core: quests.filter((q) => q.kind === "core"),
      optional: quests.filter((q) => q.kind === "optional"),
      recovery: quests.filter((q) => q.kind === "recovery")
    }),
    [quests]
  );

  const setStatus = async (id: string, status: Quest["status"]) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    if (status === "done" || status === "skipped") {
      await updateScheduleStatus(id, status);
      await logEvent({
        eventType: status === "done" ? "quest_done" : "quest_skipped",
        entityType: "daily_schedule",
        entityId: id,
        payload: { status }
      });
    }
  };

  const modeTone =
    todaySummary.mode === "momentum" ? "momentum" : todaySummary.mode === "recovery" ? "recovery" : "normal";

  return (
    <>
      <Screen>
        {userName && <Text style={[styles.greeting, { color: colors.textMuted }]}>Welcome back, {userName}</Text>}
        <FadeInUp>
          <Text style={[styles.title, { color: colors.text }]}>Today</Text>
        </FadeInUp>

        <FadeInUp delay={60} style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.pills}>
            <Pill label={`Mode: ${todaySummary.mode}`} tone={modeTone} />
            <Pill label={`Debt: ${todaySummary.debt}`} tone="warning" />
            <Pill label={`Streak ${todaySummary.streak}`} />
          </View>
          <LevelBar level={todaySummary.level} xpToNext={todaySummary.xpToNext} progress={62} />
        </FadeInUp>

        <Section title="Core quests" delay={110}>
          {grouped.core.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              onDone={() => void setStatus(q.id, "done")}
              onSkip={() => void setStatus(q.id, "skipped")}
              onReplace={() => {}}
            />
          ))}
        </Section>

        <Section title="Optional boosters" delay={170}>
          {grouped.optional.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              onDone={() => void setStatus(q.id, "done")}
              onSkip={() => void setStatus(q.id, "skipped")}
              onReplace={() => {}}
            />
          ))}
        </Section>

        {grouped.recovery.length > 0 && (
          <Section title="Recovery quests" delay={230}>
            {grouped.recovery.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onDone={() => void setStatus(q.id, "done")}
                onSkip={() => void setStatus(q.id, "skipped")}
                onReplace={() => {}}
              />
            ))}
          </Section>
        )}

        {loading && (
          <View style={[styles.loadingRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading today schedule...</Text>
          </View>
        )}

        <FadeInUp delay={280}>
          <PrimaryButton label="Log Wrong Deed" onPress={() => setLogOpen(true)} />
        </FadeInUp>
      </Screen>

      <Modal visible={logOpen} transparent animationType="slide" onRequestClose={() => setLogOpen(false)}>
        <View style={[styles.sheetBackdrop, { backgroundColor: colors.overlay }]}>
          <View style={[styles.sheet, { backgroundColor: colors.bg }]}>
            <Text style={[styles.sheetTitle, { color: colors.text }]}>Wrong deed</Text>
            <Text style={[styles.sheetText, { color: colors.textMuted }]}>Slip logged. Here is how we recover.</Text>

            <View style={[styles.sheetCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Text style={[styles.sheetLabel, { color: colors.text }]}>Habit tag</Text>
            </View>
            <View style={[styles.sheetCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Text style={[styles.sheetLabel, { color: colors.text }]}>Intensity</Text>
            </View>
            <View style={[styles.sheetCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Text style={[styles.sheetLabel, { color: colors.text }]}>Trigger</Text>
            </View>
            <View style={[styles.sheetCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Text style={[styles.sheetLabel, { color: colors.text }]}>Impact: +12 debt, add 1 recovery quest tomorrow</Text>
            </View>

            <PrimaryButton
              label="Confirm"
              onPress={() => {
                void logWrongDeed({
                  stat: "focus",
                  intensity: "medium",
                  trigger: "stress",
                  debtXp: 12
                }).catch((error) => {
                  Alert.alert("Failed to log wrong deed", error instanceof Error ? error.message : "Unknown error");
                });
                setLogOpen(false);
              }}
            />
            <Pressable onPress={() => setLogOpen(false)}>
              <Text style={[styles.cancel, { color: colors.textMuted }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

function Section({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) {
  const { colors } = useAppTheme();

  return (
    <FadeInUp delay={delay}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <View style={styles.stack}>{children}</View>
      </View>
    </FadeInUp>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: tokens.type.caption,
    fontFamily: tokens.font.body
  },
  title: {
    fontSize: tokens.type.display,
    fontWeight: "700",
    fontFamily: tokens.font.display,
    letterSpacing: -0.2
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    gap: tokens.spacing.md,
    ...tokens.shadow.card
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.spacing.sm
  },
  section: {
    gap: tokens.spacing.sm
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: "700",
    fontFamily: tokens.font.heading
  },
  stack: {
    gap: tokens.spacing.sm
  },
  loadingRow: {
    minHeight: 44,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacing.sm
  },
  loadingText: {
    fontSize: tokens.type.caption,
    fontFamily: tokens.font.body
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    maxHeight: "80%",
    borderTopLeftRadius: tokens.radius.lg,
    borderTopRightRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    borderTopWidth: 1,
    borderColor: "rgba(23, 33, 29, 0.08)"
  },
  sheetTitle: {
    fontSize: tokens.type.h2,
    fontWeight: "700",
    fontFamily: tokens.font.heading
  },
  sheetText: {
    fontSize: tokens.type.body,
    fontFamily: tokens.font.body
  },
  sheetCard: {
    height: 52,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    justifyContent: "center",
    paddingHorizontal: tokens.spacing.md
  },
  sheetLabel: {
    fontSize: tokens.type.body,
    fontFamily: tokens.font.body
  },
  cancel: {
    textAlign: "center",
    fontSize: tokens.type.body,
    fontFamily: tokens.font.body
  }
});
