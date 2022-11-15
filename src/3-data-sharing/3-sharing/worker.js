const { parentPort } = require("node:worker_threads");
const { transferValue, parseValue } = require("../../utils");

parentPort.once("message", (data) => {
  const user = parseValue(data);

  user.age = 99;

  console.log("Worker", user);

  transferValue(user, data);
});
