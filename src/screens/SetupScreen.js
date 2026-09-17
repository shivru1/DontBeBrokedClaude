import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { useBudget } from '../context/BudgetContext';

export default function SetupScreen() {
  const { completeSetup } = useBudget();
  const [salary, setSalary] = useState('');
  const [salaryDate, setSalaryDate] = useState('1');
  const [expenses, setExpenses] = useState([
    { id: '1', label: 'Rent', amount: '' },
    { id: '2', label: 'Loan EMI', amount: '' },
  ]);

  const addExpenseRow = () => {
    setExpenses([...expenses, { id: Date.now().toString(), label: '', amount: '' }]);
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const fixedTotal = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const remaining = (Number(salary) || 0) - fixedTotal;

  const handleStart = () => {
    const cleanExpenses = expenses
      .filter((e) => e.label && e.amount)
      .map((e) => ({ label: e.label, amount: Number(e.amount) }));
    completeSetup({
      salary: Number(salary) || 0,
      salaryDate: Number(salaryDate) || 1,
      fixedExpenses: cleanExpenses,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }}>
      <Text style={styles.title}>Setup your budget</Text>
      <Text style={styles.subtitle}>
        Tell us about your income and fixed expenses so we can plan your money better.
      </Text>

      <Text style={styles.label}>Monthly salary</Text>
      <View style={styles.inputRow}>
        <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <Text style={styles.label}>Salary date (day of month)</Text>
      <View style={styles.inputRow}>
        <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          value={salaryDate}
          onChangeText={setSalaryDate}
          keyboardType="numeric"
          placeholder="1"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Fixed expenses</Text>
      <Text style={styles.hint}>These are confirmed expenses that repeat monthly.</Text>

      {expenses.map((e) => (
        <View key={e.id} style={styles.expenseRow}>
          <TextInput
            style={[styles.expenseInput, { flex: 1.4 }]}
            value={e.label}
            onChangeText={(v) => updateExpense(e.id, 'label', v)}
            placeholder="Label (e.g. Rent)"
            placeholderTextColor={colors.textMuted}
          />
          <TextInput
            style={[styles.expenseInput, { flex: 1 }]}
            value={e.amount}
            onChangeText={(v) => updateExpense(e.id, 'amount', v)}
            placeholder="Amount"
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity onPress={() => removeExpense(e.id)}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={addExpenseRow}>
        <Ionicons name="add" size={18} color={colors.accent} />
        <Text style={styles.addBtnText}>Add fixed expense</Text>
      </TouchableOpacity>

      <View style={styles.summaryCard}>
        <Ionicons name="calculator-outline" size={20} color={colors.accent} />
        <View style={{ marginLeft: spacing.sm }}>
          <Text style={styles.summaryLabel}>Remaining this cycle:</Text>
          <Text style={styles.summaryValue}>₹{remaining.toLocaleString('en-IN')}</Text>
          <Text style={styles.summaryHint}>Based on your salary and fixed expenses.</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={handleStart} disabled={!salary}>
        <Text style={styles.startBtnText}>Start tracking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: colors.textSecondary, fontSize: 13, marginBottom: spacing.lg, lineHeight: 18 },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  hint: { color: colors.textMuted, fontSize: 12, marginBottom: spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    gap: 8,
  },
  input: { flex: 1, color: colors.textPrimary, fontSize: 18, fontWeight: '600' },
  expenseRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm },
  expenseInput: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: colors.textPrimary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  addBtnText: { color: colors.accent, fontWeight: '600' },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryLabel: { color: colors.textSecondary, fontSize: 12 },
  summaryValue: { color: colors.accent, fontSize: 20, fontWeight: '700', marginVertical: 2 },
  summaryHint: { color: colors.textMuted, fontSize: 11 },
  startBtn: { backgroundColor: colors.accent, borderRadius: radius.pill, paddingVertical: 16, alignItems: 'center' },
  startBtnText: { color: '#04150C', fontWeight: '700', fontSize: 16 },
});
