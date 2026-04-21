const display = document.getElementById("display");

function append(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  let expression = display.value;

  // Prevent division by zero
  if (expression.includes("/0")) {
    alert("Cannot divide by zero");
    display.value = "";
    return;
  }

  try {
    display.value = eval(expression);
  } catch {
    alert("Invalid calculation");
    display.value = "";
  }
}