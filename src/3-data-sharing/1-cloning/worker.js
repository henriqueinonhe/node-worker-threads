const { parentPort } = require("node:worker_threads");

parentPort.once("message", (data) => {
  data.age = 99;

  console.log("Worker", data);
});
