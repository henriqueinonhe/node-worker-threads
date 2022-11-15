const { Worker } = require("node:worker_threads");
const { resolve } = require("path");

console.log("Main");

const worker = new Worker(resolve(__dirname, "./worker.js"));

worker.on("online", () => {
  console.log("Worker started executing!");
});

worker.on("exit", () => {
  console.log("Worker finished executing!");
});
