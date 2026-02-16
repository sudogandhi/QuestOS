# QuestOS Mobile App (React Native)

This scaffold translates the provided docs into a production-focused React Native architecture.

## Included

- Offline-first onboarding flow: Welcome, setup choice, onboarding wizard, prompt + CSV import, plan preview
- Main navigation shell: Today, Goals, Stats, Review, Settings
- Design system tokens in `src/theme/tokens.ts`
- Premium brand theming with light/dark/system modes in `src/theme/ThemeProvider.tsx`
- Custom font loading via `@expo-google-fonts/plus-jakarta-sans` and `@expo-google-fonts/sora`
- SQLite persistence with schema + event log in `src/storage`
- CSV parser and validator in `src/import/csvPlan.ts`
- Reusable components: `QuestCard`, `LevelBar`, `Pill`, `PrimaryButton`, `Screen`
- Main loop UX on Today screen:
  - Core quests, optional boosters, recovery quests
  - Wrong deed bottom-sheet style modal
  - Level/streak/debt header
  - Animated quest completion transitions
  - Layout animations for quest status updates
- Animated tab icon micro-interactions with brand icon system in `src/components/BrandIcon.tsx`

## Requirement Mapping

- Application flow: onboarding stack + persistent 5-tab shell
- Wrong deed flow: modal with habit/intensity/trigger/impact preview tone
- Design system: color, spacing, radius, typography tokenized and used across screens
- Offline-first language: no account/sync language in flows, local-first framing
- Event log source-of-truth foundation: `event_log` + `debt_ledger` writes on key actions
- Import pipeline: parse CSV, validate line-by-line, persist goals/actions/schedule/import record
- Premium visual layer: custom typography, animated tab transitions, and theme switching

## Run

```bash
cd QuestOS
npm install
npm run start
```

## Next Build Steps

1. Add proper transactional imports (rollback on partial failures)
2. Add scheduler engine for multi-day generation and recovery insertion rules
3. Replace placeholder wrong-deed inputs with real form controls and dynamic debt preview
4. Add aggregation queries for stats, streaks, and debt payoff projections
5. Add charts and review auto-adjustment rules
