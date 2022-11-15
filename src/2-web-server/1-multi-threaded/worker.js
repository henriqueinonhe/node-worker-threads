const { parentPort, workerData } = require("node:worker_threads");

const sleep = (ms) => {
  const start = performance.now();

  while (performance.now() - start < ms);
};

sleep(2000);
parentPort.postMessage(workerData.toISOString());
