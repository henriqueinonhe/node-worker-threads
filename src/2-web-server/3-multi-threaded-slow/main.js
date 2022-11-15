const express = require("express");
const { Worker } = require("node:worker_threads");
const { resolve } = require("path");

const app = express();

app.get("/", async (req, res) => {
  const data = await handleRequest(0);
  res.send(data);
});

app.get("/slow", async (req, res) => {
  const data = await handleRequest(20000);
  res.send(data);
});

app.listen(3000);

const handleRequest = async (delay) => {
  const worker = createWorker(delay);
  const threadId = worker.threadId;

  worker.once("online", () => {
    console.log(`Starting request ${threadId}`);
  });

  worker.once("exit", () => {
    console.log(`Finishing request ${threadId}`);
  });

  const message = await readMessage(worker);

  return message;
};

const createWorker = (workerData) => {
  const worker = new Worker(resolve(__dirname, "./worker.js"), {
    workerData,
  });

  return worker;
};

const readMessage = (worker) =>
  new Promise((resolve) => worker.once("message", resolve));
