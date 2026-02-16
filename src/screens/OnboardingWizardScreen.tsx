import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingWizard">;

const steps = [
  "Step 1: Goals",
  "Step 2: Constraints",
  "Step 3: Habits and impediments",
  "Step 4: Generate plan prompt"
];

export function OnboardingWizardScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Screen>
      <Text style={styles.title}>Guided setup</Text>
      {steps.map((step) => (
        <View key={step} style={styles.step}>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
      <PrimaryButton label="Generate prompt" onPress={() => navigation.navigate("PromptImport")} />
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
  step: {
    height: 56,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: tokens.spacing.md,
    justifyContent: "center",
    ...tokens.shadow.card
  },
  stepText: {
    fontSize: tokens.type.body,
    color: colors.text,
    fontFamily: tokens.font.body
  }
});
