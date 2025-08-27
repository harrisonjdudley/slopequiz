function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLine() {
  let m = getRandomInt(-5, 5);
  while (m === 0) m = getRandomInt(-5, 5); // avoid zero slope
  let b = getRandomInt(-10, 10);
  return { m, b };
}

function getRandomPoint() {
  return {
    x: getRandomInt(-10, 10),
    y: getRandomInt(-10, 10)
  };
}

function isPointOnLine(point, line) {
  // y = mx + b
  return point.y === line.m * point.x + line.b;
}

function renderQuestion(line, point) {
  const questionDiv = document.getElementById('question');
  questionDiv.innerHTML = `Line: <b>y = ${line.m}x + ${line.b}</b><br>Point: <b>(${point.x}, ${point.y})</b>`;
}

function renderSolution(line, point, onLine) {
  const solution = document.createElement('div');
  solution.innerHTML =
    `<b>Solution:</b><br>
    Substitute x = ${point.x} into y = ${line.m}x + ${line.b}:<br>
    y = ${line.m} * ${point.x} + ${line.b} = ${line.m * point.x + line.b}<br>
    The point's y value is ${point.y}.<br>
    <b>Conclusion:</b> The point (${point.x}, ${point.y}) is <b>${onLine ? 'on' : 'not on'}</b> the line.`;
  return solution;
}

function drawGraph(line, point) {
  const canvas = document.getElementById('graph');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Graph settings
  const w = canvas.width;
  const h = canvas.height;
  const xMin = -10, xMax = 10, yMin = -10, yMax = 10;
  const xScale = w / (xMax - xMin);
  const yScale = h / (yMax - yMin);

  // Draw axes
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h/2);
  ctx.lineTo(w, h/2);
  ctx.moveTo(w/2, 0);
  ctx.lineTo(w/2, h);
  ctx.stroke();

  // Draw line
  ctx.strokeStyle = '#2d3a4b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let x1 = xMin, y1 = line.m * xMin + line.b;
  let x2 = xMax, y2 = line.m * xMax + line.b;
  ctx.moveTo(
    (x1 - xMin) * xScale,
    h - ((y1 - yMin) * yScale)
  );
  ctx.lineTo(
    (x2 - xMin) * xScale,
    h - ((y2 - yMin) * yScale)
  );
  ctx.stroke();

  // Draw point
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(
    (point.x - xMin) * xScale,
    h - ((point.y - yMin) * yScale),
    6, 0, 2 * Math.PI
  );
  ctx.fill();
}

function setupQuiz() {
  const line = getRandomLine();
  const point = getRandomPoint();
  const onLine = isPointOnLine(point, line);
  renderQuestion(line, point);
  // Hide the graph until solution is revealed
  const canvas = document.getElementById('graph');
  canvas.style.display = 'none';

  const solutionBox = document.getElementById('solution-box');
  solutionBox.classList.remove('revealed');
  solutionBox.textContent = 'Show Solution';
  // Remove previous solution if any
  while (solutionBox.firstChild && solutionBox.firstChild.nodeType === 1) {
    solutionBox.removeChild(solutionBox.firstChild);
  }
  solutionBox.onclick = function() {
    if (!solutionBox.classList.contains('revealed')) {
      solutionBox.classList.add('revealed');
      solutionBox.textContent = '';
      solutionBox.appendChild(renderSolution(line, point, onLine));
      // Show and draw the graph when solution is revealed
      canvas.style.display = 'block';
      drawGraph(line, point);
    }
  };
}

window.onload = function() {
  setupQuiz();
  const nextBtn = document.getElementById('next-btn');
  nextBtn.onclick = function() {
    setupQuiz();
  };
};
