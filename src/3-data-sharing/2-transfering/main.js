const { Worker } = require("node:worker_threads");
const { resolve } = require("path");
const { serializeValue, parseValue } = require("../../utils");

const user = {
  id: "1",
  name: "John Doe",
  age: 27,
};

const serializedUser = serializeValue(user);

const segment = Uint32Array.from(serializedUser);

const worker = new Worker(resolve(__dirname, "./worker.js"));

worker.once("message", (data) => {
  console.log("Main", parseValue(data));
});

worker.postMessage(segment, [segment.buffer]);
