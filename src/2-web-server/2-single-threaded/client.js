const main = async () => {
  const start = performance.now();

  const promises = new Array(20)
    .fill(null)
    .map(() => fetch("http://localhost:3000"));
  await Promise.all(promises);

  const end = performance.now();
  const elapsed = end - start;

  console.log(`Finished in ${elapsed.toFixed(0)}ms`);
};

main();
