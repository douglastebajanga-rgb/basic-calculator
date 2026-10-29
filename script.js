const display = document.getElementById("display");
const historyList = document.getElementById("history-list");
let isDegreeMode = true;
let history = [];

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

function calculate() {
  let expression = display.value;

  if (!expression) return;

  // Prevent division by zero check
  if (/\/0(?!\d)/.test(expression)) {
    alert("Cannot divide by zero");
    display.value = "";
    return;
  }

  try {
    let parsedExpression = parseScientificExpression(expression);
    let result = eval(parsedExpression);

    // Format floating point results cleanly
    if (typeof result === "number" && !Number.isInteger(result)) {
      result = parseFloat(result.toFixed(8));
    }

    // Add calculation to history log
    addHistoryEntry(expression, result);

    display.value = result;
  } catch (error) {
    alert("Invalid calculation");
    display.value = "";
  }
}

function parseScientificExpression(expr) {
  expr = expr.replace(/π/g, "Math.PI");
  expr = expr.replace(/\be\b/g, "Math.E");
  expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
  expr = expr.replace(/\^2/g, "**2");
  expr = expr.replace(/\^/g, "**");
  expr = expr.replace(/log\(/g, "Math.log10(");
  expr = expr.replace(/ln\(/g, "Math.log(");

  const angleFactor = isDegreeMode ? "*(Math.PI/180)" : "";

  expr = expr.replace(/sin\(([^)]+)\)/g, (match, arg) => `Math.sin((${arg})${angleFactor})`);
  expr = expr.replace(/cos\(([^)]+)\)/g, (match, arg) => `Math.cos((${arg})${angleFactor})`);
  expr = expr.replace(/tan\(([^)]+)\)/g, (match, arg) => `Math.tan((${arg})${angleFactor})`);

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
    // Click on history item to load result into display
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