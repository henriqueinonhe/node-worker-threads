const { workerData, threadId } = require("worker_threads");

const array = workerData;

let i = 0;
while (i < 10e5) {
  const isLocked = array[0] === 1;
  if (isLocked) {
    // if (array[0] === 0) {
    //   console.log("CONTRADICTION!");
    // }
    continue;
  }

  // Lock
  array[0] = 1;

  array[1]++;
  i++;

  // Unlock
  array[0] = 0;
}
