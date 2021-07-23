import { CELL_SIZE } from './constants';

export const pickRandom = (arr: any[]) => arr[Math.round(Math.random() * (arr.length - 1))];

export const centerize = (objectSize: number) => ((CELL_SIZE - objectSize) / 2);

export const compareArrays = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;

  return JSON.stringify(a.sort()) !== JSON.stringify(b.sort());
};
