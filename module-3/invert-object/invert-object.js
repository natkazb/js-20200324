export function invertObj(obj) {
  if (obj === undefined)
    return obj;
  let newObj = {};
  for (let key in obj) {
    newObj[obj[key]] = key;
  }
  return newObj;
}
