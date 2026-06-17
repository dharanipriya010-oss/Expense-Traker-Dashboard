async function loadAnalytics() {

    const response = await fetch('/api/transactions');
    const result = await response.json();

    const transactions = result.data;

    let income = 0;
    let expense = 0;

    const categories = {};

    transactions.forEach(tx => {

        const amount = Number(tx.amount);

        if (amount > 0) {
            income += amount;
        } else {
            expense += Math.abs(amount);

            categories[tx.category] =
                (categories[tx.category] || 0) + Math.abs(amount);
        }
    });

    document.getElementById('income').textContent =
        '$' + income.toFixed(2);

    document.getElementById('expense').textContent =
        '$' + expense.toFixed(2);

    document.getElementById('balance').textContent =
        '$' + (income - expense).toFixed(2);

    const ctx =
        document.getElementById('analyticsChart').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffce56',
                    '#4bc0c0',
                    '#9966ff',
                    '#ff9f40'
                ]
            }]
        }
    });
}

loadAnalytics();