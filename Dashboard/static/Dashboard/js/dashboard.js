const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#0dcaf0', '#6f42c1', '#fd7e14'];

// 1. Contracts by Type (pie)
new Chart(document.getElementById('typeChart'), {
    type: 'pie',
    data: {
        labels: TYPE_LABELS,
        datasets: [{
            data: TYPE_COUNTS,
            backgroundColor: COLORS,
        }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// 2. Price by Type (bar)
new Chart(document.getElementById('priceChart'), {
    type: 'bar',
    data: {
        labels: PRICE_LABELS,
        datasets: [{
            label: 'Total Price (€)',
            data: PRICE_DATA,
            backgroundColor: COLORS,
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});

// 3. Vehicles by Model (doughnut)
new Chart(document.getElementById('vehicleChart'), {
    type: 'doughnut',
    data: {
        labels: VEHICLE_LABELS,
        datasets: [{
            data: VEHICLE_DATA,
            backgroundColor: COLORS,
        }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// 4. Top Customers (horizontal bar)
new Chart(document.getElementById('customerChart'), {
    type: 'bar',
    data: {
        labels: CUSTOMER_LABELS,
        datasets: [{
            label: 'Total Value (€)',
            data: CUSTOMER_DATA,
            backgroundColor: COLORS,
        }]
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } }
    }
});