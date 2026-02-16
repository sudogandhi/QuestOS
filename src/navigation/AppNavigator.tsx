import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBrandIcon } from "../components/BrandIcon";
import { GoalsScreen } from "../screens/GoalsScreen";
import { OnboardingAgeScreen } from "../screens/OnboardingAgeScreen";
import { OnboardingGenderScreen } from "../screens/OnboardingGenderScreen";
import { OnboardingNameScreen } from "../screens/OnboardingNameScreen";
import { OnboardingWelcomeScreen } from "../screens/OnboardingWelcomeScreen";
import { OnboardingWizardScreen } from "../screens/OnboardingWizardScreen";
import { PlanPreviewScreen } from "../screens/PlanPreviewScreen";
import { PromptImportScreen } from "../screens/PromptImportScreen";
import { ReviewScreen } from "../screens/ReviewScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { SetupChoiceScreen } from "../screens/SetupChoiceScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { TodayScreen } from "../screens/TodayScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { UserProfile } from "../storage/userProfile";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

export type RootStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingName: undefined;
  OnboardingAge: { name: string };
  OnboardingGender: { name: string; age: number };
  Welcome: undefined;
  SetupChoice: undefined;
  OnboardingWizard: undefined;
  PromptImport:
    | {
        promptText?: string;
      }
    | undefined;
  PlanPreview:
    | {
        importSummary?: {
          importId: string;
          goalsCreated: number;
          actionsCreated: number;
          scheduleCreated: number;
        };
      }
    | undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 0);
  const bottomOffset = bottomInset > 0 ? bottomInset + 2 : 12;

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: bottomOffset,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          borderRadius: 24,
          borderTopWidth: 0,
          backgroundColor: isDark ? "rgba(24,18,22,0.98)" : "rgba(255,255,255,0.98)",
          shadowColor: "#5A1F33",
          shadowOpacity: 0.26,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
          borderWidth: 1.4,
          borderColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(32,26,23,0.14)"
        },
        tabBarLabelStyle: {
          fontFamily: tokens.font.body,
          fontSize: 11,
          fontWeight: "600"
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          const map: Record<string, string> = {
            Today: "flash-outline",
            Goals: "flag-outline",
            Stats: "stats-chart-outline",
            Review: "sparkles-outline",
            Settings: "settings-outline"
          };
          return (
            <TabBrandIcon
              name={map[route.name] || "ellipse-outline"}
              label={route.name}
              focused={focused}
            />
          );
        }
      })}
    >
      <Tabs.Screen name="Today" component={TodayScreen} />
      <Tabs.Screen name="Goals" component={GoalsScreen} />
      <Tabs.Screen name="Stats" component={StatsScreen} />
      <Tabs.Screen name="Review" component={ReviewScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator({ profile, hasGoals }: { profile: UserProfile | null; hasGoals: boolean }) {
  const { colors } = useAppTheme();
  const initialRouteName: keyof RootStackParamList = !profile ? "OnboardingWelcome" : hasGoals ? "MainTabs" : "SetupChoice";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        presentation: "card",
        animation: "slide_from_right",
        headerBackTitleVisible: false,
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: tokens.font.heading,
          fontSize: 16
        },
        contentStyle: { backgroundColor: colors.bg }
      }}
    >
      <Stack.Screen name="OnboardingWelcome" component={OnboardingWelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingName" component={OnboardingNameScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingAge" component={OnboardingAgeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingGender" component={OnboardingGenderScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SetupChoice" component={SetupChoiceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OnboardingWizard" component={OnboardingWizardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PromptImport" component={PromptImportScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PlanPreview" component={PlanPreviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
