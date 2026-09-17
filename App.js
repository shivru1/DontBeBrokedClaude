import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { BudgetProvider, useBudget } from './src/context/BudgetContext';
import { colors } from './src/theme';
import SetupScreen from './src/screens/SetupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AdvisorScreen from './src/screens/AdvisorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import TabBar from './src/components/TabBar';

function Main() {
  const { loading, setupDone } = useBudget();
  const [tab, setTab] = useState('Dashboard');

  if (loading) return null;
  if (!setupDone) return <SetupScreen />;

  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar style="light" />
      {tab === 'Dashboard' && <DashboardScreen onLogExpense={() => setTab('Advisor')} />}
      {tab === 'Advisor' && <AdvisorScreen />}
      {tab === 'History' && <HistoryScreen />}
      <TabBar active={tab} onChange={setTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
        <Main />
      </SafeAreaView>
    </BudgetProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
});
