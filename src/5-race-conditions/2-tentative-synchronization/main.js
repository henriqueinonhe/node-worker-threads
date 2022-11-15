const { Worker } = require("node:worker_threads");
const { resolve } = require("path");
const { times } = require("lodash");

const createWorker = (data) => {
  const worker = new Worker(resolve(__dirname, "./worker.js"), {
    workerData: data,
  });

  return worker;
};

const waitForWorkerExit = (worker) =>
  new Promise((resolve) => worker.once("exit", resolve));

const main = async () => {
  const buffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 3);
  const array = new Int32Array(buffer).fill(0);

  const poolSize = 2;
  const workers = times(poolSize, () => createWorker(array));

  await Promise.all(workers.map(waitForWorkerExit));

  console.log(array);
};

main();
