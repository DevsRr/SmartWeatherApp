function setProgress(id, percent) {
    const circle = document.getElementById(id);
    const offset = 314 - (percent / 100) * 314;
    circle.style.strokeDashoffset = offset;
  
    // Color change logic
    if (percent < 50) {
      circle.style.stroke = "#2ecc71"; // Green
    } else if (percent < 80) {
      circle.style.stroke = "#f1c40f"; // Yellow
    } else {
      circle.style.stroke = "#e74c3c"; // Red
    }
  }
  
  // Set initial values
  setProgress("floodCircle", 75);
  setProgress("aqiCircle", 60);
  setProgress("tempCircle", 32);  // For % progress
  setProgress("humidityCircle", 65);
  
  // Seismic Chart
  const ctx = document.getElementById('pmChart').getContext('2d');
  const pmChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: 30}, (_, i) => i + 1),
      datasets: [{
        label: 'Seismic Vibration (Magnitude)',
        data: Array.from({length: 30}, () => Math.random() * 7.0),
        borderColor: 'rgba(231, 76, 60, 1)',
        backgroundColor: 'rgba(231, 76, 60, 0.2)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#fff' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#fff' },
          grid: { color: '#444' }
        },
        y: {
          ticks: { color: '#fff' },
          grid: { color: '#444' }
        }
      }
    }
  });
  
