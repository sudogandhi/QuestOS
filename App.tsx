import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  useFonts as useJakartaFonts
} from "@expo-google-fonts/plus-jakarta-sans";
import { Sora_700Bold, useFonts as useSoraFonts } from "@expo-google-fonts/sora";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { initDatabase } from "./src/storage/db";
import { getUserProfile, UserProfile } from "./src/storage/userProfile";
import { BrandThemeProvider, useAppTheme } from "./src/theme/ThemeProvider";

function AppContent() {
  const { colors, isDark, setAccentFromGender } = useAppTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [jakartaLoaded] = useJakartaFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold
  });
  const [soraLoaded] = useSoraFonts({
    Sora_700Bold
  });

  useEffect(() => {
    initDatabase()
      .then(() => getUserProfile())
      .then((savedProfile) => {
        setProfile(savedProfile);
        setAccentFromGender(savedProfile?.gender);
      })
      .catch((error) => {
        Alert.alert("Database init failed", error instanceof Error ? error.message : "Unknown error");
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  if (!jakartaLoaded || !soraLoaded || !ready) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.bg,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary
    }
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator profile={profile} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BrandThemeProvider>
        <AppContent />
      </BrandThemeProvider>
    </SafeAreaProvider>
  );
}
