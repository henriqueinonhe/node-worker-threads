const { Worker } = require("node:worker_threads");
const { resolve } = require("path");

const user = {
  id: "1",
  name: "John",
  age: 27,
};

const worker = new Worker(resolve(__dirname, "./worker.js"));

worker.postMessage(user);

worker.on("online", () => {
  console.log("Worker started!");
});

worker.on("exit", () => {
  console.log("Worker finished!");
});
