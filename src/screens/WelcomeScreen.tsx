import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Screen>
      <Text style={styles.title}>QuestOS</Text>
      <Text style={styles.subtitle}>Goals to quests to XP to level up.</Text>
      <View style={styles.card}>
        <Text style={styles.body}>Turn your goals into daily action loops with debt-aware recovery.</Text>
      </View>
      <PrimaryButton label="Import Plan (CSV)" variant="secondary" onPress={() => navigation.navigate("PromptImport")} />
      <PrimaryButton label="Start" onPress={() => navigation.navigate("SetupChoice")} />
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
    ...tokens.shadow.card
  },
  body: {
    fontSize: tokens.type.body,
    color: colors.text,
    fontFamily: tokens.font.body
  }
});
