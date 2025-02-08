document.addEventListener('DOMContentLoaded', () => {
  const expenses = { lastMonth: 0, thisMonth: 0 };
  const income = { lastMonth: 0, thisMonth: 0 };

  updateDashboard();

  const expenseForm = document.getElementById('expenseForm');
  const incomeForm = document.getElementById('incomeForm');

  // Handle Expense Form Submission
  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(expenseForm.amount.value);
    const date = new Date(expenseForm.date.value);
    const category = expenseForm.category.value;
    const remarks = expenseForm.remarks.value;

    if (amount && date) {
      saveTransactionToLocalStorage('expenses', date, amount, category, remarks);
      updateDashboard();

      // Notify other pages of updates
      window.dispatchEvent(new Event('storage'));

      expenseForm.reset();
    } else {
      alert('Please fill out all required fields for expenses.');
    }
  });

  // Handle Income Form Submission
  incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(incomeForm.amount.value);
    const date = new Date(incomeForm.date.value);
    const category = incomeForm.category.value;
    const remarks = incomeForm.remarks.value;

    if (amount && date) {
      saveTransactionToLocalStorage('income', date, amount, category, remarks);
      updateDashboard();

      // Notify other pages of updates
      window.dispatchEvent(new Event('storage'));

      incomeForm.reset();
    } else {
      alert('Please fill out all required fields for income.');
    }
  });

  // Update Dashboard Values
  function updateDashboard() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const expenseData = JSON.parse(localStorage.getItem('expenses')) || [];
    const incomeData = JSON.parse(localStorage.getItem('income')) || [];

    // Reset totals
    expenses.lastMonth = 0;
    expenses.thisMonth = 0;
    income.lastMonth = 0;
    income.thisMonth = 0;

    // Calculate Totals
    calculateMonthlyTotals(expenseData, currentMonth, currentYear, expenses);
    calculateMonthlyTotals(incomeData, currentMonth, currentYear, income);

    // Update Dashboard UI
    document.getElementById('expLastMonth').innerText = `₹${expenses.lastMonth.toFixed(2)}`;
    document.getElementById('expThisMonth').innerText = `₹${expenses.thisMonth.toFixed(2)}`;
    document.getElementById('incLastMonth').innerText = `₹${income.lastMonth.toFixed(2)}`;
    document.getElementById('incThisMonth').innerText = `₹${income.thisMonth.toFixed(2)}`;
  }

  // Save Data to LocalStorage
  function saveTransactionToLocalStorage(type, date, amount, category, remarks) {
    const data = JSON.parse(localStorage.getItem(type)) || [];
    data.push({ date: date.toISOString(), amount, category, remarks });
    localStorage.setItem(type, JSON.stringify(data));

    // Notify other pages of updates
    window.dispatchEvent(new Event('storage'));
  }

  // Calculate Totals for Current and Last Month
  function calculateMonthlyTotals(data, currentMonth, currentYear, totals) {
    data.forEach((entry) => {
      const date = new Date(entry.date);
      const entryMonth = date.getMonth();
      const entryYear = date.getFullYear();

      if (entryYear === currentYear) {
        if (entryMonth === currentMonth) {
          totals.thisMonth += entry.amount;
        } else if (entryMonth === currentMonth - 1 || (currentMonth === 0 && entryMonth === 11)) {
          totals.lastMonth += entry.amount;
        }
      } else if (currentMonth === 0 && entryMonth === 11 && entryYear === currentYear - 1) {
        totals.lastMonth += entry.amount;
      }
    });
  }
});
