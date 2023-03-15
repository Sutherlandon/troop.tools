// Converts an array into an indexable list by a given key
// returns an object with each item at key item[key]
export function arrayToObject(arr, key) {
  const obj = {};
  arr.forEach((item) => (obj[item[key]] = item));

  return obj;
}
