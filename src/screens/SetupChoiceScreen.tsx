import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text } from "react-native";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "SetupChoice">;

const choices = [
  ["Guided setup (AI prompt)", "Answer questions, copy prompt, paste CSV"],
  ["Import CSV", "Import from template or coach output"],
  ["Start blank", "Create goals and actions manually"]
];

export function SetupChoiceScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Screen>
      <Text style={styles.title}>Set up your plan</Text>
      <Text style={styles.subtitle}>Works fully offline.</Text>
      {choices.map(([title, caption]) => (
        <Pressable key={String(title)} style={styles.card}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardCaption}>{caption}</Text>
        </Pressable>
      ))}
      <PrimaryButton label="Continue" onPress={() => navigation.navigate("OnboardingWizard")} />
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
  }
});
