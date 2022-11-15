const { threadId } = require("node:worker_threads");

setTimeout(() => {
  console.log(`Worker Id: ${threadId}`);
}, 1000);
