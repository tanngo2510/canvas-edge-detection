const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

video.addEventListener(
  "play",
  () => {
    const ctx = canvas.getContext("2d");
    setInterval(() => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      frame = grayscale(frame);
      frame = sobelGradient(frame);
      frame = nonMaxSuppression(frame);
      frame = doubleThresholding(frame);
      frame = edgeTracking(frame);
      ctx.putImageData(frame, 0, 0);
    }, 20);
  },
  false
);

//grayscale function
function grayscale(frame) {
  const data = frame.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  return frame;
}

// gaussian kernel
function gaussianKernel(n, m, sigma) {
  const kernel = [];
  const center = Math.floor(n / 2);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      kernel.push([i - center, j - center, gaussian(i - center, j - center)]);
    }
  }
  return kernel;
}

// gaussian function
function gaussian(x, y, sigma = 1.4) {
  return (
    (1 / (2 * Math.PI * sigma * sigma)) *
    Math.exp(-(x * x + y * y) / (2 * sigma * sigma))
  );
}

function sobelGradient(frame) {
  const data = frame.data;
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];
  const newFrame = new ImageData(frame.width, frame.height);
  for (let i = 0; i < data.length; i += 4) {
    let sumX = 0;
    let sumY = 0;
    for (let j = 0; j < sobelX.length; j++) {
      for (let k = 0; k < sobelX[j].length; k++) {
        const x = i + sobelX[j][k];
        const y = i + sobelY[j][k];
        if (x < 0 || x >= data.length || y < 0 || y >= data.length) {
          continue;
        }
        sumX += data[x] * sobelX[j][k];
        sumY += data[y] * sobelY[j][k];
      }
    }
    const sum = Math.sqrt(sumX * sumX + sumY * sumY);
    newFrame.data[i] = sum;
    newFrame.data[i + 1] = sum;
    newFrame.data[i + 2] = sum;
    newFrame.data[i + 3] = 255;
  }
  return newFrame;
}

function nonMaxSuppression(frame) {
  const data = frame.data;
  const newFrame = new ImageData(frame.width, frame.height);
  for (let i = 0; i < data.length; i += 4) {
    const pixel = data[i];
    const prevPixel = data[i - 4];
    const nextPixel = data[i + 4];
    if (pixel > prevPixel && pixel > nextPixel) {
      newFrame.data[i] = pixel;
      newFrame.data[i + 1] = pixel;
      newFrame.data[i + 2] = pixel;
      newFrame.data[i + 3] = 255;
    }
  }
  return newFrame;
}

function doubleThresholding(frame) {
  const data = frame.data;
  const newFrame = new ImageData(frame.width, frame.height);
  for (let i = 0; i < data.length; i += 4) {
    const pixel = data[i];
    if (pixel < 50) {
      newFrame.data[i] = 0;
      newFrame.data[i + 1] = 0;
      newFrame.data[i + 2] = 0;
      newFrame.data[i + 3] = 255;
    } else if (pixel > 150) {
      newFrame.data[i] = 255;
      newFrame.data[i + 1] = 255;
      newFrame.data[i + 2] = 255;
      newFrame.data[i + 3] = 255;
    } else {
      newFrame.data[i] = 100;
      newFrame.data[i + 1] = 100;
      newFrame.data[i + 2] = 100;
      newFrame.data[i + 3] = 255;
    }
  }
  return newFrame;
}

function edgeTracking(frame) {
  const data = frame.data;
  const newFrame = new ImageData(frame.width, frame.height);
  for (let i = 0; i < data.length; i += 4) {
    const pixel = data[i];
    if (pixel == 100) {
      newFrame.data[i] = 255;
      newFrame.data[i + 1] = 255;
      newFrame.data[i + 2] = 255;
      newFrame.data[i + 3] = 255;
    } else {
      newFrame.data[i] = 0;
      newFrame.data[i + 1] = 0;
      newFrame.data[i + 2] = 0;
      newFrame.data[i + 3] = 255;
    }
  }
  return newFrame;
}
