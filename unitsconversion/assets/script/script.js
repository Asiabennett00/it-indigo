function calculate() {
    "use strict";
    /* Make sure that the form is valid */
    $(document).ready(function () {
       
        if ($( "#unit-converter" ).valid()) {
           
            /* get the From Value from the form */
            let fromInput = document.getElementById("input").value;
           
            /* convert the operands from string to floating point */
            let fromValue = parseFloat (fromInput);
           
            /* figure out which operator was checked and place the value in operator */
            let fromUnit;
            if (document.getElementById("from-cm").checked) {
                fromUnit = document.getElementById("from-cm").value;
            }
            if (document.getElementById("from-m").checked) {
                fromUnit = document.getElementById("from-m").value;
            }
            if (document.getElementById("from-km").checked) {
                fromUnit = document.getElementById("from-km").value;
            }
            if (document.getElementById("from-in").checked) {
                fromUnit = document.getElementById("from-in").value;
            }
            if (document.getElementById("from-ft").checked) {
                fromUnit = document.getElementById("from-ft").value;
            }
            if (document.getElementById("from-yd").checked) {
                fromUnit = document.getElementById("from-yd").value;
            }
            if (document.getElementById("from-mi").checked) {
                fromUnit = document.getElementById("from-mi").value;
            }




            let toUnit;
            if (document.getElementById("to-cm").checked) {
                toUnit = document.getElementById("to-cm").value;
            }
            if (document.getElementById("to-m").checked) {
                toUnit = document.getElementById("to-m").value;
            }
            if (document.getElementById("to-km").checked) {
                toUnit = document.getElementById("to-km").value;
            }
            if (document.getElementById("to-in").checked) {
                toUnit = document.getElementById("to-in").value;
            }
            if (document.getElementById("to-ft").checked) {
                toUnit = document.getElementById("to-ft").value;
            }
            if (document.getElementById("to-yd").checked) {
                toUnit = document.getElementById("to-yd").value;
            }
            if (document.getElementById("to-mi").checked) {
                toUnit = document.getElementById("to-mi").value;
            }






            convertUnits(fromValue, fromUnit, toUnit);
        }
    });


}


async function convertUnits(fromValue, fromUnit, toUnit) {
    "use strict";


    let myURL = "https://brucebauer.info/assets/ITEC3650/unitsconversion.php";
    myURL = myURL + "?FromValue=" + fromValue + "&FromUnit=" + fromUnit + "&ToUnit=" + toUnit;


    try {
        let response = await fetch(myURL);
        let resultText = await response.text();
        document.getElementById("result").innerHTML = resultText;
    }
    catch (err) {
        document.getElementById("result").innerHTML = "Error: conversion failed.";
    }
}


function clearForm() {
   
    /* Set all of the form values to blank or false */
    document.getElementById("input").value = "";
    document.getElementById("from-error").innerHTML = "";




    document.getElementById("from-cm").checked = false;
    document.getElementById("from-m").checked = false;
    document.getElementById("from-km").checked = false;
    document.getElementById("from-in").checked = false;
    document.getElementById("from-ft").checked = false;
    document.getElementById("from-yd").checked = false;
    document.getElementById("from-mi").checked = false;


   
    document.getElementById("to-cm").checked = false;
    document.getElementById("to-m").checked = false;
    document.getElementById("to-km").checked = false;
    document.getElementById("to-in").checked = false;
    document.getElementById("to-ft").checked = false;
    document.getElementById("to-yd").checked = false;
    document.getElementById("to-mi").checked = false;




    document.getElementById("fromUnitsError").innerHTML = "";
    document.getElementById("toUnitsError").innerHTML = "";




    document.getElementById("result").innerHTML = "";
}


/* Form Validation */
$( "#unit-converter" ).validate({});


