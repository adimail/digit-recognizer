const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearButton = document.getElementById("clearButton");
const predictButton = document.getElementById("predictButton");
const predictionResult = document.getElementById("predictionResult");

// Initialize canvas with black background
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Set up drawing
let drawing = false;

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// Touch events
canvas.addEventListener("touchstart", startDrawingTouch);
canvas.addEventListener("touchmove", drawTouch);
canvas.addEventListener("touchend", stopDrawing);

function startDrawing(event) {
  drawing = true;
  draw(event);
}

function startDrawingTouch(event) {
  event.preventDefault();
  drawing = true;
  drawTouch(event);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function draw(event) {
  if (!drawing) return;

  // Set drawing properties
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";

  // Get mouse coordinates
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Draw line
  ctx.lineTo(x, y);
  ctx.stroke();

  // Reset path
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function drawTouch(event) {
  if (!drawing) return;

  // Set drawing properties
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";

  // Get touch coordinates
  const rect = canvas.getBoundingClientRect();
  const touch = event.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  // Draw line
  ctx.lineTo(x, y);
  ctx.stroke();

  // Reset path
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Clear canvas
clearButton.addEventListener("click", () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  predictionResult.innerHTML = "";
});

// Convert canvas to base64 and send to Flask backend for prediction
predictButton.addEventListener("click", async () => {
  try {
    predictionResult.innerHTML = "Predicting...";
    predictButton.disabled = true;

    // Convert canvas to data URL
    const imageData = canvas.toDataURL();

    // Send prediction request
    const response = await fetch(predictionEndpoint, {
      method: "POST",
      body: new URLSearchParams({ image: imageData }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Check response
    if (!response.ok) {
      throw new Error("Prediction request failed");
    }

    // Process result
    const result = await response.json();
    if (result.error) {
      predictionResult.innerHTML = "Error: " + result.error;
    } else {
      predictionResult.innerHTML = "Predicted Digit: " + result.prediction;
    }
  } catch (error) {
    predictionResult.innerHTML = "Network or prediction error";
    console.error(error);
  } finally {
    predictButton.disabled = false;
  }
});
