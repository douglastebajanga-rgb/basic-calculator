const display = document.getElementById("display");
const historyList = document.getElementById("history-list");
let isDegreeMode = true;
let history = [];
let memory = 0;
let lastAns = 0;

function toggleAngleMode() {
  isDegreeMode = !isDegreeMode;
  document.getElementById("angle-mode").innerText = isDegreeMode ? "DEG" : "RAD";
}

function append(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Memory Functions
function memoryClear() {
  memory = 0;
}

function memoryRecall() {
  display.value += memory;
}

function memoryAdd() {
  try {
    let currentVal = eval(parseScientificExpression(display.value));
    if (!isNaN(currentVal)) memory += currentVal;
  } catch (e) {
    alert("Invalid value for M+");
  }
}

function memorySubtract() {
  try {
    let currentVal = eval(parseScientificExpression(display.value));
    if (!isNaN(currentVal)) memory -= currentVal;
  } catch (e) {
    alert("Invalid value for M-");
  }
}

// Math Helper Functions
function fact(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function recip(n) {
  if (n === 0) return "Error";
  return 1 / n;
}

function exp(n) {
  return Math.exp(n);
}

function calculate() {
  let expression = display.value;

  if (!expression) return;

  if (/\/0(?!\d)/.test(expression)) {
    alert("Cannot divide by zero");
    display.value = "";
    return;
  }

  try {
    let parsedExpression = parseScientificExpression(expression);
    let result = eval(parsedExpression);

    if (typeof result === "number" && !Number.isInteger(result) && !isNaN(result)) {
      result = parseFloat(result.toFixed(8));
    }

    lastAns = result;
    addHistoryEntry(expression, result);
    display.value = result;
  } catch (error) {
    alert("Invalid calculation");
    display.value = "";
  }
}

function parseScientificExpression(expr) {
  expr = expr.replace(/\bAns\b/g, lastAns);
  expr = expr.replace(/π/g, "Math.PI");
  expr = expr.replace(/\be\b/g, "Math.E");
  expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
  expr = expr.replace(/\^2/g, "**2");
  expr = expr.replace(/\^/g, "**");
  expr = expr.replace(/log\(/g, "Math.log10(");
  expr = expr.replace(/ln\(/g, "Math.log(");
  expr = expr.replace(/exp\(/g, "exp(");
  expr = expr.replace(/fact\(/g, "fact(");
  expr = expr.replace(/recip\(/g, "recip(");

  const angleFactor = isDegreeMode ? "*(Math.PI/180)" : "";
  const inverseAngleFactor = isDegreeMode ? "*(180/Math.PI)" : "";

  expr = expr.replace(/sin\(([^)]+)\)/g, (match, arg) => `Math.sin((${arg})${angleFactor})`);
  expr = expr.replace(/cos\(([^)]+)\)/g, (match, arg) => `Math.cos((${arg})${angleFactor})`);
  expr = expr.replace(/tan\(([^)]+)\)/g, (match, arg) => `Math.tan((${arg})${angleFactor})`);

  expr = expr.replace(/asin\(([^)]+)\)/g, (match, arg) => `(Math.asin(${arg})${inverseAngleFactor})`);
  expr = expr.replace(/acos\(([^)]+)\)/g, (match, arg) => `(Math.acos(${arg})${inverseAngleFactor})`);
  expr = expr.replace(/atan\(([^)]+)\)/g, (match, arg) => `(Math.atan(${arg})${inverseAngleFactor})`);

  return expr;
}

/* History Log Logic */
function addHistoryEntry(expr, result) {
  history.unshift({ expr, result });
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `<li class="empty-msg">No history yet</li>`;
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `
      <div class="history-expr">${item.expr}</div>
      <div class="history-result">= ${item.result}</div>
    `;
    li.onclick = () => {
      display.value = item.result;
    };
    historyList.appendChild(li);
  });
}

function clearHistory() {
  history = [];
  renderHistory();
}

/* Keyboard Input Listener */
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key === "." || key === "+" || key === "-" || key === "*" || key === "/" || key === "%" || key === "(" || key === ")") {
    append(key);
  } else if (key === "^") {
    append("^");
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
