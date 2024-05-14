export function add(array: string[], value: string): string[] {
  if (array.indexOf(value) === -1) {
    array.push(value);
  }

  return array;
}

export function remove(array: string[], value: string): string[] {
  let index: number = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  }

  return array;
}
