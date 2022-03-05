const {
  isMainThread,
  Worker,
  workerData,
  threadId,
  parentPort,
} = require("worker_threads");
const { random, times } = require("lodash");

(async () => {
  if (isMainThread) {
    const haystackLength = 1e9;
    const buffer = new SharedArrayBuffer(
      Int32Array.BYTES_PER_ELEMENT * haystackLength
    );
    const array = new Int32Array(buffer).fill(0);
    const needleCount = 100;
    times(needleCount, () => {
      const index = random(0, haystackLength);
      array[index] = 1;
    });

    const poolSize = 8;
    const promises = new Array(poolSize).fill(null).map((_, index) => {
      const worker = new Worker(__filename, {
        workerData: {
          buffer,
          beginIndex: (array.length / poolSize) * index,
          endIndex: (array.length / poolSize) * (index + 1),
        },
      });

      return new Promise((resolve) => {
        worker.on("online", () => resolve(worker));
      });
    });

    const workers = await Promise.all(promises);

    console.time("Timer");

    const newPromises = [];
    workers.forEach((worker) => {
      worker.postMessage("START");

      newPromises.push(
        new Promise((resolve) => {
          worker.on("exit", resolve);
        })
      );
    });

    await Promise.all(newPromises);
    console.timeEnd("Timer");
  } else {
    parentPort.on("message", () => {
      console.log(`Worker ${threadId}`, new Date().toISOString());
      console.time(`Worker ${threadId}`);
      const { buffer, beginIndex, endIndex } = workerData;
      const array = new Int32Array(buffer);

      const markedIndexes = [];
      for (let index = beginIndex; index < endIndex; index++) {
        if (array[index] === 1) {
          markedIndexes.push(index);
        }
      }

      console.log({ threadId, markedIndexes });
      console.timeEnd(`Worker ${threadId}`);

      parentPort.close();
    });
  }
})();
