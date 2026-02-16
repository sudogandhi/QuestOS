import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Quest } from "../types/domain";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = {
  quest: Quest;
  onDone: () => void;
  onSkip: () => void;
  onReplace: () => void;
};

export function QuestCard({ quest, onDone, onSkip, onReplace }: Props) {
  const { colors, isDark } = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (quest.status === "done") {
      Animated.sequence([
        Animated.spring(scale, { toValue: 0.985, useNativeDriver: true, speed: 26, bounciness: 0 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 26, bounciness: 0 })
      ]).start();

      Animated.parallel([
        Animated.timing(badgeOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(flash, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.timing(flash, { toValue: 0, duration: 260, useNativeDriver: true })
        ])
      ]).start();
    } else if (quest.status === "pending") {
      badgeOpacity.setValue(0);
      flash.setValue(0);
    }
  }, [badgeOpacity, flash, quest.status, scale]);

  const kindTone =
    quest.kind === "recovery" ? styles.kindRecovery : quest.kind === "optional" ? styles.kindOptional : styles.kindCore;

  const statusDone = quest.status === "done";
  const statusSkipped = quest.status === "skipped";

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View
        style={[
          styles.card,
          kindTone,
          {
            backgroundColor: isDark ? "rgba(29, 22, 26, 0.94)" : "rgba(255, 255, 255, 0.95)",
            borderColor: colors.border
          },
          statusDone && { backgroundColor: isDark ? "#2F2430" : "#FFF0F5" },
          statusSkipped && { opacity: 0.7 }
        ]}
      >
        <Animated.View style={[styles.flashLayer, { backgroundColor: colors.primarySoft, opacity: flash }]} />

        <View style={styles.metaRow}>
          <Text style={[styles.title, { color: colors.text }]}>{quest.title}</Text>
          {quest.kind === "recovery" && <Text style={[styles.recovery, { backgroundColor: colors.modeRecovery }]}>RECOVERY</Text>}
        </View>

        <Text style={[styles.meta, { color: colors.textMuted }]}>+{quest.xp} XP | {quest.durationMin}m | {quest.stat}</Text>

        <Animated.View style={[styles.doneBadge, { opacity: badgeOpacity }]}>
          <Text style={styles.doneBadgeText}>Locked In</Text>
        </Animated.View>

        <View style={styles.actions}>
          <ActionChip label="Done" onPress={onDone} tone={colors.surface2} textColor={colors.text} border={colors.border} />
          <ActionChip label="Skip" onPress={onSkip} tone={colors.surface2} textColor={colors.text} border={colors.border} />
          <ActionChip
            label="Replace"
            onPress={onReplace}
            tone={isDark ? "#35242B" : "#FFE7F0"}
            textColor={colors.primary}
            border={colors.border}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function ActionChip({
  label,
  onPress,
  tone,
  textColor,
  border
}: {
  label: string;
  onPress: () => void;
  tone: string;
  textColor: string;
  border: string;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, { backgroundColor: tone, borderColor: border }, pressed && styles.pressed]}>
      <Text style={[styles.chipText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm,
    overflow: "hidden",
    ...tokens.shadow.card
  },
  flashLayer: {
    ...StyleSheet.absoluteFillObject
  },
  kindCore: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF8FB1"
  },
  kindOptional: {
    borderLeftWidth: 4,
    borderLeftColor: "#67D7E5"
  },
  kindRecovery: {
    borderLeftWidth: 4,
    borderLeftColor: "#F5B14A"
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.spacing.sm
  },
  title: {
    flex: 1,
    fontWeight: "700",
    fontSize: tokens.type.body,
    fontFamily: tokens.font.heading
  },
  recovery: {
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    fontSize: tokens.type.micro,
    fontWeight: "700"
  },
  meta: {
    fontSize: tokens.type.caption,
    fontFamily: tokens.font.body
  },
  doneBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    backgroundColor: "#B71D50"
  },
  doneBadgeText: {
    color: "#FFE7F0",
    fontSize: tokens.type.micro,
    fontFamily: tokens.font.heading
  },
  actions: {
    flexDirection: "row",
    gap: tokens.spacing.sm
  },
  chip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    minHeight: 36
  },
  chipText: {
    fontSize: tokens.type.caption,
    fontWeight: "600",
    fontFamily: tokens.font.body
  },
  pressed: {
    opacity: 0.82
  }
});
