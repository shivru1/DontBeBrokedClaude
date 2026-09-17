import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function BarChart({ data, maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  return (
    <View style={styles.row}>
      {data.map((d, i) => (
        <View key={i} style={styles.col}>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.bar,
                {
                  height: `${Math.min((d.value / max) * 100, 100)}%`,
                  backgroundColor: d.highlight ? colors.danger : colors.accent,
                },
              ]}
            />
          </View>
          <Text style={styles.dayLabel}>{d.label}</Text>
          <Text style={styles.valueLabel}>₹{d.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', height: 170, alignItems: 'flex-end' },
  col: { alignItems: 'center', flex: 1 },
  barTrack: { height: 110, width: 18, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6, minHeight: 3 },
  dayLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 6 },
  valueLabel: { color: colors.textMuted, fontSize: 10 },
});
