import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { Appearance } from "react-native";
import { darkColors, lightColors, ThemeColors } from "./palettes";

type ThemeMode = "system" | "light" | "dark";
type ResolvedMode = "light" | "dark";
type AccentTheme = "default" | "male" | "female" | "other";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  isDark: boolean;
  colors: ThemeColors;
  accent: AccentTheme;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentTheme) => void;
  setAccentFromGender: (gender: "male" | "female" | "other" | null | undefined) => void;
  cycleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function nextMode(mode: ThemeMode): ThemeMode {
  if (mode === "system") {
    return "light";
  }
  if (mode === "light") {
    return "dark";
  }
  return "system";
}

function accentFromGender(gender: "male" | "female" | "other" | null | undefined): AccentTheme {
  if (gender === "male" || gender === "female" || gender === "other") {
    return gender;
  }
  return "default";
}

function withAccent(base: ThemeColors, isDark: boolean, accent: AccentTheme): ThemeColors {
  const palette = {
    default: isDark
      ? { primary: "#FFD54A", primarySoft: "#5C4A14", primaryText: "#2A1A00" }
      : { primary: "#F4B400", primarySoft: "#FFE9A6", primaryText: "#2A1A00" },
    male: isDark
      ? { primary: "#60A5FA", primarySoft: "#1E3A5F", primaryText: "#041528" }
      : { primary: "#3B82F6", primarySoft: "#DBEAFE", primaryText: "#FFFFFF" },
    female: isDark
      ? { primary: "#FF7AA2", primarySoft: "#522437", primaryText: "#2A101B" }
      : { primary: "#FF5C8A", primarySoft: "#FFE2EC", primaryText: "#FFFFFF" },
    other: isDark
      ? { primary: "#4ADE80", primarySoft: "#1F4730", primaryText: "#052E16" }
      : { primary: "#22C55E", primarySoft: "#DCFCE7", primaryText: "#052E16" }
  }[accent];

  return {
    ...base,
    primary: palette.primary,
    primarySoft: palette.primarySoft,
    primaryText: palette.primaryText
  };
}

export function BrandThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [accent, setAccent] = useState<AccentTheme>("default");
  const system = Appearance.getColorScheme() === "dark" ? "dark" : "light";
  const resolvedMode: ResolvedMode = mode === "system" ? system : mode;
  const baseColors = resolvedMode === "dark" ? darkColors : lightColors;
  const colors = withAccent(baseColors, resolvedMode === "dark", accent);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedMode,
      isDark: resolvedMode === "dark",
      colors,
      accent,
      setMode,
      setAccent,
      setAccentFromGender: (gender) => setAccent(accentFromGender(gender)),
      cycleMode: () => setMode((prev) => nextMode(prev))
    }),
    [mode, resolvedMode, colors, accent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useAppTheme must be used inside BrandThemeProvider");
  }
  return value;
}
