import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { parseAndValidatePlanCsv } from "../import/csvPlan";
import { RootStackParamList } from "../navigation/AppNavigator";
import { importPlanRows } from "../storage/planImport";
import { tokens } from "../theme/tokens";
import { useAppTheme } from "../theme/ThemeProvider";

type Props = NativeStackScreenProps<RootStackParamList, "PromptImport">;

const prompt = "Create CSV columns: date, goal, action, stat, durationMin, difficulty, xp";

export function PromptImportScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const styles = makeStyles(colors);
  const [csvText, setCsvText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const preview = useMemo(() => parseAndValidatePlanCsv(csvText), [csvText]);

  const handleImport = async () => {
    const result = parseAndValidatePlanCsv(csvText);
    if (result.errors.length > 0) {
      setErrors(result.errors.slice(0, 8).map((e) => `L${e.line}${e.field ? ` ${e.field}` : ""}: ${e.message}`));
      return;
    }

    setErrors([]);
    try {
      setIsImporting(true);
      const summary = await importPlanRows(result.rows);
      navigation.navigate("PlanPreview", { importSummary: summary });
    } catch (error) {
      Alert.alert("Import failed", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Generate your plan</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prompt</Text>
        <Text style={styles.cardBody}>{prompt}</Text>
      </View>
      <Text style={styles.label}>Paste CSV output</Text>
      <TextInput
        multiline
        style={styles.input}
        value={csvText}
        onChangeText={setCsvText}
        placeholder="date,goal,action,stat,durationMin,difficulty,xp"
        placeholderTextColor={colors.textMuted}
      />
      <Text style={styles.meta}>
        {preview.rows.length} valid row(s) {preview.errors.length > 0 ? `• ${preview.errors.length} error(s)` : ""}
      </Text>

      {errors.length > 0 && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Validation errors</Text>
          {errors.map((e) => (
            <Text key={e} style={styles.errorText}>
              {e}
            </Text>
          ))}
        </View>
      )}

      {isImporting ? (
        <View style={styles.importing}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.meta}>Importing plan...</Text>
        </View>
      ) : (
        <PrimaryButton label="Import and preview" onPress={handleImport} />
      )}
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
    card: {
      borderRadius: tokens.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: tokens.spacing.md,
      gap: tokens.spacing.sm,
      ...tokens.shadow.card
    },
    cardTitle: {
      fontSize: tokens.type.h2,
      fontWeight: "700",
      color: colors.text
    },
    cardBody: {
      fontSize: tokens.type.caption,
      color: colors.text,
      fontFamily: tokens.font.body
    },
    label: {
      fontSize: tokens.type.caption,
      color: colors.textMuted,
      fontFamily: tokens.font.body
    },
    input: {
      minHeight: 180,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: tokens.spacing.md,
      textAlignVertical: "top",
      color: colors.text,
      fontFamily: tokens.font.body
    },
    meta: {
      fontSize: tokens.type.caption,
      color: colors.textMuted,
      fontFamily: tokens.font.body
    },
    errorCard: {
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: "#FECACA",
      backgroundColor: "#FEF2F2",
      padding: tokens.spacing.md,
      gap: tokens.spacing.xs
    },
    errorTitle: {
      color: colors.danger,
      fontWeight: "700",
      fontSize: tokens.type.caption
    },
    errorText: {
      color: colors.danger,
      fontSize: tokens.type.caption,
      fontFamily: tokens.font.body
    },
    importing: {
      height: 52,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: tokens.spacing.sm
    }
  });

