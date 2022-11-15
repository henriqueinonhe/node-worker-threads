const { Worker } = require("node:worker_threads");
const { resolve } = require("path");
const { readFileSync, writeFileSync } = require("node:fs");
const bmp = require("bmp-js");

const main = async () => {
  const imageBuffer = readFileSync(resolve(__dirname, "../image.bmp"));
  const imageData = bmp.decode(imageBuffer);

  const view = new Uint8Array(imageData.data);

  const start = performance.now();

  view.forEach((value, index) => {
    if (index % 4 === 0) {
      return;
    }

    const middle = 127;
    const delta = value - middle;
    const relativeDelta = delta / middle;
    const adjustedRelativeDelta = relativeDelta * 0.4;
    const factor = 1 + adjustedRelativeDelta;

    view[index] = Math.min(value * factor, 255);
  });

  console.log(performance.now() - start);

  const processedImage = bmp.encode({
    data: view,
    width: imageData.width,
    height: imageData.height,
  });

  writeFileSync(
    resolve(__dirname, "../processed-image.bmp"),
    processedImage.data
  );
};

main();

const createWorker = (data) => {
  const worker = new Worker(resolve(__dirname, "./worker.js"), {
    workerData: data,
  });

  return worker;
};

const waitForWorkerOnline = (worker) =>
  new Promise((resolve) => worker.once("online", resolve));
