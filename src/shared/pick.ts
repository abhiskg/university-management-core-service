const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
) => {
  const pickedObject: Partial<T> = {};

  for (const key of keys) {
    //if obj has the key then append it
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      pickedObject[key] = obj[key];
    }
  }
  return pickedObject;
};

export default pick;
