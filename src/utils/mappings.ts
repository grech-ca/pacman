import { Arrow, Direction } from './enums';

export const ArrowDirectionMap = {
  [Arrow.Up]: Direction.Up,
  [Arrow.Down]: Direction.Down,
  [Arrow.Left]: Direction.Left,
  [Arrow.Right]: Direction.Right,
};

export const OppositeDirectionMap = {
  [Direction.Up]: Direction.Down,
  [Direction.Down]: Direction.Up,
  [Direction.Left]: Direction.Right,
  [Direction.Right]: Direction.Left,
};

export const DirectionMap = {
  [Direction.Up]: 'Up',
  [Direction.Down]: 'Down',
  [Direction.Left]: 'Left',
  [Direction.Right]: 'Right',
  [Direction.None]: 'None',
}
