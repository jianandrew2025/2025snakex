let grid = 15;
let screenW = 300; // 竖屏宽度
let screenH = 600; // 竖屏高度
let gameAreaH = screenH - screenH / 5; // 游戏区高度（五分之四）
let snake = [];
let food, dir;
let dead = false;
let score = 20250128; // 初始分数
let foodCount = 0;
let SCREEN_GREEN;
let showFinalText = false;
let isBlinking = false; // 是否闪烁
let blinkFrame = 0; // 闪烁帧计数器

function setup() {
  createCanvas(screenW, screenH);
  frameRate(7.5); // 提高帧率以加快闪烁速度
  textFont("monospace", 24);
  snake.push(createVector(screenW / 2, gameAreaH / 2));
  dir = createVector(0, -1); // 初始向上
  SCREEN_GREEN = color(57, 255, 20); // 荧光绿
  spawnFood();
}

function draw() {
  background(SCREEN_GREEN); // 荧光绿背景

  // 游戏逻辑
  if (!dead && !showFinalText) {
    let head = snake[0].copy();
    head.add(dir.copy().mult(grid));
    head.x = (head.x + screenW) % screenW;
    head.y = (head.y + gameAreaH) % gameAreaH;

    // 碰撞检测
    for (let i = 1; i < snake.length; i++)
      if (head.dist(snake[i]) < grid / 2) dead = true;

    snake.unshift(head);

    // 吃食检测
    if (head.dist(food) < grid) {
      foodCount++;
      // 分数变为 20250129 后进入闪烁状态
      if (score == 20250128) {
        score = 20250129;
        isBlinking = true; // 开始闪烁
      }
      if (foodCount >= 3) showFinalText = true; // 吃到第三个食物后游戏结束
      spawnFood();
    } else {
      snake.pop();
    }
  }

  // 绘制元素
  fill(0);
  noStroke();
  for (let i = 0; i < snake.length; i++) {
    let p = snake[i];
    rect(p.x + 1, p.y + 1, grid - 2, grid - 2); // 蛇身，每个方块之间空 1 像素
  }

  drawPixelHeart(food.x, food.y); // 像素化爱心食物

  // 文字区域分隔线
  stroke(0);
  line(0, gameAreaH, screenW, gameAreaH);

  // 数字显示
  fill(0);
  textAlign(LEFT, CENTER);

  // 闪烁逻辑
  if (isBlinking) {
    blinkFrame++;
    if (blinkFrame % 5 < 3) { // 每 5 帧闪烁一次，显示 3 帧，隐藏 2 帧
      text(str(score), 10, gameAreaH + 30);
    }
  } else {
    text(str(score), 10, gameAreaH + 30);
  }

  // 最终文字效果
  if (showFinalText) {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("新春快乐\n祝你贪吃", screenW / 2, screenH / 2 - 3 * grid); // 整体上移三行
  }

  // 右下角动态文字
  drawDynamicText();
}

function keyPressed() {
  if (keyCode === UP_ARROW && dir.y !== 1) dir.set(0, -1);
  else if (keyCode === DOWN_ARROW && dir.y !== -1) dir.set(0, 1);
  else if (keyCode === LEFT_ARROW && dir.x !== 1) dir.set(-1, 0);
  else if (keyCode === RIGHT_ARROW && dir.x !== -1) dir.set(1, 0);
}

function spawnFood() {
  food = createVector(floor(random(screenW / grid)) * grid,
    floor(random(gameAreaH / grid)) * grid);
}

// 绘制像素化爱心
function drawPixelHeart(x, y) {
  push();
  translate(x, y); // 移动到食物位置

  // 定义爱心的像素化形状（5x5）
  let heart = [
    [0, 1, 0, 1, 0], // 第一行
    [1, 1, 1, 1, 1], // 第二行
    [1, 1, 1, 1, 1], // 第三行
    [0, 1, 1, 1, 0], // 第四行
    [0, 0, 1, 0, 0]  // 第五行
  ];

  // 绘制爱心
  fill(0); // 黑色
  noStroke();
  for (let i = 0; i < heart.length; i++) {
    for (let j = 0; j < heart[i].length; j++) {
      if (heart[i][j] === 1) {
        rect(j * 3, i * 3, 3, 3); // 每个像素块大小为 3x3
      }
    }
  }

  pop();
}

// 右下角动态文字
function drawDynamicText() {
  let texts = ["新春快乐", "祝你贪吃"];
  textSize(14);
  textAlign(RIGHT, CENTER); // 右对齐，垂直居中
  fill(0);

  // 计算文字高度，使其与左侧数字高度对齐
  let textY = gameAreaH + 30; // 与左侧数字高度一致

  // 闪烁逻辑：吃第二个食物后开始闪烁
  if (foodCount >= 1) {
    blinkFrame++;
    if (blinkFrame % 5 < 3) { // 每 5 帧闪烁一次，显示 3 帧，隐藏 2 帧
      text(texts[foodCount % 2], screenW - 10, textY);
    }
  } else {
    // 未吃第二个食物时正常显示
    text(texts[foodCount % 2], screenW - 10, textY);
  }
}
