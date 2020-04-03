export function trimSymbols(str, limit) {
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
}
