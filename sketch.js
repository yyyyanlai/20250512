let facemesh;
let video;
let predictions = [];

// 定義要串接的特徵點編號（臉部輪廓）
const faceOutlineIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

// 定義嘴唇的特徵點編號
const lipsIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61];

function setup() {
  createCanvas(640, 480);

  // 初始化攝影機
  video = createCapture(VIDEO, () => {
    console.log("Camera initialized successfully!");
  });
  video.size(width, height);
  video.hide();

  // 確認 ml5 是否正確載入
  console.log("ml5 version:", ml5.version);

  // 初始化 FaceMesh 模型
  facemesh = ml5.facemesh(video, () => {
    console.log("FaceMesh model loaded!");
  });

  // 當模型偵測到臉部特徵時，更新 predictions
  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function draw() {
  // 水平翻轉畫布，實現鏡像效果
  translate(width, 0);
  scale(-1, 1);

  // 顯示攝影機畫面
  if (video.loadedmetadata) {
    image(video, 0, 0, width, height);
  } else {
    console.log("Waiting for video to load...");
    background(0); // 顯示黑色背景，表示尚未載入
  }

  // 繪製臉部輪廓和嘴唇
  if (predictions.length > 0) {
    drawLines(faceOutlineIndices, color(255, 0, 0)); // 臉部輪廓為紅色
    drawLines(lipsIndices, color(0, 0, 255)); // 嘴唇為藍色
  } else {
    console.log("No predictions available yet.");
  }
}

function drawLines(indices, lineColor) {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    stroke(lineColor); // 設定線條顏色
    strokeWeight(5); // 設定線條粗細為 5
    noFill();

    // 繪製線條，將指定的點串接起來
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const [x, y] = keypoints[index];
      vertex(x, y);
    }
    endShape(CLOSE); // 將最後一點與第一點連接
  }
}
