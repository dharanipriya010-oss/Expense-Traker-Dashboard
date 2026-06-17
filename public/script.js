if (savedTheme === 'dark') {
    document.body.style.backgroundColor = '#1f2937';
    document.body.style.color = '#ffffff';
}
let transactions = [];
let currentFilter = 'all';
let expenseChart;

const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initial load: Fetch asynchronous engine data directly from API routing layers
async function fetchTransactions() {
    try {
        const response = await fetch('/api/transactions');
        const resData = await response.json();
        transactions = resData.data || [];
        updateDashboardVisuals();
    } catch (err) {
        console.error('Failure reading dynamic structural runtime API entries:', err);
    }
}

function updateDashboardVisuals() {
    updateValues();
    renderList();
    initChart();
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balanceEl.innerText = `$${total}`;
    incomeEl.innerText = `$${income}`;
    expenseEl.innerText = `$${expense}`;
}

function renderList() {
    listEl.innerHTML = '';
    const filtered = transactions.filter(t => {
        if (currentFilter === 'income') return t.amount > 0;
        if (currentFilter === 'expense') return t.amount < 0;
        return true;
    });

    if (filtered.length === 0) {
        listEl.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #707eae;">No entries match this filter scope.</td></tr>`;
        return;
    }

    filtered.forEach(t => {
        const sign = t.amount < 0 ? '-' : '+';
        const cssClass = t.amount < 0 ? 'amt-expense' : 'amt-income';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${t.text}</strong></td>
            <td><span>${t.category}</span></td>
            <td class="${cssClass}">${sign}$${Math.abs(t.amount).toFixed(2)}</td>
            <td><button class="btn-delete" onclick="deleteTransaction(${t.id})"><i class="fa-solid fa-trash-can"></i></button></td>
        `;
        listEl.appendChild(row);
    });
}

function initChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const categories = ['Food', 'Rent', 'Entertainment', 'Utilities', 'Other'];
    const dataValues = categories.map(cat => {
        return transactions
            .filter(t => t.category === cat && t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    });

    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: dataValues,
                backgroundColor: ['#ee5d50', '#4318ff', '#05cd99', '#ffb547', '#a3aed0'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { family: 'Plus Jakarta Sans' } } } }
        }
    });
}

// Post Submission Network Strategy integration
formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        category: categoryInput.value
    };

    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            textInput.value = ''; amountInput.value = ''; categoryInput.value = '';
            await fetchTransactions();
        }
    } catch (err) {
        console.error('Post registration error pipeline connection drop:', err);
    }
});

// Delete operational async dispatch handling logic
window.deleteTransaction = async function(id) {
    try {
        const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        if (response.ok) await fetchTransactions();
    } catch (err) {
        console.error('Delete target operation failed network connection terminal update failure:', err);
    }
}

// Bind navigation actions directly onto layout buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderList();
    });
});

// Launch on execution setup
fetchTransactions();
