<<<<<<< HEAD
const display = document.getElementById("display");

function append(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  display.value = eval(display.value);
}
function deleteLast() {
  let display = document.getElementById("display");
  display.value = display.value.slice(0, -1);
=======
const display = document.getElementById("display");

function append(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  display.value = eval(display.value);
>>>>>>> dcaa27a253f11d923082c03f9460766195963da0
}