document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const yearSelector = document.getElementById('yearSelector');
    const monthlyReviewMessage = document.getElementById('reviewMessage'); // Monthly Review Box
    const yearlyReviewMessage = document.getElementById('yearlyReviewMessage'); // Yearly Review Box

    let currentDate = new Date();
    let isDayView = false;

    function populateYearSelector() {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 10; year <= currentYear + 10; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === currentDate.getFullYear()) {
                option.selected = true;
            }
            yearSelector.appendChild(option);
        }
    }

    function renderCalendar() {
        calendar.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        currentMonthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        if (isDayView) {
            renderDayView();
            return;
        }

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calendar.innerHTML += `<div class="day empty"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.innerHTML = `<span>${day}</span>`;

            const date = new Date(year, month, day).toISOString().split('T')[0];
            const expenses = getTransactions('expenses', date);
            const income = getTransactions('income', date);

            if (expenses.length) {
                const expenseAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
                dayElement.innerHTML += `<div class="expense">- ₹${expenseAmount}</div>`;
            }

            if (income.length) {
                const incomeAmount = income.reduce((sum, item) => sum + item.amount, 0);
                dayElement.innerHTML += `<div class="income">+ ₹${incomeAmount}</div>`;
            }

            calendar.appendChild(dayElement);
        }

        // Update the monthly and yearly review boxes
        showMonthlyReview();
        showYearlyReview();
    }

    function renderDayView() {
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();

        calendar.innerHTML = `<h3>Transactions for ${day} ${month} ${year}</h3>`;

        const date = new Date(year, currentDate.getMonth(), day).toISOString().split('T')[0];
        const expenses = getTransactions('expenses', date);
        const income = getTransactions('income', date);

        if (expenses.length) {
            expenses.forEach(exp => {
                calendar.innerHTML += `<div class="expense">Expense: ₹${exp.amount}</div>`;
            });
        }

        if (income.length) {
            income.forEach(inc => {
                calendar.innerHTML += `<div class="income">Income: ₹${inc.amount}</div>`;
            });
        }
    }

    function getTransactions(type, date) {
        const data = JSON.parse(localStorage.getItem(type)) || [];
        return data.filter(item => item.date.startsWith(date));
    }

    function showMonthlyReview() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const expenseData = JSON.parse(localStorage.getItem('expenses')) || [];
        const incomeData = JSON.parse(localStorage.getItem('income')) || [];

        const monthlyExpenses = expenseData.filter(
            item => new Date(item.date).getMonth() === month && new Date(item.date).getFullYear() === year
        ).reduce((sum, item) => sum + item.amount, 0);

        const monthlyIncome = incomeData.filter(
            item => new Date(item.date).getMonth() === month && new Date(item.date).getFullYear() === year
        ).reduce((sum, item) => sum + item.amount, 0);

        if (monthlyIncome > monthlyExpenses) {
            monthlyReviewMessage.textContent = `Great job! You saved ₹${(monthlyIncome - monthlyExpenses).toFixed(2)} this month.`;
            monthlyReviewMessage.className = 'review-box success';
        } else {
            monthlyReviewMessage.textContent = `Be careful! You are in debt of ₹${(monthlyExpenses - monthlyIncome).toFixed(2)} this month.`;
            monthlyReviewMessage.className = 'review-box warning';
        }        
    }

    function showYearlyReview() {
        const year = currentDate.getFullYear();
        const expenseData = JSON.parse(localStorage.getItem('expenses')) || [];
        const incomeData = JSON.parse(localStorage.getItem('income')) || [];

        const yearlyExpenses = expenseData.filter(
            item => new Date(item.date).getFullYear() === year
        ).reduce((sum, item) => sum + item.amount, 0);

        const yearlyIncome = incomeData.filter(
            item => new Date(item.date).getFullYear() === year
        ).reduce((sum, item) => sum + item.amount, 0);

        if (yearlyIncome > yearlyExpenses) {
            yearlyReviewMessage.textContent = `Fantastic! You saved ₹${(yearlyIncome - yearlyExpenses).toFixed(2)} this year.`;
            yearlyReviewMessage.className = 'review-box success';
        } else {
            yearlyReviewMessage.textContent = `Heads up! You are in debt of ₹${(yearlyExpenses - yearlyIncome).toFixed(2)} this year.`;
            yearlyReviewMessage.className = 'review-box warning';
        }
    }

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    yearSelector.addEventListener('change', (e) => {
        currentDate.setFullYear(Number(e.target.value));
        renderCalendar();
    });

    populateYearSelector();
    renderCalendar();
});

// Add this listener at the end of the calendar script
window.addEventListener('storage', (event) => {
    renderCalendar(); // Re-render the calendar on any data change
});
