const serializeValue = (value) =>
  JSON.stringify(value)
    .split("")
    .map((char) => char.charCodeAt());

const parseValue = (segment) =>
  JSON.parse(
    segment
      .reduce((accum, char) => {
        accum.push(String.fromCharCode(char));
        return accum;
      }, [])
      .join("")
  );

const transferValue = (value, segment) => {
  const serializedValue = serializeValue(value);

  serializedValue.forEach((entry, index) => {
    segment[index] = entry;
  });
};

module.exports = {
  serializeValue,
  parseValue,
  transferValue,
};
