const { Worker } = require("node:worker_threads");
const { resolve } = require("path");
const { parseValue, transferValue, serializeValue } = require("../../utils");

const user = {
  id: "1",
  name: "John Doe",
  age: 27,
};

const serializedUser = serializeValue(user);

const buffer = new SharedArrayBuffer(
  Uint32Array.BYTES_PER_ELEMENT * serializedUser.length
);
const view = new Uint32Array(buffer);

transferValue(user, view);

const worker = new Worker(resolve(__dirname, "./worker.js"));

worker.once("exit", () => {
  console.log("Main", parseValue(view));
});

worker.postMessage(view);
