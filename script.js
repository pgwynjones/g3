// Set up the canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adjust canvas size to fit the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player object
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  color: "blue",
  speed: 5,
};

// Obstacles array
const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 50;

// Game variables
let score = 0;
let isGameOver = false;

// Variables for touch control
let touchStartX = 0;
let touchStartY = 0;

// Add a new obstacle
function createObstacle() {
  const obstacle = {
    x: Math.random() * (canvas.width - obstacleWidth),
    y: -obstacleHeight,
    width: obstacleWidth,
    height: obstacleHeight,
    speed: 3 + Math.random() * 2, // Random speed for obstacles
  };
  obstacles.push(obstacle);
}

// Draw the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Update obstacles
function updateObstacles() {
  obstacles.forEach((obstacle, index) => {
    obstacle.y += obstacle.speed;

    // Remove obstacles that move off-screen
    if (obstacle.y > canvas.height) {
      obstacles.splice(index, 1);
      score++; // Increment score for dodging an obstacle
    }

    // Check for collision
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      isGameOver = true;
    }
  });
}

// Display score
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Display Game Over message
function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
}

// Touch events
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault(); // Prevent scrolling

  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  // Update the player's position based on swipe distance
  player.x += deltaX * 0.05;
  player.y += deltaY * 0.05;

  // Prevent the player from going off-screen
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  // Update touch start position
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

// Main game loop
function gameLoop() {
  if (isGameOver) {
    drawGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawObstacles();
  drawScore();
  updateObstacles();

  requestAnimationFrame(gameLoop);
}

// Spawn new obstacles periodically
setInterval(() => {
  if (!isGameOver) {
    createObstacle();
  }
}, 1000); // Every second

// Start the game
gameLoop();
