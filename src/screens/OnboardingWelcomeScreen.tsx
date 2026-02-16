import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { OnboardingArt } from "../components/OnboardingArt";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingWelcome">;

export function OnboardingWelcomeScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);

  return (
    <Screen centered contentContainerStyle={styles.screenContent}>
      <View style={styles.wrap}>
        <OnboardingArt />
        <Text style={styles.title}>Welcome to QuestOS</Text>
        <Text style={styles.subtitle}>Build streaks, not stress. Tiny wins compound into serious progress.</Text>
        <PrimaryButton label="Let's get productive" onPress={() => navigation.navigate("OnboardingName")} style={styles.cta} />
      </View>
    </Screen>
  );
}

const makeStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    screenContent: {
      alignItems: "center"
    },
    wrap: {
      width: "100%",
      maxWidth: 460,
      alignItems: "center",
      gap: tokens.spacing.md
    },
    title: {
      fontSize: tokens.type.display,
      fontWeight: "700",
      color: colors.text,
      fontFamily: tokens.font.display,
      textAlign: "center"
    },
    subtitle: {
      fontSize: tokens.type.body,
      color: colors.textMuted,
      fontFamily: tokens.font.body,
      textAlign: "center"
    },
    cta: {
      width: "100%"
    }
  });
