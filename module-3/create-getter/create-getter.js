/**
 * createGetter
 * @param {string} path
 * @returns {function}
 */
export function createGetter(path) {
  const pathArray = path.split('.');

  return obj => {
    let result = obj;

    for (let item of pathArray) {
      if (typeof result[item] !== 'undefined') {
        result = result[item];
      } else {
        result = undefined;
        break;
      }
    }

    return result;
  };
}

export function createGetterRecursion(path) {
  const pathArray = path.split('.');

  return obj => {
    let result = obj;

    const getValue = arr => {
      if (arr.length && result) {
        result = result[arr.shift()];
        return getValue(arr);
      } else {
        return result;
      }
    };

    return getValue(pathArray);
  };
}
// my
/*export function createGetter(field) {
  const path = field.split('.');

  return (obj) => {
    let result = obj;
    for (let pathItem of path) {
      result = result[pathItem];
      if (result === undefined)
        break;
    }
    return result;
  };
}*/
