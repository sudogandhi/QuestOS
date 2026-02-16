import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  AppSettings,
  getAppSettings,
  setNotificationsEnabled,
  setRolloverHour,
  setStrictness,
  strictnessLabel
} from "../storage/appSettings";
import { resetAllData } from "../storage/db";
import { exportPlanAsCsv } from "../storage/exportCsv";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type SettingsNav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const { colors, mode, setMode, setAccent } = useAppTheme();
  const styles = makeStyles(colors);
  const navigation = useNavigation<SettingsNav>();
  const [settings, setSettings] = useState<AppSettings>({
    strictness: "balanced",
    rolloverHour: 4,
    notificationsEnabled: false
  });

  useEffect(() => {
    void loadSettings();
  }, []);

  const loadSettings = async () => {
    const value = await getAppSettings();
    setSettings(value);
  };

  const cycleStrictness = async () => {
    const next = settings.strictness === "easy" ? "balanced" : settings.strictness === "balanced" ? "hardcore" : "easy";
    await setStrictness(next);
    setSettings((prev) => ({ ...prev, strictness: next }));
  };

  const cycleRolloverHour = async () => {
    const next = settings.rolloverHour === 4 ? 5 : settings.rolloverHour === 5 ? 6 : 4;
    await setRolloverHour(next);
    setSettings((prev) => ({ ...prev, rolloverHour: next }));
  };

  const toggleNotifications = async () => {
    const next = !settings.notificationsEnabled;
    await setNotificationsEnabled(next);
    setSettings((prev) => ({ ...prev, notificationsEnabled: next }));
  };

  const showPrivacyInfo = () => {
    Alert.alert(
      "Local-only privacy",
      "Your goals, schedule, and profile are stored on-device in local SQLite storage. No cloud sync is enabled."
    );
  };

  const exportCsv = async () => {
    try {
      const csv = await exportPlanAsCsv();
      if (csv.trim().split("\n").length <= 1) {
        Alert.alert("No data", "No plan rows found to export yet.");
        return;
      }
      await Share.share({
        title: "QuestOS Plan Export",
        message: csv
      });
    } catch (error) {
      Alert.alert("Export failed", error instanceof Error ? error.message : "Unknown error");
    }
  };

  const confirmReset = () => {
    Alert.alert("Reset all data?", "This will remove your profile, plan, logs, and settings from this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              await resetAllData();
              setAccent("default");
              navigation.reset({ index: 0, routes: [{ name: "OnboardingWelcome" }] });
            } catch (error) {
              Alert.alert("Reset failed", error instanceof Error ? error.message : "Unknown error");
            }
          })();
        }
      }
    ]);
  };

  return (
    <Screen>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.themeCard}>
        <Text style={styles.themeTitle}>Theme</Text>
        <View style={styles.themeRow}>
          <ThemeChip label="System" active={mode === "system"} onPress={() => setMode("system")} />
          <ThemeChip label="Light" active={mode === "light"} onPress={() => setMode("light")} />
          <ThemeChip label="Dark" active={mode === "dark"} onPress={() => setMode("dark")} />
        </View>
      </View>

      <SettingsRow label="Strictness slider" value={strictnessLabel(settings.strictness)} onPress={() => void cycleStrictness()} />
      <SettingsRow label="Day rollover time" value={`${settings.rolloverHour}:00`} onPress={() => void cycleRolloverHour()} />
      <SettingsRow label="Notifications" value={settings.notificationsEnabled ? "On" : "Off"} onPress={() => void toggleNotifications()} />
      <SettingsRow label="Privacy: local-only" value="Details" onPress={showPrivacyInfo} />
      <SettingsRow label="Export CSV" value="Share" onPress={() => void exportCsv()} />
      <SettingsRow label="Import/Replace plan" value="Open" onPress={() => navigation.navigate("PromptImport")} />
      <SettingsRow label="Reset data" value="Erase" danger onPress={confirmReset} />

      <Text style={styles.offline}>Offline mode enabled</Text>
    </Screen>
  );
}

function ThemeChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        chipStyles.base,
        {
          backgroundColor: active ? colors.primary : colors.surface2,
          borderColor: colors.border,
          opacity: pressed ? 0.86 : 1
        }
      ]}
    >
      <Text style={[chipStyles.text, { color: active ? colors.primaryText : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

function SettingsRow({
  label,
  value,
  onPress,
  danger = false
}: {
  label: string;
  value: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.86 }]}>
      <Text style={[styles.label, danger && { color: colors.danger }]}>{label}</Text>
      <Text style={[styles.value, danger && { color: colors.danger }]}>{value}</Text>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  base: {
    minWidth: 88,
    height: 36,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.spacing.md
  },
  text: {
    fontSize: tokens.type.caption,
    fontFamily: tokens.font.heading
  }
});

const makeStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    title: {
      fontSize: tokens.type.display,
      fontWeight: "700",
      color: colors.text,
      fontFamily: tokens.font.display
    },
    themeCard: {
      borderRadius: tokens.radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: tokens.spacing.md,
      gap: tokens.spacing.sm,
      ...tokens.shadow.card
    },
    themeTitle: {
      fontSize: tokens.type.h2,
      fontFamily: tokens.font.heading,
      color: colors.text
    },
    themeRow: {
      flexDirection: "row",
      gap: tokens.spacing.sm
    },
    row: {
      minHeight: 56,
      borderRadius: tokens.radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: tokens.spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      ...tokens.shadow.card
    },
    label: {
      fontSize: tokens.type.body,
      color: colors.text,
      fontFamily: tokens.font.body
    },
    value: {
      fontSize: tokens.type.caption,
      color: colors.textMuted,
      fontFamily: tokens.font.heading
    },
    offline: {
      textAlign: "center",
      fontSize: tokens.type.caption,
      color: colors.textMuted,
      fontFamily: tokens.font.body
    }
  });
