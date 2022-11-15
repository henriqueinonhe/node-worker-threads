const { parentPort, workerData } = require("node:worker_threads");

parentPort.once("message", () => {
  const { startIndex, endIndex, data } = workerData;

  const chunk = data.slice(startIndex, endIndex);

  chunk.forEach((value, index) => {
    if (index % 4 === 0) {
      return;
    }
    const middle = 127;
    const delta = value - middle;
    const relativeDelta = delta / middle;
    const adjustedRelativeDelta = relativeDelta * 0.4;
    const factor = 1 + adjustedRelativeDelta;
    data[index + startIndex] = Math.min(value * factor, 255);
  });
});
