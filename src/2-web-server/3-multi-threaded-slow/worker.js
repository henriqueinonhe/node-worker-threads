const { parentPort, workerData } = require("node:worker_threads");

const sleep = (ms) => {
  const start = performance.now();

  while (performance.now() - start < ms);
};

sleep(workerData);
parentPort.postMessage(new Date().toISOString());
