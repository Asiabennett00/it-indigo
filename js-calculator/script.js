function calculate() {

    // Clear previous messages
    document.getElementById("Operand1Msg").innerHTML = "";
    document.getElementById("Operand2Msg").innerHTML = "";
    document.getElementById("OperatorMsg").innerHTML = "";
    document.getElementById("Result").innerHTML = "";

    var op1 = document.getElementById("Operand1").value;
    var op2 = document.getElementById("Operand2").value;

    var add = document.getElementById("AddOperator").checked;
    var subtract = document.getElementById("SubtractOperator").checked;
    var multiply = document.getElementById("MultiplyOperator").checked;
    var divide = document.getElementById("DivideOperator").checked;

    var isValid = true;

    // Validate Operand 1
    if (op1 === "") {
        document.getElementById("Operand1Msg").innerHTML = "Operand 1 is required";
        isValid = false;
    } else if (isNaN(op1)) {
        document.getElementById("Operand1Msg").innerHTML = "Operand 1 must be a number";
        isValid = false;
    }

    // Validate Operand 2
    if (op2 === "") {
        document.getElementById("Operand2Msg").innerHTML = "Operand 2 is required";
        isValid = false;
    } else if (isNaN(op2)) {
        document.getElementById("Operand2Msg").innerHTML = "Operand 2 must be a number";
        isValid = false;
    }

    // Validate Operator
    if (!add && !subtract && !multiply && !divide) {
        document.getElementById("OperatorMsg").innerHTML = "Operator is required";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    var num1 = parseFloat(op1);
    var num2 = parseFloat(op2);
    var result;

    if (add) {
        result = num1 + num2;
    } else if (subtract) {
        result = num1 - num2;
    } else if (multiply) {
        result = num1 * num2;
    } else if (divide) {
        if (num2 === 0) {
            document.getElementById("Operand2Msg").innerHTML = "Cannot divide by zero";
            return;
        }
        result = num1 / num2;
    }

    document.getElementById("Result").innerHTML = result;
}

function clearform() {

    document.getElementById("Operand1").value = "";
    document.getElementById("Operand2").value = "";

    document.getElementById("AddOperator").checked = false;
    document.getElementById("SubtractOperator").checked = false;
    document.getElementById("MultiplyOperator").checked = false;
    document.getElementById("DivideOperator").checked = false;

    document.getElementById("Operand1Msg").innerHTML = "";
    document.getElementById("Operand2Msg").innerHTML = "";
    document.getElementById("OperatorMsg").innerHTML = "";
    document.getElementById("Result").innerHTML = "";
}
