const { workerData, threadId } = require("worker_threads");

const array = workerData;

let i = 0;
while (i < 10e5) {
  // Atomics.add(array, 1, 1);

  const isLocked = Atomics.load(array, 0) === 1;
  if (isLocked) {
    continue;
  }

  // Lock
  Atomics.store(array, 0, 1);

  array[1]++;
  i++;

  // Unlock
  Atomics.store(array, 0, 0);
}
