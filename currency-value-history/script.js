$(document).ready(function () {
  const apiKey = "7d40d5ac0-f600-4dd1-b05c-a706fa6c1ac1";
  let currencyChart = null;

  function clearErrors() {
    $("#baseCurrencyError").text("");
    $("#toCurrencyError").text("");
    $("#fromDateError").text("");
    $("#toDateError").text("");
    $("#generalError").text("");
  }

  function clearChart() {
    if (currencyChart) {
      currencyChart.destroy();
      currencyChart = null;
    }
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    const base = $("#baseCurrency").val();
    const target = $("#toCurrency").val();
    const from = $("#fromDate").val();
    const to = $("#toDate").val();

    if (!base) {
      $("#baseCurrencyError").text("Base Currency is Required");
      isValid = false;
    }

    if (!target) {
      $("#toCurrencyError").text("Convert To Currency is Required");
      isValid = false;
    }

    if (!from) {
      $("#fromDateError").text("From Date is Required");
      isValid = false;
    }

    if (!to) {
      $("#toDateError").text("To Date is Required");
      isValid = false;
    }

    if (from && to && from > to) {
      $("#toDateError").text("To Date must be after From Date");
      isValid = false;
    }

    if (base && target && base === target) {
      $("#toCurrencyError").text("Currencies must be different");
      isValid = false;
    }

    return isValid;
  }

  function renderChart(labels, values, base, target) {
    const ctx = document.getElementById("currencyChart").getContext("2d");

    currencyChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `One ${base} to ${target}`,
            data: values,
            borderColor: "#56c7c9",
            backgroundColor: "#56c7c9",
            fill: false,
            tension: 0.2,
            borderWidth: 3,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: target
            }
          }
        }
      }
    });
  }

  function getCurrencyHistory() {
    if (!validateForm()) {
      clearChart();
      $("#chartHeading").text("Currency Value History");
      return;
    }

    clearErrors();
    clearChart();

    const base = $("#baseCurrency").val();
    const target = $("#toCurrency").val();
    const start = $("#fromDate").val();
    const end = $("#toDate").val();

    $("#chartHeading").text(`${base} to ${target}`);

    const url = `https://api.polygon.io/v2/aggs/ticker/C:${base}${target}/range/1/day/${start}/${end}?adjusted=true&sort=asc&apiKey=${apiKey}`;

    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function (data) {
        console.log("API response:", data);

        if (!data.results || data.results.length === 0) {
          $("#generalError").text("No results found for selected dates.");
          return;
        }

        const labels = data.results.map(item => {
          const d = new Date(item.t);
          return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        });

        const values = data.results.map(item => item.c);

        renderChart(labels, values, base, target);
      },
      error: function (xhr, status, error) {
        console.log("Status:", xhr.status);
        console.log("Error:", error);
        console.log("Response:", xhr.responseText);
        $("#generalError").text("Error fetching data from Massive API.");
      }
    });
  }

  function clearForm() {
    $("#currencyForm")[0].reset();
    clearErrors();
    clearChart();
    $("#chartHeading").text("Currency Value History");
  }

  $("#currencyForm").on("submit", function (e) {
    e.preventDefault();
    getCurrencyHistory();
  });

  $("#clearBtn").on("click", function () {
    clearForm();
  });
});