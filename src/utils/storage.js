import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SALARY: 'dbb_salary',
  SALARY_DATE: 'dbb_salary_date',
  FIXED_EXPENSES: 'dbb_fixed_expenses',
  DAILY_LOGS: 'dbb_daily_logs',
  SETUP_DONE: 'dbb_setup_done',
};

export async function saveSetup({ salary, salaryDate, fixedExpenses }) {
  await AsyncStorage.multiSet([
    [KEYS.SALARY, String(salary)],
    [KEYS.SALARY_DATE, String(salaryDate)],
    [KEYS.FIXED_EXPENSES, JSON.stringify(fixedExpenses)],
    [KEYS.SETUP_DONE, 'true'],
  ]);
}

export async function loadSetup() {
  const values = await AsyncStorage.multiGet([
    KEYS.SALARY,
    KEYS.SALARY_DATE,
    KEYS.FIXED_EXPENSES,
    KEYS.SETUP_DONE,
  ]);
  const map = Object.fromEntries(values);
  return {
    salary: map[KEYS.SALARY] ? Number(map[KEYS.SALARY]) : 0,
    salaryDate: map[KEYS.SALARY_DATE] ? Number(map[KEYS.SALARY_DATE]) : 1,
    fixedExpenses: map[KEYS.FIXED_EXPENSES] ? JSON.parse(map[KEYS.FIXED_EXPENSES]) : [],
    setupDone: map[KEYS.SETUP_DONE] === 'true',
  };
}

export async function loadDailyLogs() {
  const raw = await AsyncStorage.getItem(KEYS.DAILY_LOGS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveDailyLogs(logs) {
  await AsyncStorage.setItem(KEYS.DAILY_LOGS, JSON.stringify(logs));
}

export async function resetAll() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
