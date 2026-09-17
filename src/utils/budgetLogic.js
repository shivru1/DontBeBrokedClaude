// Core math for the app. Kept framework-agnostic so it's easy to unit test.

export function daysUntilNextSalary(salaryDate) {
  const today = new Date();
  const currentDay = today.getDate();

  let nextSalary;
  if (currentDay < salaryDate) {
    nextSalary = new Date(today.getFullYear(), today.getMonth(), salaryDate);
  } else {
    nextSalary = new Date(today.getFullYear(), today.getMonth() + 1, salaryDate);
  }

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = nextSalary.getTime() - startOfToday.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 1);
}

export function calcFixedTotal(fixedExpenses) {
  return fixedExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
}

export function calcRemainingBalance(salary, fixedExpenses, dailyLogs) {
  const fixedTotal = calcFixedTotal(fixedExpenses);
  const spentTotal = dailyLogs.reduce((sum, log) => sum + Number(log.amount || 0), 0);
  return salary - fixedTotal - spentTotal;
}

export function calcFairDailyBudget(remainingBalance, daysRemaining) {
  if (daysRemaining <= 0) return remainingBalance;
  return remainingBalance / daysRemaining;
}

/**
 * Generates the advisor's response after a new expense is logged.
 * All values passed in are the state BEFORE this expense is deducted.
 */
export function generateAdvisorMessage({
  amountSpent,
  remainingBalanceBeforeSpend,
  daysRemaining,
  fairDailyBudgetBeforeSpend,
}) {
  const remainingAfter = remainingBalanceBeforeSpend - amountSpent;
  const daysLeftAfterToday = Math.max(daysRemaining - 1, 0);
  const newDailyBudget = daysLeftAfterToday > 0 ? remainingAfter / daysLeftAfterToday : remainingAfter;
  const diff = fairDailyBudgetBeforeSpend - amountSpent;

  const lines = [];
  lines.push(
    `₹${Math.round(remainingBalanceBeforeSpend)} left, ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} to go — that's ₹${Math.round(fairDailyBudgetBeforeSpend)}/day.`
  );

  if (diff >= 0) {
    lines.push(`You spent ₹${amountSpent}, so you're ₹${Math.round(diff)} under budget — nice.`);
  } else {
    lines.push(`You spent ₹${amountSpent}, so you're ₹${Math.round(Math.abs(diff))} over today's fair share.`);
  }

  if (daysLeftAfterToday > 0) {
    lines.push(
      `With ₹${Math.round(remainingAfter)} left over ${daysLeftAfterToday} day${daysLeftAfterToday === 1 ? '' : 's'}, keep it around ₹${Math.round(newDailyBudget)}/day from here.`
    );
  } else {
    lines.push(`That's your last day of the cycle — ₹${Math.round(remainingAfter)} left.`);
  }

  if (remainingAfter < 0) {
    lines.push(`Heads up — you're already into next month's money.`);
  }

  return lines.join('\n\n');
}
