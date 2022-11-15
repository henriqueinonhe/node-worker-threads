const { Worker } = require("node:worker_threads");
const { resolve } = require("path");
const { readFileSync, writeFileSync } = require("node:fs");
const { times } = require("lodash");
const bmp = require("bmp-js");

const createWorker = (data) => {
  const worker = new Worker(resolve(__dirname, "./worker.js"), {
    workerData: data,
  });

  return worker;
};

const waitForWorkerOnline = (worker) =>
  new Promise((resolve) => worker.once("online", resolve));

const waitForWorkerExit = (worker) =>
  new Promise((resolve) => worker.once("exit", resolve));

const main = async () => {
  const imageBuffer = readFileSync(resolve(__dirname, "../image.bmp"));
  const imageData = bmp.decode(imageBuffer);

  const shared = new SharedArrayBuffer(imageData.data.length);
  const view = new Uint8Array(shared);
  view.set(imageData.data);

  const poolSize = 100;
  const dataChunkSize = view.length / poolSize;
  const workers = times(poolSize, (index) =>
    createWorker({
      startIndex: index * dataChunkSize,
      endIndex: (index + 1) * dataChunkSize,
      data: view,
    })
  );

  await Promise.all(workers.map(waitForWorkerOnline));

  const start = performance.now();

  workers.forEach((worker) => {
    worker.postMessage("start");
  });

  await Promise.all(workers.map(waitForWorkerExit));

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
