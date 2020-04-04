/**
 * trimSymbols
 * @param {string} string
 * @param {number} size
 * @returns {string}
 */
export function trimSymbols (string, size) {
  const firstSlice = string.slice(0, size);
  const rest = [...string.slice(size)];

  return rest.reduce((accum, item) => {
    if (!accum.endsWith(item.repeat(size))) {
      accum += item;
    }

    return accum;
  }, firstSlice);
}
// my
/*export function trimSymbols(str, limit) {
  if (limit === undefined)
    return str;
  let symbolCounters = {};
  let newStr = '';
  for (let char of str) {
    symbolCounters[char] = symbolCounters[char] === undefined ? 1 : symbolCounters[char] + 1;
    if (symbolCounters[char] <= limit)
      newStr += char;
  }
  return newStr;
}*/
