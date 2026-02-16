import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import AiCodeGenerationArt from "../assets/illustrations/undraw_ai-code-generation_imyw.svg";
import { OnboardingArt } from "../components/OnboardingArt";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { saveUserProfile } from "../storage/userProfile";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingGender">;
type Gender = "male" | "female" | "other";

export function OnboardingGenderScreen({ navigation, route }: Props) {
  const { colors, setAccentFromGender } = useAppTheme();
  const styles = makeStyles(colors);
  const [gender, setGender] = useState<Gender>("male");
  const [saving, setSaving] = useState(false);

  const onSelectGender = (value: Gender) => {
    setGender(value);
    setAccentFromGender(value);
  };

  const onFinish = async () => {
    try {
      setSaving(true);
      setAccentFromGender(gender);
      await saveUserProfile({
        name: route.params.name,
        age: route.params.age,
        gender
      });
      navigation.replace("SetupChoice");
    } catch (error) {
      Alert.alert("Could not save profile", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen centered contentContainerStyle={styles.screenContent}>
      <View style={styles.wrap}>
        <OnboardingArt Art={AiCodeGenerationArt} />
        <Text style={styles.title}>How do you identify?</Text>
        <Text style={styles.subtitle}>Choose what fits best. You can change this later in settings.</Text>
        <View style={styles.card}>
          <View style={styles.genderRow}>
            <GenderChip label="Male" value="male" current={gender} onPress={onSelectGender} />
            <GenderChip label="Female" value="female" current={gender} onPress={onSelectGender} />
            <GenderChip label="Other" value="other" current={gender} onPress={onSelectGender} />
          </View>
        </View>
        <PrimaryButton label={saving ? "Saving..." : "Finish Setup"} onPress={() => void onFinish()} style={styles.cta} />
      </View>
    </Screen>
  );
}

function GenderChip({
  label,
  value,
  current,
  onPress
}: {
  label: string;
  value: Gender;
  current: Gender;
  onPress: (value: Gender) => void;
}) {
  const { colors } = useAppTheme();
  const active = current === value;

  return (
    <Pressable
      onPress={() => onPress(value)}
      style={({ pressed }) => [
        chipStyles.base,
        {
          backgroundColor: active ? colors.primary : colors.surface2,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1
        }
      ]}
    >
      <Text style={[chipStyles.text, { color: active ? colors.primaryText : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  base: {
    minWidth: 84,
    height: 38,
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
    genderRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: tokens.spacing.sm
    },
    cta: {
      width: "100%"
    }
  });
