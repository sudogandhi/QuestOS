import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import FriendlyGuyAvatarArt from "../assets/illustrations/undraw_friendly-guy-avatar_ibbp.svg";
import { OnboardingArt } from "../components/OnboardingArt";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { RootStackParamList } from "../navigation/AppNavigator";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "OnboardingName">;

export function OnboardingNameScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const active = focused || name.trim().length > 0;
    Animated.timing(float, {
      toValue: active ? 1 : 0,
      duration: 180,
      useNativeDriver: false
    }).start();
  }, [float, focused, name]);

  const onContinue = () => {
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      Alert.alert("Name required", "Drop your name so we can personalize your journey.");
      return;
    }
    if (/\d/.test(cleanName)) {
      Alert.alert("Invalid name", "Name cannot contain numbers.");
      return;
    }
    navigation.navigate("OnboardingAge", { name: cleanName });
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardRoot} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
      <Screen centered contentContainerStyle={styles.screenContent}>
        <View style={styles.wrap}>
          <OnboardingArt Art={FriendlyGuyAvatarArt} />
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>Your name powers your daily check-ins and win messages.</Text>
          <View style={styles.card}>
            <View style={styles.fieldWrap}>
              <Animated.Text
                style={[
                  styles.floatingLabel,
                  {
                    color: colors.textMuted,
                    top: float.interpolate({ inputRange: [0, 1], outputRange: [16, -8] }),
                    fontSize: float.interpolate({ inputRange: [0, 1], outputRange: [tokens.type.body, tokens.type.caption] }),
                    opacity: float
                  }
                ]}
              >
                Name
              </Animated.Text>
              <TextInput
                value={name}
                onChangeText={(value) => setName(value.replace(/\d+/g, ""))}
                placeholder={focused ? "" : "Name"}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </View>
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
    fieldWrap: {
      position: "relative",
      paddingTop: 12
    },
    floatingLabel: {
      position: "absolute",
      left: tokens.spacing.md,
      fontFamily: tokens.font.body,
      zIndex: 1
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
