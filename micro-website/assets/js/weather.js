let forecastChart;

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("weather-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      getWeather();
    });

    getWeather();
  }
});

async function getWeather() {
  const locationInput = document.getElementById("location");
  const errorBox = document.getElementById("weather-error");
  const detailsBox = document.getElementById("location-details");
  const tableBody = document.querySelector("#forecast-table tbody");

  const location = locationInput.value.trim();

  errorBox.textContent = "";
  detailsBox.innerHTML = "";
  tableBody.innerHTML = "";

  if (location === "") {
    errorBox.textContent = "Please enter a location.";
    return;
  }

  try {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=10&language=en&format=json`;
    const geocodeResponse = await fetch(geocodeUrl);

    if (!geocodeResponse.ok) {
      throw new Error("Unable to retrieve location data.");
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      errorBox.textContent = "No matching location was found. Please try another search.";
      return;
    }

    const place = geocodeData.results[0];

    detailsBox.innerHTML = `
      <h3>Location Match</h3>
      <p><strong>Name:</strong> ${place.name}</p>
      <p><strong>Admin1:</strong> ${place.admin1 || "Not available"}</p>
      <p><strong>Country:</strong> ${place.country}</p>
      <p><strong>Latitude:</strong> ${place.latitude}</p>
      <p><strong>Longitude:</strong> ${place.longitude}</p>
    `;

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=temperature_2m_max&temperature_unit=fahrenheit&timezone=auto`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      throw new Error("Unable to retrieve forecast data.");
    }

    const forecastData = await forecastResponse.json();

    const labels = [];
    const temperatures = [];

    for (let i = 0; i < forecastData.daily.time.length; i += 1) {
      const unixmillsec = Date.parse(forecastData.daily.time[i]);
      const tmpdate = new Date(unixmillsec);
      const friendlyDate = tmpdate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      labels.push(friendlyDate);
      temperatures.push(forecastData.daily.temperature_2m_max[i]);

      tableBody.innerHTML += `
        <tr>
          <td>${friendlyDate}</td>
          <td>${forecastData.daily.temperature_2m_max[i]}°F</td>
        </tr>
      `;
    }

    renderChart(labels, temperatures, place.name);
  } catch (error) {
    errorBox.textContent = "An error occurred while loading the forecast. Please try again.";
  }
}

function renderChart(labels, temperatures, locationName) {
  const canvas = document.getElementById("forecastChart");
  const context = canvas.getContext("2d");

  if (forecastChart) {
    forecastChart.destroy();
  }

  forecastChart = new Chart(context, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `7-Day Forecast for ${locationName}`,
          data: temperatures,
          borderColor: "#BF7D56",
          backgroundColor: "rgba(191, 125, 86, 0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.25,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Temperature (°F)"
          }
        },
        x: {
          title: {
            display: true,
            text: "Date"
          }
        }
      }
    }
  });
}