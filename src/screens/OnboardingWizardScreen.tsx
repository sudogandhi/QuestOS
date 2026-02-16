import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingWizard">;

type WizardData = {
  goals: string;
  constraints: string;
  habits: string;
  impediments: string;
};

const stepLabels = [
  "Step 1: Goals",
  "Step 2: Constraints",
  "Step 3: Habits",
  "Step 4: Impediments"
] as const;

const prompts = {
  goals: "What are your top goals for the next 90 days?",
  constraints: "What constraints should the plan respect?",
  habits: "Which positive habits should be included daily/weekly?",
  impediments: "What common blockers should we account for?"
} as const;

export function OnboardingWizardScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);

  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    goals: "",
    constraints: "",
    habits: "",
    impediments: ""
  });

  const currentKey = step === 0 ? "goals" : step === 1 ? "constraints" : step === 2 ? "habits" : "impediments";
  const currentValue = data[currentKey];

  const isFinalStep = step === stepLabels.length - 1;

  const promptText = useMemo(() => {
    const fallback = "not provided";
    return [
      "Create a realistic, debt-aware QuestOS plan and output strict CSV only.",
      "Use headers: date,goal,action,stat,durationMin,difficulty,xp,kind",
      "Rules:",
      "- date format YYYY-MM-DD",
      "- stat in [body,mind,career,focus]",
      "- difficulty in [easy,medium,hard]",
      "- kind in [core,optional,recovery]",
      "- durationMin positive integer",
      "- xp non-negative integer",
      "Context:",
      `- Goals: ${data.goals.trim() || fallback}`,
      `- Constraints: ${data.constraints.trim() || fallback}`,
      `- Habits: ${data.habits.trim() || fallback}`,
      `- Impediments: ${data.impediments.trim() || fallback}`,
      "Generate at least 14 daily rows balanced across stats."
    ].join("\n");
  }, [data.constraints, data.goals, data.habits, data.impediments]);

  const onNext = () => {
    if (!currentValue.trim()) {
      return;
    }

    if (isFinalStep) {
      navigation.navigate("PromptImport", { promptText });
      return;
    }

    setStep((prev) => prev + 1);
  };

  const onBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setStep((prev) => prev - 1);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.root, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        style={styles.keyboardRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: 140 + Math.max(insets.bottom, 8) }]}
        >
          <Text style={styles.title}>Guided setup</Text>
          <Text style={styles.subtitle}>Answer four quick prompts. We will generate a ready-to-use CSV prompt.</Text>

          <View style={styles.stepRail}>
            {stepLabels.map((label, idx) => (
              <View key={label} style={[styles.stepPill, idx === step && { borderColor: colors.primary, backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.stepText, idx === step && { color: colors.primary }]}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{prompts[currentKey]}</Text>
            <TextInput
              multiline
              value={currentValue}
              onChangeText={(value) => setData((prev) => ({ ...prev, [currentKey]: value }))}
              placeholder="Type your answer"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={[styles.actionsBar, { backgroundColor: colors.bg, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 8) }]}>
          <View style={styles.actions}>
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [styles.backBtn, { borderColor: colors.border, backgroundColor: colors.surface }, pressed && { opacity: 0.85 }]}
            >
              <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
            </Pressable>
            <PrimaryButton label={isFinalStep ? "Generate Prompt" : "Next"} onPress={onNext} style={styles.nextBtn} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    root: {
      flex: 1
    },
    keyboardRoot: {
      flex: 1
    },
    content: {
      padding: tokens.spacing.lg,
      gap: tokens.spacing.md
    },
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
    stepRail: {
      gap: tokens.spacing.sm
    },
    stepPill: {
      minHeight: 42,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      justifyContent: "center",
      paddingHorizontal: tokens.spacing.md
    },
    stepText: {
      fontSize: tokens.type.caption,
      color: colors.textMuted,
      fontFamily: tokens.font.heading
    },
    card: {
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: tokens.spacing.md,
      gap: tokens.spacing.sm,
      ...tokens.shadow.card
    },
    label: {
      fontSize: tokens.type.body,
      color: colors.text,
      fontFamily: tokens.font.heading
    },
    input: {
      minHeight: 160,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface2,
      padding: tokens.spacing.md,
      color: colors.text,
      fontFamily: tokens.font.body,
      fontSize: tokens.type.body
    },
    actionsBar: {
      borderTopWidth: 1,
      paddingTop: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg
    },
    actions: {
      flexDirection: "row",
      gap: tokens.spacing.sm,
      alignItems: "center"
    },
    backBtn: {
      flex: 1,
      height: 56,
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center"
    },
    backText: {
      fontSize: tokens.type.body,
      fontFamily: tokens.font.heading
    },
    nextBtn: {
      flex: 1
    }
  });
