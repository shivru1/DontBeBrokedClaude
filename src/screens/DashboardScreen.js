import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { useBudget } from '../context/BudgetContext';
import BarChart from '../components/BarChart';

export default function DashboardScreen({ onLogExpense }) {
  const { remainingBalance, fairDailyBudget, daysRemaining, dailyLogs } = useBudget();

  const weekData = useMemo(() => {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const logsForDay = dailyLogs.filter((l) => new Date(l.date).toDateString() === d.toDateString());
      const total = logsForDay.reduce((s, l) => s + l.amount, 0);
      const weekdayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
      arr.push({ label: dayLabels[weekdayIndex], value: total, highlight: total > fairDailyBudget });
    }
    return arr;
  }, [dailyLogs, fairDailyBudget]);

  const yesterday = weekData[weekData.length - 2];
  const yesterdayDiff = fairDailyBudget - (yesterday?.value || 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DontBeBroke</Text>
          <Text style={styles.subtitle}>Smarter spending. Brighter days.</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.iconCircle}>
            <Ionicons name="wallet-outline" size={18} color={colors.accent} />
          </View>
          <Text style={styles.heroTopLabel}>Today's budget</Text>
        </View>
        <Text style={styles.heroValue}>₹{Math.round(fairDailyBudget).toLocaleString('en-IN')}</Text>
        <Text style={styles.heroCaption}>your fair budget for today</Text>
      </View>

      <View style={styles.rowCards}>
        <View style={styles.smallCard}>
          <View style={styles.iconCircleSm}>
            <Ionicons name="wallet-outline" size={16} color={colors.textPrimary} />
          </View>
          <Text style={styles.smallValue}>₹{Math.round(remainingBalance).toLocaleString('en-IN')} left</Text>
          <Text style={styles.smallLabel}>Remaining balance</Text>
        </View>
        <View style={styles.smallCard}>
          <View style={styles.iconCircleSm}>
            <Ionicons name="calendar-outline" size={16} color={colors.textPrimary} />
          </View>
          <Text style={styles.smallValue}>{daysRemaining} days to salary</Text>
          <Text style={styles.smallLabel}>Keep going</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Your spending this week</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            <Text style={styles.legendText}>Fair budget</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Actual spend</Text>
          </View>
        </View>
        <BarChart
          data={weekData}
          maxValue={Math.max(fairDailyBudget * 1.6, ...weekData.map((d) => d.value))}
        />
      </View>

      {yesterday && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryIcon}>
            <Ionicons name="stats-chart-outline" size={18} color={colors.accent} />
          </View>
          <Text style={styles.summaryText}>
            Yesterday: spent ₹{yesterday.value},{' '}
            <Text style={{ color: yesterdayDiff >= 0 ? colors.accent : colors.danger, fontWeight: '700' }}>
              ₹{Math.abs(Math.round(yesterdayDiff))} {yesterdayDiff >= 0 ? 'under budget — nice' : 'over budget'}
            </Text>
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      )}

      <TouchableOpacity style={styles.logBtn} onPress={onLogExpense}>
        <Ionicons name="add" size={20} color="#04150C" />
        <Text style={styles.logBtnText}>Log today's expense</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  heroCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.lg, marginBottom: spacing.md },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  iconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  heroTopLabel: { color: colors.textSecondary, fontSize: 13 },
  heroValue: { color: colors.accent, fontSize: 42, fontWeight: '800' },
  heroCaption: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  rowCards: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  smallCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md },
  iconCircleSm: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  smallValue: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  smallLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
  chartCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.md },
  chartTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  legendRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textSecondary, fontSize: 11 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm },
  summaryIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  summaryText: { color: colors.textPrimary, fontSize: 13, flex: 1 },
  logBtn: { flexDirection: 'row', backgroundColor: colors.accent, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', gap: 8 },
  logBtnText: { color: '#04150C', fontWeight: '700', fontSize: 16 },
});
