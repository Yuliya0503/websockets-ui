export function randomIntRange(min: number, max: number): number {
  if (min <= max) {
    return Math.floor(Math.random() * (max - min) + min);
  } else {
    throw new Error('Error: range is faled');
  }
}
