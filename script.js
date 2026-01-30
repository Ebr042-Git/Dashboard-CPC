let dashboardData = [];
let chartInstance;

// Fetch data from API
async function fetchData() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyRvvLmZg1zzfGsgFb8XVUApclToxCH1ZyqVG0jlWntK94V_TZWcXq_j-uL-WGLtpK6Gw/exec');
        const data = await response.json();
        dashboardData = data; // save globally
        populateFilters(data);
        renderTable(data);
        renderChart(data);
        updateSummary(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Render table
function renderTable(data) {
    const tbody = document.querySelector('#dashboard-table tbody');
    tbody.innerHTML = '';

    const statusColor = {
        Active: '#FFD700',   // yellow
        Completed: '#90EE90', // green
        Delayed: '#FF6347'   // red
    };

    data.forEach(item => {
        const row = document.createElement('tr');
        row.style.backgroundColor = statusColor[item.status] || 'white';
        row.innerHTML = `
            <td>${item.team}</td>
            <td>${item.status}</td>
            <td>${item.tasks}</td>
            <td>${item.progress}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate team filter dynamically
function populateFilters(data) {
    const teamFilter = document.getElementById('team-filter');
    const teams = [...new Set(data.map(d => d.team))];
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.innerText = team;
        teamFilter.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    const teamValue = document.getElementById('team-filter').value;
    const statusValue = document.getElementById('status-filter').value;

    let filtered = dashboardData;
    if (teamValue) filtered = filtered.filter(d => d.team === teamValue);
    if (statusValue) filtered = filtered.filter(d => d.status === statusValue);

    renderTable(filtered);
    renderChart(filtered);
    updateSummary(filtered);
}

// Update summary cards
function updateSummary(data) {
    document.getElementById('totalTeams').innerText = [...new Set(data.map(d => d.team))].length;
    document.getElementById('activeTasks').innerText = data.filter(d => d.status === 'Active').length;
}

// Render chart
function renderChart(data) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const labels = data.map(d => d.team);
    const progressData = data.map(d => d.progress);

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Progress %',
                data: progressData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });
}

// Event listeners for filters
document.getElementById('team-filter').addEventListener('change', applyFilters);
document.getElementById('status-filter').addEventListener('change', applyFilters);

// Load data on page load
window.onload = fetchData;
