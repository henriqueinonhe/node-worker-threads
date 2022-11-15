const { parentPort } = require("node:worker_threads");
const { serializeValue, parseValue } = require("../../utils");

parentPort.once("message", (data) => {
  const user = parseValue(data);

  user.age = 99;

  console.log("Worker", user);

  const serializedUser = serializeValue(user);

  serializedUser.forEach((val, index) => {
    data[index] = val;
  });

  parentPort.postMessage(data, [data.buffer]);
});
