"use strict";

$(document).ready(function () {

    // Initialize jQuery validation
    $("#myform").validate({
        errorPlacement: function (error, element) {
            let name = element.attr("name");
            $("#" + name + "Msg").html(error);
        }
    });

});

function calculate() {

    let form = $("#myform");

    // Stop if form is not valid
    if (!form.valid()) {
        return;
    }

    // Get values
    let fromValue = $("#FromValue").val();
    let fromUnit = $("input[name='FromUnit']:checked").val();
    let toUnit = $("input[name='ToUnit']:checked").val();

    // Build URL
    let myURL = "https://brucebauer.info/assets/ITEC3650/unitsconversion.php";
    myURL += "?FromValue=" + encodeURIComponent(fromValue)
          + "&FromUnit=" + encodeURIComponent(fromUnit)
          + "&ToUnit=" + encodeURIComponent(toUnit);

    // AJAX call using fetch
    fetch(myURL)
        .then(response => response.text())
        .then(data => {
            $("#Result").html(data);
        })
        .catch(error => {
            console.log("Error:", error);
        });
}

function clearform() {

    // Reset form fields
    $("#myform")[0].reset();

    // Clear validation messages
    $("#FromValueMsg").html("");
    $("#FromUnitMsg").html("");
    $("#ToUnitMsg").html("");

    // Clear result
    $("#Result").html("");
}