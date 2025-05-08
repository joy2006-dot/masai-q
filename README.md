# 20250508作業
🎥✨ 鏡像馬賽克視訊＋彩帶粒子特效（p5.js）
🧠 功能簡述
本程式透過 p5.js 實作：

🎦 攝影機畫面擷取

🟪 可調整的馬賽克效果（附滑桿控制）

🪩 鏡像顯示畫面

🎉 點擊產生彩色粒子爆炸特效

🎀 背景自動生成彩帶動態效果

---
🧾 程式碼說明與筆記
1️⃣ 全域變數與初始化設定
```javascript
let video;
let mosaicSizeSlider;
let showMosaic = false;
let particles = [];

```
* video: 擷取的攝影機畫面
* mosaicSizeSlider: 滑桿控制格子大小 
* showMosaic: 控制是否啟用馬賽克效果 
* particles: 儲存點擊後出現的粒子效果 
---
2️⃣ setup() – 初始化畫面與元件

```javascript
function setup() {
  let canvasWidth = windowWidth * 0.8;
  let canvasHeight = windowHeight * 0.8;

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-container"); // 若無 div 可移除此行

  pixelDensity(1);

  mosaicSizeSlider = createSlider(5, 80, 20, 1);
  mosaicSizeSlider.position(10, 10);
  mosaicSizeSlider.style('width', '200px');

  video = createCapture(VIDEO);
  video.size(canvasWidth / 20, canvasHeight / 20);
  video.hide();
}

```
* 使用 createCanvas 建立畫布
* 使用 createSlider 建立控制馬賽克格子大小的滑桿
* 使用 createCapture(VIDEO) 擷取鏡頭畫面
---
3️⃣ draw() – 主要繪圖邏輯
```javascript
function draw() {
  background(0, 50); // 半透明背景拖影

  // 動態彩帶
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(10, 50);
    noStroke();
    fill(random(255), random(255), random(255), 150);
    ellipse(x, y, size, size / 2);
  }

```
*背景使用透明度製造視覺殘影
*每次繪圖都產生隨機彩帶效果 

---
4️⃣ 顯示鏡像馬賽克畫面區段

```javascript
  if (showMosaic) {
    let mosaicSize = mosaicSizeSlider.value();
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

        let drawX = (video.width - x - 1) * mosaicSize;
        let drawY = y * mosaicSize;

        noStroke();
        fill(r, g, b);
        rect(drawX, drawY, mosaicSize, mosaicSize);
      }
    }

    fill(255);
    textSize(14);
    text("Mosaic Size: " + mosaicSize, 220, 25);
  }

```
* 根據滑桿控制格子大小 
* 左右翻轉畫面製造鏡像效果 
* 使用 rect() 畫出每個像素區塊
---
5️⃣ 顯示原始畫面
```javascript
  else {
    image(video, 0, 0, width, height);
    fill(255);
    textSize(14);
    text("Click to toggle mosaic effect", 10, height - 10);
  }

```
* 若未啟用馬賽克，顯示原始鏡頭畫面
---
6️⃣ 粒子更新與顯示
```javascript
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

```
* 每幀更新與顯示粒子
* 超過壽命就從陣列中移除
---
7️⃣ 點擊觸發事件 mousePressed()
```javascript
function mousePressed() {
  showMosaic = !showMosaic;

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
}

```
* 點一下畫面：切換馬賽克開關、產生粒子效果
---
8️⃣ 重新調整視窗大小 windowResized()
```javascript
function windowResized() {
  let newWidth = windowWidth * 0.8;
  let newHeight = windowHeight * 0.8;
  resizeCanvas(newWidth, newHeight);

  if (video) {
    let mosaicSize = mosaicSizeSlider.value();
    video.size(newWidth / mosaicSize, newHeight / mosaicSize);
  }
}

```
* 自動調整畫布與鏡頭解析度
---
9️⃣ 粒子物件 Particle 類別
```javascript
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

```
* 類別用來產生動畫粒子
* 具有移動、漸淡與繪製功能

