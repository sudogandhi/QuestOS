import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "SetupChoice">;

type SetupChoice = "guided" | "import" | "blank";

const choices: Array<{ id: SetupChoice; title: string; caption: string }> = [
  { id: "guided", title: "Guided setup (AI prompt)", caption: "Answer questions, copy prompt, paste CSV" },
  { id: "import", title: "Import CSV", caption: "Import from template or coach output" },
  { id: "blank", title: "Start blank", caption: "Create goals and actions manually" }
];

export function SetupChoiceScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [selected, setSelected] = useState<SetupChoice | null>(null);

  const onContinue = () => {
    if (!selected) {
      return;
    }

    if (selected === "guided") {
      navigation.navigate("OnboardingWizard");
      return;
    }

    if (selected === "import") {
      navigation.navigate("PromptImport");
      return;
    }

    navigation.navigate("MainTabs");
  };

  return (
    <Screen>
      <Text style={styles.title}>Set up your plan</Text>
      <Text style={styles.subtitle}>Works fully offline.</Text>
      {choices.map((choice) => (
        <Pressable
          key={choice.id}
          onPress={() => setSelected(choice.id)}
          style={({ pressed }) => [
            styles.card,
            selected === choice.id && { borderColor: colors.primary, backgroundColor: colors.primarySoft },
            pressed && { opacity: 0.9 }
          ]}
        >
          <Text style={styles.cardTitle}>{choice.title}</Text>
          <Text style={styles.cardCaption}>{choice.caption}</Text>
        </Pressable>
      ))}
      <PrimaryButton
        label="Continue"
        onPress={onContinue}
        variant={selected ? "primary" : "secondary"}
        style={!selected ? styles.disabledButton : undefined}
      />
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
  card: {
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: tokens.spacing.md,
    gap: tokens.spacing.xs,
    ...tokens.shadow.card
  },
  cardTitle: {
    fontSize: tokens.type.h2,
    fontWeight: "700",
    color: colors.text,
    fontFamily: tokens.font.heading
  },
  cardCaption: {
    fontSize: tokens.type.caption,
    color: colors.textMuted,
    fontFamily: tokens.font.body
  },
  disabledButton: {
    opacity: 0.7
  }
});
