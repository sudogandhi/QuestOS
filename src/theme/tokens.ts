import { Platform } from "react-native";

export const tokens = {
  colors: {
    bg: "#FFF8F2",
    surface: "#FFFFFF",
    surface2: "#FFF1E6",
    text: "#201A17",
    textMuted: "#6E5A52",
    border: "#F2D7C4",
    primary: "#F4B400",
    primaryText: "#2A1A00",
    primarySoft: "#FFE9A6",
    success: "#16A34A",
    warning: "#EA580C",
    danger: "#DC2626",
    info: "#0284C7",
    modeNormal: "#FFE6D5",
    modeMomentum: "#D8F8FF",
    modeRecovery: "#FFF4BF"
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    x2: 24
  },
  radius: {
    sm: 12,
    md: 16,
    lg: 22,
    pill: 999
  },
  type: {
    display: 30,
    h2: 18,
    body: 15,
    caption: 12,
    micro: 10
  },
  font: {
    display: Platform.select({ ios: "Sora_700Bold", android: "Sora_700Bold", default: "System" }),
    heading: Platform.select({
      ios: "PlusJakartaSans_700Bold",
      android: "PlusJakartaSans_700Bold",
      default: "System"
    }),
    body: Platform.select({
      ios: "PlusJakartaSans_500Medium",
      android: "PlusJakartaSans_500Medium",
      default: "System"
    })
  },
  shadow: {
    card: {
      shadowColor: "#5A1F33",
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4
    },
    floating: {
      shadowColor: "#5A1F33",
      shadowOpacity: 0.2,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8
    }
  }
} as const;
