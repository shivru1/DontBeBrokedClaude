import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { colors } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LineChart({ actual, fair, labels, height = 140 }) {
  const width = SCREEN_WIDTH - 64;
  const max = Math.max(...actual, ...fair, 1);
  const stepX = width / (actual.length - 1 || 1);
  const toY = (v) => height - (v / max) * height;

  const actualPoints = actual.map((v, i) => `${i * stepX},${toY(v)}`).join(' ');
  const fairPoints = fair.map((v, i) => `${i * stepX},${toY(v)}`).join(' ');

  return (
    <View>
      <Svg width={width} height={height}>
        <Polyline points={fairPoints} fill="none" stroke={colors.accent} strokeWidth="2" strokeDasharray="6,5" />
        <Polyline points={actualPoints} fill="none" stroke={colors.danger} strokeWidth="2.5" />
        {actual.map((v, i) => (
          <Circle key={i} cx={i * stepX} cy={toY(v)} r="4" fill={colors.danger} />
        ))}
      </Svg>
      <View style={styles.labelRow}>
        {labels.map((l, i) => (
          <Text key={i} style={styles.label}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  label: { color: colors.textSecondary, fontSize: 9 },
});
