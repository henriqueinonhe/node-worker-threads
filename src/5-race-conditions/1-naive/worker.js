const { workerData } = require("worker_threads");

const array = workerData;

let i = 0;
while (i < 10e6) {
  array[0]++;
  i++;
}
