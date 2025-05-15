function setProgress(id, percent) {
  const circle = document.getElementById(id);
  const offset = 314 - (percent / 100) * 314;
  circle.style.strokeDashoffset = offset;

  if (percent < 50) {
    circle.style.stroke = "#2ecc71"; // Green
  } else if (percent < 80) {
    circle.style.stroke = "#f1c40f"; // Yellow
  } else {
    circle.style.stroke = "#e74c3c"; // Red
  }
}

// Update Blynk temperature and humidity
async function updateLiveData() {
  const token = "pMpn__YBNhn0sIolqbzcPY4NxCm_EEDL";

  try {
    // Fetch temperature (V0)
    const tempRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&V0`);
    const temp = await tempRes.text();
    const tempNum = parseFloat(temp);
    if (!isNaN(tempNum)) {
      document.getElementById("tempText").textContent = `${tempNum}°C`;
      setProgress("tempCircle", tempNum);
    }

    // Fetch humidity (V1)
    const humRes = await fetch(`https://blynk.cloud/external/api/get?token=${token}&V1`);
    const hum = await humRes.text();
    const humNum = parseFloat(hum);
    if (!isNaN(humNum)) {
      document.getElementById("humidityText").textContent = `${humNum}%`;
      setProgress("humidityCircle", humNum);
    }
  } catch (err) {
    console.error("Error fetching Blynk data:", err);
  }
}

// Initial values
setProgress("floodCircle", 75);
setProgress("aqiCircle", 60);

// Fetch new data every 2 seconds
setInterval(updateLiveData, 2000);
updateLiveData();

// Seismic Chart (Dummy for now)
const ctx = document.getElementById('pmChart').getContext('2d');
const pmChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [{
      label: 'Seismic Vibration (Magnitude)',
      data: Array.from({ length: 30 }, () => Math.random() * 7.0),
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
