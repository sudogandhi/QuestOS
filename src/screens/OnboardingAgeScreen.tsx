import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import MathematicsArt from "../assets/illustrations/undraw_mathematics_0j2b.svg";
import { OnboardingArt } from "../components/OnboardingArt";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingAge">;

export function OnboardingAgeScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [age, setAge] = useState("");

  const onContinue = () => {
    const parsedAge = Number(age);
    if (!Number.isFinite(parsedAge) || parsedAge < 5 || parsedAge > 120) {
      Alert.alert("Invalid age", "Enter a valid age between 5 and 120.");
      return;
    }

    navigation.navigate("OnboardingGender", {
      name: route.params.name,
      age: parsedAge
    });
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardRoot} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
      <Screen centered contentContainerStyle={styles.screenContent}>
        <View style={styles.wrap}>
          <OnboardingArt Art={MathematicsArt} />
          <Text style={styles.title}>How many levels have you unlocked IRL?</Text>
          <Text style={styles.subtitle}>Age helps us keep your challenge tone just right.</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Age</Text>
          <TextInput
            value={age}
            onChangeText={(value) => setAge(value.replace(/[^\d]/g, ""))}
            placeholder="Type your age"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
              keyboardType="number-pad"
              maxLength={3}
              returnKeyType="done"
            />
          </View>
          <PrimaryButton label="Continue" onPress={onContinue} style={styles.cta} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: ReturnType<typeof useAppTheme>["colors"]) =>
  StyleSheet.create({
    keyboardRoot: {
      flex: 1,
      backgroundColor: colors.bg
    },
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
    card: {
      width: "100%",
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: tokens.spacing.md,
      gap: tokens.spacing.sm,
      ...tokens.shadow.card
    },
    label: {
      fontSize: tokens.type.caption,
      color: colors.text,
      fontFamily: tokens.font.heading
    },
    input: {
      height: 48,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: tokens.spacing.md,
      backgroundColor: colors.surface2,
      color: colors.text,
      fontFamily: tokens.font.body,
      fontSize: tokens.type.body
    },
    cta: {
      width: "100%"
    }
  });
