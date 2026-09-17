# DontBeBroke

A native budgeting app with an AI-style advisor: log your salary and fixed
monthly expenses, then log daily spending — the advisor tells you whether
you're on track based on how many days are left before your next salary.

## What's inside
- `App.js` — root app, tab switching between Dashboard / Advisor / History
- `src/screens/` — the 4 screens (Setup, Dashboard, Advisor chat, History)
- `src/components/` — TabBar, BarChart, LineChart (no external chart library needed)
- `src/context/BudgetContext.js` — all app state (salary, expenses, logs)
- `src/utils/budgetLogic.js` — the core math (days remaining, fair daily budget, advisor message)
- `src/utils/storage.js` — saves everything on-device with AsyncStorage (no backend needed)

## Run it to preview (no install needed on your end)
1. Push this whole folder to a GitHub repo (via github.com or the GitHub app — no local git needed).
2. Go to **https://snack.expo.dev**, choose "Import from GitHub", paste your repo URL.
3. Snack runs it instantly in your browser, and shows a QR code — scan it with the
   **Expo Go** app (from Play Store) on your phone to see the real native app running live.

## Build a real installable APK (free, cloud-based)
1. Create a free account at **expo.dev**.
2. In your GitHub repo (or on Replit, which has a built-in terminal), run:
   ```
   npm install -g eas-cli
   eas login
   eas build:configure
   eas build -p android --profile preview
   ```
3. This compiles on Expo's cloud servers (EAS Build's free tier covers this) — no Android
   Studio or SDK needed locally. You'll get a download link for the finished `.apk` when it's done.

## Customizing the advisor logic
All the "should you have spent that" math lives in one file:
`src/utils/budgetLogic.js` → `generateAdvisorMessage()`. Edit the message wording there
without touching any screen code.
