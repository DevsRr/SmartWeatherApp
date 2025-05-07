// Animate circular progress
function animateCircle(id, percent) {
    const circle = document.getElementById(id);
    const offset = 314 - (314 * percent) / 100;
    circle.style.strokeDashoffset = offset;
  }
  
  // Initialize circular progress bars
  animateCircle("floodCircle", 75);     // 75% flood level
  animateCircle("tempCircle", 64);      // 64% for temperature
  animateCircle("humidityCircle", 65);  // 65% humidity
  animateCircle("aqiCircle", 100);      // 100% = good AQI
  
  // Chart.js Seismic Activity Graph
  const ctx = document.getElementById('pmChart').getContext('2d');
  const pmChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: Array.from({ length: 30 }, (_, i) => i + 1),
          datasets: [
              {
                  label: 'Seismic Sensor Data',
                  data: [0.2, 0.3, 0.4, 0.3, 0.6, 0.4, 0.5, 0.4, 0.7, 0.6, 0.2, 0.5, 0.3, 0.8, 0.6, 0.4, 0.3, 0.7, 0.5, 0.6, 0.4, 0.3, 0.2, 0.4, 0.5, 0.4, 0.6, 0.5, 0.4, 0.3],
                  borderColor: 'rgba(255, 206, 86, 1)',
                  backgroundColor: 'rgba(255, 206, 86, 0.2)',
                  fill: true,
                  tension: 0.4
              }
          ]
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  labels: {
                      color: '#fff'
                  }
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
  
