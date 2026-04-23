$(document).ready(function () {
  "use strict";

  let currencyChart = null;

  // Set up jQuery Validate
  $("#currencyForm").validate({
    rules: {
      baseCurrency: { required: true },
      toCurrency: { required: true },
      fromDate: { required: true },
      toDate: { required: true }
    },
    messages: {
      baseCurrency: "Base Currency is Required",
      toCurrency:   "Convert To Currency is Required",
      fromDate:     "From Date is Required",
      toDate:       "To Date is Required"
    },
    errorPlacement: function (error, element) {
      $("#" + element.attr("id") + "Error").html(error);
    },
    submitHandler: function () {
      showCurrencyChart();
    }
  });

  async function showCurrencyChart() {
    clearErrors();
    destroyChart();

    const fromCurr = $("#baseCurrency").val();
    const toCurr   = $("#toCurrency").val();
    const FromDate = $("#fromDate").val();
    const ToDate   = $("#toDate").val();
    const apiKey   = "tBxBFlmKAGUDpvs8qVdIsDHDTlrnlBxg";

    // Extra validation: same currency or bad date range
    if (fromCurr === toCurr) {
      $("#toCurrencyError").text("Currencies must be different");
      return;
    }
    if (FromDate > ToDate) {
      $("#toDateError").text("To Date must be after From Date");
      return;
    }

    const forexTicker = "C:" + fromCurr + toCurr;
    const myURL = `https://api.polygon.io/v2/aggs/ticker/${forexTicker}/range/1/day/${FromDate}/${ToDate}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`;

    try {
      const msgObject = await fetch(myURL);

      if (msgObject.status >= 200 && msgObject.status <= 299) {
        const msg = await msgObject.json();

        const numDays = msg.results ? msg.results.length : 0;

        if (numDays > 0) {
          const currencyDate  = msg.results.map(r => new Date(r.t).toLocaleDateString());
          const currencyValue = msg.results.map(r => r.c);

          $("#chartHeading").text(`${fromCurr} to ${toCurr}`);

          const canvas  = document.getElementById("currencyChart");
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);

          currencyChart = new Chart(canvas, {
            type: "line",
            data: {
              labels: currencyDate,
              datasets: [{
                label: `${fromCurr} to ${toCurr}`,
                data: currencyValue,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true
            }
          });

        } else {
          $("#generalError").text("No currency data found for that date range.");
        }

      } else {
        $("#generalError").text("Currency data not found - Status: " + msgObject.status);
      }

    } catch (err) {
      console.error(err);
      $("#generalError").text("Network error - could not reach the API.");
    }
  }

  function destroyChart() {
    if (currencyChart) {
      currencyChart.destroy();
      currencyChart = null;
    }
  }

  function clearErrors() {
    $("#baseCurrencyError, #toCurrencyError, #fromDateError, #toDateError, #generalError").text("");
  }

  $("#clearBtn").on("click", function () {
    $("#currencyForm")[0].reset();
    clearErrors();
    destroyChart();
    $("#chartHeading").text("Currency Value History");
  });
});