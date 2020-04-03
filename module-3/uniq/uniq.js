export function uniq(symbols = []) {
  let set = new Set();
  for (let symbol of symbols) {
    set.add(symbol);
  }
  return Array.from(set);
}
