let facemesh;
let video;
let predictions = [];

// 定義要串接的特徵點編號
const pointIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, () => {
    console.log("Camera initialized successfully!");
  });
  video.size(width, height);
  video.hide();
}

function draw() {
  if (video.loadedmetadata) {
    image(video, 0, 0, width, height);
  } else {
    console.log("Waiting for video to load...");
    background(0); // 顯示黑色背景，表示尚未載入
  }

  // 繪製紅色線條
  drawLines();
}

function drawLines() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    stroke(255, 0, 0); // 設定線條顏色為紅色
    strokeWeight(5); // 設定線條粗細為 5
    noFill();

    // 繪製線條，將指定的點串接起來
    beginShape();
    for (let i = 0; i < pointIndices.length; i++) {
      const index = pointIndices[i];
      const [x, y] = keypoints[index];
      vertex(x, y);
    }
    endShape(CLOSE); // 將最後一點與第一點連接
  }
}
