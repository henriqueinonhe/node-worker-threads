const express = require("express");
const { Worker } = require("node:worker_threads");
const { resolve } = require("path");

const app = express();

let counter = 1;

app.get("/", async (req, res) => {
  const requestNumber = counter;
  counter++;

  console.log(`Starting request ${requestNumber}`);

  res.send(new Date().toISOString());

  console.log(`Finishing request ${requestNumber}`);
});

app.get("/slow", async (req, res) => {
  const requestNumber = counter;
  counter++;

  console.log(`Starting request ${requestNumber}`);

  sleep(20000);

  res.send(new Date().toISOString());

  console.log(`Finishing request ${requestNumber}`);
});

app.listen(3000);

const sleep = (ms) => {
  const start = performance.now();

  while (performance.now() - start < ms);
};
