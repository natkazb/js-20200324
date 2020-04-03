export function createGetter(field) {
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
}
