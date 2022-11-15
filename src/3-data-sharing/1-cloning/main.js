const { Worker } = require("node:worker_threads");
const { resolve } = require("path");

const user = {
  id: "1",
  name: "John Doe",
  age: 27,
};

const worker = new Worker(resolve(__dirname, "./worker.js"));

worker.on("exit", () => {
  console.log("Main", user);
});

worker.postMessage(user);
