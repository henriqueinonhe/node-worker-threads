const { threadId, parentPort } = require("node:worker_threads");

parentPort.once("message", (data) => {
  console.log(data);
});
