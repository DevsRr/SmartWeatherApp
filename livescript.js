// Fake data for the progress bars
function updateProgressBar(element, value) {
    const circleForeground = element.querySelector('.circle-foreground');
    const circleText = element.querySelector('.circle-text');

    // Calculate the percentage and update the circle foreground
    const percentage = Math.min(100, Math.max(0, value));
    const clipPathValue = `circle(${percentage}% at 50% 50%)`;
    circleForeground.style.clipPath = clipPathValue;

    // Set the value inside the circle
    circleText.textContent = `${Math.round(percentage)}%`;
}

// Update progress bars with fake values
const floodProgressBar = document.querySelector('.circular-progress:nth-child(1)');
const airQualityProgressBar = document.querySelector('.circular-progress:nth-child(2)');
const temperatureProgressBar = document.querySelector('.circular-progress:nth-child(3)');
const humidityProgressBar = document.querySelector('.circular-progress:nth-child(4)');

updateProgressBar(floodProgressBar, 75);    // 75% flood detection
updateProgressBar(airQualityProgressBar, 58);   // AQI value
updateProgressBar(temperatureProgressBar, 28);  // Temperature in Celsius
updateProgressBar(humidityProgressBar, 68);    // Humidity percentage

// Select the canvas element for the seismic graph
const seismicCanvas = document.getElementById('seismicGraph');

// Define datasets separately for clarity
const seismicData = {
    labels: ['0h', '1h', '2h', '3h', '4h', '5h', '6h'],
    datasets: [
        {
            label: 'Seismic Activity (Magnitude)',
            data: [0.3, 1.0, 0.7, 1.5, 0.9, 1.3, 0.6],  // Fake data for the graph
            borderColor: '#ff5733',
            backgroundColor: 'rgba(255, 87, 51, 0.3)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }
    ]
};

// Define options for the chart
const seismicOptions = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            max: 2,  // Set max value to 2 for seismic magnitude
            ticks: {
                stepSize: 0.5
            }
        },
        x: {
            ticks: { color: '#fff' },
            grid: { color: '#444' }
        }
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: '#fff'
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false
        },
    }
};

// Create the chart using Chart.js
const seismicGraph = new Chart(seismicCanvas, {
    type: 'line',
    data: seismicData,
    options: seismicOptions
});

// Simulate live updates every 5 seconds
setInterval(() => {
    const randomMagnitude = (Math.random() * 2).toFixed(1);  // Random seismic magnitude between 0 and 2
    seismicGraph.data.datasets[0].data.shift();  // Remove the first data point
    seismicGraph.data.datasets[0].data.push(randomMagnitude);  // Add the new data point
    seismicGraph.update();  // Update the chart
}, 5000);
