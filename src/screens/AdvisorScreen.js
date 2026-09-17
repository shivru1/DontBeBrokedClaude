import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { useBudget } from '../context/BudgetContext';

export default function AdvisorScreen() {
  const { logExpense } = useBudget();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const handleSend = async () => {
    const amount = parseFloat(input.replace(/[^0-9.]/g, ''));
    if (!amount || amount <= 0) return;

    const userMsg = { id: Date.now().toString() + 'u', from: 'user', text: input, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const { message } = await logExpense(amount, input);
    const botMsg = { id: Date.now().toString() + 'b', from: 'bot', text: message, time: new Date() };
    setMessages((prev) => [...prev, botMsg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.bubbleRow, item.from === 'user' && styles.bubbleRowUser]}>
      {item.from === 'bot' && (
        <View style={styles.botAvatar}>
          <Ionicons name="hardware-chip-outline" size={16} color={colors.accent} />
        </View>
      )}
      <View style={[styles.bubble, item.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={styles.bubbleText}>{item.text}</Text>
        <Text style={styles.time}>{item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.title}>DontBeBroke</Text>
        <Text style={styles.subtitle}>Smarter spending. Brighter days.</Text>
      </View>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tell me what you spent today, like "Spent ₹450 today on groceries".</Text>
        }
      />
      <View style={styles.inputRow}>
        <Ionicons name="cash-outline" size={16} color={colors.textSecondary} style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Spent ₹450 today on groceries"
          placeholderTextColor={colors.textMuted}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={14} color="#04150C" />
          <Text style={styles.sendBtnText}>Log spend</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.md, paddingBottom: 0 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2, marginBottom: 8 },
  emptyText: { color: colors.textMuted, textAlign: 'center', marginTop: 40, paddingHorizontal: 30 },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.md, alignItems: 'flex-end', gap: 8 },
  bubbleRowUser: { justifyContent: 'flex-end' },
  botAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '78%', borderRadius: radius.md, padding: spacing.md },
  bubbleBot: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  bubbleUser: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  bubbleText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20 },
  time: { color: colors.textMuted, fontSize: 10, marginTop: 6, textAlign: 'right' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  input: { flex: 1, color: colors.textPrimary, paddingHorizontal: 8, paddingVertical: 12 },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 4,
  },
  sendBtnText: { color: '#04150C', fontWeight: '700', fontSize: 12 },
});
