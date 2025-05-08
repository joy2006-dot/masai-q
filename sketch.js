let video;
let mosaicSizeSlider;
let showMosaic = false; // 控制是否顯示馬賽克效果
let particles = []; // 粒子效果陣列

function setup() {
  let canvasWidth = windowWidth * 0.8;
  let canvasHeight = windowHeight * 0.8;

  // 將畫布附加到 #canvas-container
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-container");

  pixelDensity(1);

  // 建立滑桿調整馬賽克格子大小
  mosaicSizeSlider = createSlider(5, 80, 20, 1); // min, max, default, step
  mosaicSizeSlider.position(10, 10);
  mosaicSizeSlider.style('width', '200px');

  // 建立攝影機擷取
  video = createCapture(VIDEO);
  video.size(canvasWidth / 20, canvasHeight / 20); // 初始大小，稍後可根據滑桿動態改變
  video.hide();
}

function draw() {
  background(0, 50); // 半透明背景，製造拖影效果

  // 彩帶效果
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(10, 50);
    noStroke();
    fill(random(255), random(255), random(255), 150);
    ellipse(x, y, size, size / 2);
  }

  if (showMosaic) {
    let mosaicSize = mosaicSizeSlider.value();

    // 動態調整攝影機解析度（降低計算量）
    let videoW = width / mosaicSize;
    let videoH = height / mosaicSize;
    video.size(videoW, videoH);

    video.loadPixels();

    for (let y = 0; y < video.height; y++) {
      for (let x = 0; x < video.width; x++) {
        let index = (x + y * video.width) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        // 左右翻轉鏡像處理
        let drawX = (video.width - x - 1) * mosaicSize;
        let drawY = y * mosaicSize;

        noStroke();
        fill(r, g, b);
        rect(drawX, drawY, mosaicSize, mosaicSize);
      }
    }

    // 顯示目前馬賽克大小
    fill(255);
    textSize(14);
    text("Mosaic Size: " + mosaicSize, 220, 25);
  } else {
    // 顯示原始攝影機畫面
    image(video, 0, 0, width, height);
    fill(255);
    textSize(14);
    text("Click to toggle mosaic effect", 10, height - 10);
  }

  // 粒子效果
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  // 切換馬賽克效果的顯示狀態
  showMosaic = !showMosaic;

  // 新增粒子效果
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
}

function windowResized() {
  let newWidth = windowWidth * 0.8;
  let newHeight = windowHeight * 0.8;
  resizeCanvas(newWidth, newHeight);

  if (video) {
    let mosaicSize = mosaicSizeSlider.value();
    video.size(newWidth / mosaicSize, newHeight / mosaicSize);
  }
}

// 粒子類別
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, 10);
  }
}
