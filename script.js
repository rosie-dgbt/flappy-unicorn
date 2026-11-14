// Screen & UI Elements
const mainScreen = document.getElementById("main-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const gameOverBox = document.getElementById("game-over");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game State Variables
let frames = 0;
let score = 0;
let isGameOver = false;
let animationId;

// 1. SCREEN SWITCHING LOGIC
startBtn.addEventListener("click", () => {
  mainScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
});

restartBtn.addEventListener("click", () => {
  resetGame();
});

// 2. RAINBOW GAS PARTICLES
const rainbowParticles = [];
const rainbowColors = ["#ff0040", "#ff7b00", "#ffd500", "#00e676", "#00b0ff", "#d500f9"];

function spawnRainbowGas(x, y, burst = false) {
  const count = burst ? 14 : 2;
  for (let i = 0; i < count; i++) {
    const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    rainbowParticles.push({
      x: x - 18 + (Math.random() * 6 - 3),
      y: y + 4 + (Math.random() * 10 - 5),
      vx: burst ? -(Math.random() * 4 + 2.5) : -(Math.random() * 2 + 1.5),
      vy: burst ? (Math.random() * 4 - 1.5) : (Math.random() * 1.4 - 0.7),
      radius: burst ? Math.random() * 7 + 5 : Math.random() * 5 + 3,
      color: color,
      alpha: 0.95
    });
  }
}

function updateAndDrawRainbowGas() {
  for (let i = rainbowParticles.length - 1; i >= 0; i--) {
    const p = rainbowParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.radius += 0.15;
    p.alpha -= 0.022;

    if (p.alpha <= 0) {
      rainbowParticles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    // Soft white cloud puff highlight inside rainbow gas
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(p.x - p.radius * 0.25, p.y - p.radius * 0.25, p.radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// 3. PINK UNICORN CHARACTER
const unicorn = {
  x: 95,
  y: 250,
  radius: 19,
  velocity: 0,
  gravity: 0.42,
  jumpStrength: -7.6,

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    const tilt = Math.min(Math.max(this.velocity * 0.045, -0.4), 0.45);
    ctx.rotate(tilt);

    // Flowing Rainbow Tail
    ctx.strokeStyle = "#c77dff";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(-28, -2, -31, 8);
    ctx.stroke();

    // 4 Galloping Horse Legs & Hooves
    ctx.strokeStyle = "#e05780";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    // Back legs
    ctx.moveTo(-13, 7); ctx.lineTo(-18, 14); ctx.lineTo(-23, 18);
    ctx.moveTo(-9, 8);  ctx.lineTo(-12, 16); ctx.lineTo(-15, 21);
    // Front legs
    ctx.moveTo(8, 7);   ctx.lineTo(14, 13);  ctx.lineTo(19, 17);
    ctx.moveTo(11, 6);  ctx.lineTo(18, 10);  ctx.lineTo(22, 14);
    ctx.stroke();

    // Golden Hooves
    ctx.fillStyle = "#ffb703";
    [[-23, 18], [-15, 21], [19, 17], [22, 14]].forEach(([hx, hy]) => {
      ctx.beginPath();
      ctx.arc(hx, hy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3D Shaded Horse Silhouette (Torso + Neck + Head + Muzzle)
    const bodyGrad = ctx.createLinearGradient(-15, -20, 20, 12);
    bodyGrad.addColorStop(0, "#ffd6e0");
    bodyGrad.addColorStop(0.5, "#ff8fa3");
    bodyGrad.addColorStop(1, "#e05780");

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(-18, 0);                        // Rump
    ctx.quadraticCurveTo(-6, -3, 4, -3);       // Back / Saddle
    ctx.lineTo(11, -18);                       // Back of neck
    ctx.lineTo(17, -20);                       // Forehead
    ctx.lineTo(28, -13);                       // Nose bridge / Muzzle tip
    ctx.quadraticCurveTo(27, -8, 22, -8);      // Chin / Jaw
    ctx.lineTo(15, -7);                        // Throat
    ctx.quadraticCurveTo(15, 6, 8, 9);         // Chest
    ctx.quadraticCurveTo(-5, 11, -16, 8);      // Belly
    ctx.quadraticCurveTo(-20, 4, -18, 0);      // Hindquarter
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#c9184a";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pointed Horse Ear
    ctx.fillStyle = "#ff8fa3";
    ctx.beginPath();
    ctx.moveTo(11, -18);
    ctx.lineTo(12, -26);
    ctx.lineTo(15, -19);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Golden Spiral Horn (Positioned on Forehead)
    const hornGrad = ctx.createLinearGradient(16, -19, 28, -32);
    hornGrad.addColorStop(0, "#ffb703");
    hornGrad.addColorStop(0.5, "#ffe66d");
    hornGrad.addColorStop(1, "#fb8500");
    ctx.fillStyle = hornGrad;
    ctx.beginPath();
    ctx.moveTo(16, -19);
    ctx.lineTo(29, -31);
    ctx.lineTo(20, -16);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Flowing Strands Mane along Neck
    ctx.lineCap = "round";
    ctx.strokeStyle = "#c77dff";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(11, -18);
    ctx.quadraticCurveTo(4, -13, 2, -4);
    ctx.stroke();

    ctx.strokeStyle = "#48cae4";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(9, -14);
    ctx.quadraticCurveTo(2, -9, 0, -2);
    ctx.stroke();

    // Flapping White Angel Wing
    const wingY = Math.sin(frames * 0.35) * 4;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(-4, 1 + wingY, 10, 6, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffc2d1";
    ctx.stroke();

    // Horse Eye, Sparkle & Nostril
    ctx.fillStyle = "#2b0918";
    ctx.beginPath();
    ctx.arc(18, -15, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(18.7, -15.7, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Nostril on Muzzle
    ctx.fillStyle = "#a4133c";
    ctx.beginPath();
    ctx.arc(25.5, -12, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Continuous light rainbow trail while flying
    if (frames % 3 === 0) {
      spawnRainbowGas(this.x, this.y, false);
    }

    // Ground collision (Candy Island Floor)
    if (this.y + this.radius >= canvas.height - 55) {
      this.y = canvas.height - 55 - this.radius;
      triggerGameOver();
    }

    // Ceiling collision
    if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.velocity = 0;
    }
  },

  flap() {
    if (!isGameOver) {
      this.velocity = this.jumpStrength;
      // Big burst of rainbow gas on each flap!
      spawnRainbowGas(this.x, this.y, true);
    }
  }
};

// 4. CANDY CANE TUBES
const pipes = [];
const pipeWidth = 64;
const pipeGap = 158;

function spawnPipe() {
  const minHeight = 70;
  const maxHeight = canvas.height - pipeGap - 125;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + pipeGap,
    passed: false
  });
}

function drawCandyCaneTube(x, y, width, height, isTop) {
  if (height <= 0) return;

  ctx.save();
  // Drop shadow on background
  ctx.fillStyle = "rgba(128, 15, 47, 0.16)";
  ctx.fillRect(x + 7, y, width, height);

  // Clip region for candy cane body
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  // White sugar base
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, width, height);

  // Diagonal Red Peppermint Stripes
  ctx.fillStyle = "#e63946";
  const stripeSpacing = 28;
  for (let sy = y - width; sy < y + height + width; sy += stripeSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, sy);
    ctx.lineTo(x + width, sy + width * 0.65);
    ctx.lineTo(x + width, sy + width * 0.65 + 14);
    ctx.lineTo(x, sy + 14);
    ctx.closePath();
    ctx.fill();
  }

  // 3D Cylindrical Shading Overlay
  const cylGrad = ctx.createLinearGradient(x, 0, x + width, 0);
  cylGrad.addColorStop(0, "rgba(100, 0, 20, 0.25)");
  cylGrad.addColorStop(0.28, "rgba(255, 255, 255, 0.55)");
  cylGrad.addColorStop(0.65, "rgba(255, 255, 255, 0)");
  cylGrad.addColorStop(1, "rgba(80, 0, 20, 0.35)");
  ctx.fillStyle = cylGrad;
  ctx.fillRect(x, y, width, height);

  ctx.restore();

  // Border outline
  ctx.strokeStyle = "#b51736";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Peppermint Rim Cap
  const rimHeight = 20;
  const rimY = isTop ? y + height - rimHeight : y;
  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.roundRect(x - 5, rimY, width + 10, rimHeight, 6);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function updateAndDrawPipes() {
  if (frames % 105 === 0) {
    spawnPipe();
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];
    p.x -= 2.5;

    drawCandyCaneTube(p.x, 0, pipeWidth, p.top, true);
    drawCandyCaneTube(p.x, p.bottom, pipeWidth, canvas.height - 55 - p.bottom, false);

    // Collision Check
    if (
      unicorn.x + unicorn.radius - 4 > p.x &&
      unicorn.x - unicorn.radius + 4 < p.x + pipeWidth &&
      (unicorn.y - unicorn.radius + 4 < p.top || unicorn.y + unicorn.radius - 4 > p.bottom)
    ) {
      triggerGameOver();
    }

    // Score Check
    if (!p.passed && p.x + pipeWidth < unicorn.x) {
      p.passed = true;
      score++;
      scoreEl.textContent = score;
    }

    if (p.x + pipeWidth < -15) {
      pipes.splice(i, 1);
    }
  }
}

// 5. 3D PINK CASTLE & CANDY ISLAND BACKGROUND
function drawCandyCastleBackground() {
  // A. Pastel Cotton-Candy Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, "#ffccd5");
  skyGrad.addColorStop(0.5, "#ffe5ec");
  skyGrad.addColorStop(1, "#ffc2d1");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // B. Fluffy Cotton-Candy Clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  const cloudShift = (frames * 0.25) % (canvas.width + 180);
  drawCloud(360 - cloudShift, 85, 1);
  drawCloud(560 - cloudShift, 145, 0.8);

  // C. 3D Pink Fairy-Tale Castle in the Background
  drawPinkCastle(215, 235);

  // D. Rolling Pink Frosting Candy Island Hills
  // Back Hill
  ctx.fillStyle = "#ff8fa3";
  ctx.beginPath();
  ctx.arc(110, 560, 175, Math.PI, 0);
  ctx.fill();

  // Front Island Hill with White Dripping Icing
  const hillGrad = ctx.createLinearGradient(0, 380, 0, 550);
  hillGrad.addColorStop(0, "#ff758f");
  hillGrad.addColorStop(1, "#e05780");
  ctx.fillStyle = hillGrad;
  ctx.beginPath();
  ctx.arc(310, 565, 195, Math.PI, 0);
  ctx.fill();

  // E. Candy Island Decorations (Swirl Lollipops & Gumdrops)
  drawLollipop(65, 445, 65, "#ff006e", "#ffffff");
  drawLollipop(355, 425, 75, "#8338ec", "#ffbe0b");
  drawGumdrop(145, 545, "#06d6a0");
  drawGumdrop(265, 545, "#ffd166");

  // F. Candy-Striped Island Ground Floor
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, canvas.height - 55, canvas.width, 55);

  // Pink Frosting Top Layer on Ground
  ctx.fillStyle = "#ff4d6d";
  ctx.fillRect(0, canvas.height - 55, canvas.width, 14);

  // Wavy Icing Drips
  ctx.fillStyle = "#ff4d6d";
  for (let x = 0; x < canvas.width; x += 28) {
    ctx.beginPath();
    ctx.arc(x + 14, canvas.height - 41, 14, 0, Math.PI);
    ctx.fill();
  }

  // Moving Candy Tiles along bottom path
  const groundOffset = (frames * 2.5) % 40;
  ctx.fillStyle = "#ffb3c1";
  for (let x = -groundOffset; x < canvas.width; x += 40) {
    ctx.fillRect(x, canvas.height - 22, 20, 22);
  }
}

function drawCloud(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.arc(22, -6, 26, 0, Math.PI * 2);
  ctx.arc(46, 0, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPinkCastle(cx, cy) {
  ctx.save();

  // Left & Right Side Towers (3D shaded cylinders)
  drawCastleTower(cx - 65, cy + 45, 36, 155);
  drawCastleTower(cx + 65, cy + 45, 36, 155);

  // Main Center Keep
  const keepGrad = ctx.createLinearGradient(cx - 45, 0, cx + 45, 0);
  keepGrad.addColorStop(0, "#ff8fa3");
  keepGrad.addColorStop(0.35, "#ffc2d1");
  keepGrad.addColorStop(1, "#e05780");
  ctx.fillStyle = keepGrad;
  ctx.fillRect(cx - 45, cy + 15, 90, 185);

  // Center Tall Spire Roof
  drawCastleRoof(cx, cy + 15, 54, 70);

  // Side Tower Spire Roofs
  drawCastleRoof(cx - 65, cy + 45, 44, 52);
  drawCastleRoof(cx + 65, cy + 45, 44, 52);

  // Golden Castle Windows
  ctx.fillStyle = "#ffe66d";
  ctx.beginPath();
  ctx.roundRect(cx - 10, cy + 50, 20, 30, [10, 10, 0, 0]);
  ctx.roundRect(cx - 72, cy + 75, 14, 22, [7, 7, 0, 0]);
  ctx.roundRect(cx + 58, cy + 75, 14, 22, [7, 7, 0, 0]);
  ctx.fill();

  // Castle Archway Gate
  ctx.fillStyle = "#a4133c";
  ctx.beginPath();
  ctx.roundRect(cx - 18, cy + 140, 36, 60, [18, 18, 0, 0]);
  ctx.fill();

  ctx.restore();
}

function drawCastleTower(x, y, width, height) {
  const grad = ctx.createLinearGradient(x - width / 2, 0, x + width / 2, 0);
  grad.addColorStop(0, "#ff758f");
  grad.addColorStop(0.35, "#ffb3c1");
  grad.addColorStop(1, "#c9184a");
  ctx.fillStyle = grad;
  ctx.fillRect(x - width / 2, y, width, height);
}

function drawCastleRoof(x, y, width, height) {
  const roofGrad = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y);
  roofGrad.addColorStop(0, "#c9184a");
  roofGrad.addColorStop(0.4, "#ff4d6d");
  roofGrad.addColorStop(1, "#800f2f");
  ctx.fillStyle = roofGrad;

  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x, y - height);
  ctx.lineTo(x + width / 2, y);
  ctx.closePath();
  ctx.fill();

  // Little Flag on top
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(x - 1, y - height - 14, 2, 14);
  ctx.beginPath();
  ctx.moveTo(x + 1, y - height - 14);
  ctx.lineTo(x + 14, y - height - 9);
  ctx.lineTo(x + 1, y - height - 4);
  ctx.fill();
}

function drawLollipop(x, y, stickHeight, color1, color2) {
  // White Stick
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 3, y, 6, stickHeight);

  // 3D Swirl Candy Head
  const grad = ctx.createRadialGradient(x - 6, y - 6, 3, x, y, 22);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.3, color1);
  grad.addColorStop(1, "#590d22");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, 21, 0, Math.PI * 2);
  ctx.fill();

  // Swirl Ring
  ctx.strokeStyle = color2;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(x, y, 12, 0, Math.PI * 1.5);
  ctx.stroke();
}

function drawGumdrop(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 16, Math.PI, 0);
  ctx.fill();
  // Sugar sparkle dot
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.arc(x - 5, y - 7, 3, 0, Math.PI * 2);
  ctx.fill();
}

// 6. MAIN GAME LOOP & CONTROLS
function gameLoop() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCandyCastleBackground();
  updateAndDrawPipes();
  updateAndDrawRainbowGas();
  unicorn.update();
  unicorn.draw();

  frames++;
  animationId = requestAnimationFrame(gameLoop);
}

function triggerGameOver() {
  isGameOver = true;
  cancelAnimationFrame(animationId);
  finalScoreEl.textContent = score;
  gameOverBox.classList.remove("hidden");
}

function resetGame() {
  cancelAnimationFrame(animationId);
  unicorn.y = 250;
  unicorn.velocity = 0;
  pipes.length = 0;
  rainbowParticles.length = 0;
  score = 0;
  frames = 0;
  isGameOver = false;
  scoreEl.textContent = "0";
  gameOverBox.classList.add("hidden");
  gameLoop();
}

// Keyboard & Mouse/Touch Controls
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameScreen.classList.contains("hidden")) {
    e.preventDefault();
    unicorn.flap();
  }
});

canvas.addEventListener("mousedown", () => {
  unicorn.flap();
});

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  unicorn.flap();
});