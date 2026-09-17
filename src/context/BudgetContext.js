import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as storage from '../utils/storage';
import {
  daysUntilNextSalary,
  calcRemainingBalance,
  calcFairDailyBudget,
  generateAdvisorMessage,
} from '../utils/budgetLogic';

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [setupDone, setSetupDone] = useState(false);
  const [salary, setSalary] = useState(0);
  const [salaryDate, setSalaryDate] = useState(1);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);

  useEffect(() => {
    (async () => {
      const setup = await storage.loadSetup();
      const logs = await storage.loadDailyLogs();
      setSalary(setup.salary);
      setSalaryDate(setup.salaryDate);
      setFixedExpenses(setup.fixedExpenses);
      setSetupDone(setup.setupDone);
      setDailyLogs(logs);
      setLoading(false);
    })();
  }, []);

  const completeSetup = useCallback(async ({ salary, salaryDate, fixedExpenses }) => {
    await storage.saveSetup({ salary, salaryDate, fixedExpenses });
    setSalary(salary);
    setSalaryDate(salaryDate);
    setFixedExpenses(fixedExpenses);
    setSetupDone(true);
  }, []);

  const daysRemaining = daysUntilNextSalary(salaryDate);
  const remainingBalance = calcRemainingBalance(salary, fixedExpenses, dailyLogs);
  const fairDailyBudget = calcFairDailyBudget(remainingBalance, daysRemaining);

  const logExpense = useCallback(
    async (amount, note) => {
      const beforeBalance = remainingBalance;
      const beforeFair = fairDailyBudget;
      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: Number(amount),
        note: note || '',
      };
      const message = generateAdvisorMessage({
        amountSpent: entry.amount,
        remainingBalanceBeforeSpend: beforeBalance,
        daysRemaining,
        fairDailyBudgetBeforeSpend: beforeFair,
      });
      const newLogs = [...dailyLogs, entry];
      setDailyLogs(newLogs);
      await storage.saveDailyLogs(newLogs);
      return { entry, message };
    },
    [dailyLogs, remainingBalance, fairDailyBudget, daysRemaining]
  );

  const resetApp = useCallback(async () => {
    await storage.resetAll();
    setSalary(0);
    setSalaryDate(1);
    setFixedExpenses([]);
    setDailyLogs([]);
    setSetupDone(false);
  }, []);

  const value = {
    loading,
    setupDone,
    salary,
    salaryDate,
    fixedExpenses,
    dailyLogs,
    daysRemaining,
    remainingBalance,
    fairDailyBudget,
    completeSetup,
    logExpense,
    resetApp,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within a BudgetProvider');
  return ctx;
}
