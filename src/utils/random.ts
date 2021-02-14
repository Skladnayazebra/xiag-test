export const randomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pickRandomFromArray = (array: unknown[]): unknown => array[randomNumberInRange(0, array.length - 1)]
