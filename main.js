function changeVideo() {
  let video_list = document.getElementById("videos");
  let name_file = video_list.options[video_list.selectedIndex].value;
  let url = video_list.options[video_list.selectedIndex].getAttribute("data-foo");
  let text = video_list.options[video_list.selectedIndex].text;
  document.getElementById("video").src = name_file + ".mp4";
  document.getElementById("link-video").href = url;
  document.getElementById("link-video").innerHTML = text;
}

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

video.addEventListener("play", () => {
  const ctx = canvas.getContext("2d");
  setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    frame = grayscale(frame);
    frame = sobelGradient(frame);
    ctx.putImageData(frame, 0, 0);
  }, 20);
}, false);

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
function sobelGradient(frame) {
  const data = frame.data;
  const sobelX = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];
  const sobelY = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];
  const newFrame = new ImageData(frame.width, frame.height);
  for (let i = 0; i < data.length; i += 4) {
    let sumX = 0;
    let sumY = 0;
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        const x = i + (j - 1) * 4 + (k - 1) * 4 * frame.width;
        sumX += data[x] * sobelX[j][k];
        sumY += data[x] * sobelY[j][k];
      }
    }
    const sum = Math.sqrt(sumX * sumX + sumY * sumY) / 4;
    newFrame.data[i] = sum;
    newFrame.data[i + 1] = sum;
    newFrame.data[i + 2] = sum;
    newFrame.data[i + 3] = 255;
  }
  return newFrame;
}
