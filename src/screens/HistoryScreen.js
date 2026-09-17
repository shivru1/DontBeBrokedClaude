import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { useBudget } from '../context/BudgetContext';
import LineChart from '../components/LineChart';

export default function HistoryScreen() {
  const { dailyLogs, fairDailyBudget } = useBudget();
  const [range, setRange] = useState('week');

  const days = useMemo(() => {
    const today = new Date();
    const count = range === 'week' ? 7 : 14;
    const arr = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const logsForDay = dailyLogs.filter((l) => new Date(l.date).toDateString() === d.toDateString());
      const total = logsForDay.reduce((s, l) => s + l.amount, 0);
      arr.push({ date: d, spent: total, budget: Math.round(fairDailyBudget) });
    }
    return arr;
  }, [dailyLogs, fairDailyBudget, range]);

  const chartDays = days.slice(-7);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
      <Text style={styles.title}>DontBeBroke</Text>
      <Text style={styles.subtitle}>Your spending history</Text>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Daily spending this cycle</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Actual spend</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            <Text style={styles.legendText}>Fair budget</Text>
          </View>
        </View>
        <LineChart
          actual={chartDays.map((d) => d.spent)}
          fair={chartDays.map((d) => d.budget)}
          labels={chartDays.map((d) => d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}
        />
      </View>

      <View style={styles.rangeRow}>
        {['week', 'cycle'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
            onPress={() => setRange(r)}
          >
            <Text style={[styles.rangeText, range === r && styles.rangeTextActive]}>
              {r === 'week' ? 'This week' : 'This cycle'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.breakdownHeader}>
        <Text style={styles.breakdownTitle}>Daily breakdown</Text>
        <Text style={styles.breakdownCount}>{days.length} days</Text>
      </View>

      {[...days].reverse().map((d, i) => {
        const over = d.spent > d.budget;
        return (
          <View key={i} style={styles.dayRow}>
            <View>
              <Text style={styles.dayDate}>{d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
              <Text style={styles.dayWeekday}>{d.date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
            </View>
            <Text style={styles.daySpend}>
              ₹{d.spent} <Text style={styles.dayBudget}>/ ₹{d.budget} budget</Text>
            </Text>
            <View style={[styles.statusPill, over ? styles.statusOver : styles.statusUnder]}>
              <Text style={[styles.statusText, { color: over ? colors.danger : colors.accent }]}>
                {over ? 'Over' : 'Under'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.md },
  chartCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.md },
  chartTitle: { color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  legendRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textSecondary, fontSize: 11 },
  rangeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  rangeBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  rangeBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  rangeText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  rangeTextActive: { color: '#04150C' },
  breakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  breakdownTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  breakdownCount: { color: colors.textMuted, fontSize: 12 },
  dayRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  dayDate: { color: colors.textPrimary, fontWeight: '700', fontSize: 13 },
  dayWeekday: { color: colors.textMuted, fontSize: 11 },
  daySpend: { color: colors.textPrimary, fontWeight: '700', flex: 1, marginLeft: spacing.sm },
  dayBudget: { color: colors.textSecondary, fontWeight: '400', fontSize: 12 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  statusOver: { backgroundColor: colors.dangerSoft },
  statusUnder: { backgroundColor: colors.accentSoft },
  statusText: { fontSize: 11, fontWeight: '700' },
});
