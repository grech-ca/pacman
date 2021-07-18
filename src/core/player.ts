import Game from './game';

import config from '../data/config';
import { CELL_SIZE, PLAYER_SIZE, STEP_LENGTH } from '../utils/constants';
import { Direction, Color } from '../utils/enums';

const checkCollision = ([ax, ay]: [number, number], [bx, by]: [number, number]) => {
  if (ax * CELL_SIZE < bx * CELL_SIZE + CELL_SIZE || ax * CELL_SIZE > bx * CELL_SIZE) return true;
  if (bx * CELL_SIZE < ax * CELL_SIZE + CELL_SIZE || bx * CELL_SIZE > ax * CELL_SIZE) return true;
  if (ay * CELL_SIZE < by * CELL_SIZE + CELL_SIZE || ay * CELL_SIZE > by * CELL_SIZE) return true;
  if (by * CELL_SIZE < ay * CELL_SIZE + CELL_SIZE || by * CELL_SIZE > ay * CELL_SIZE) return true;
  return false;
};

class Player {
  private game: Game;
  private direction: Direction = Direction.None;
  private nextDirection: Direction = Direction.None;
  private position: [number, number] | undefined;

  constructor(game: Game) {
    this.game = game;

    const { level } = this.game;

    for (let row = 0; row <= level.length; row++) {
      for (let col = 0; col <= level[row].length; col++) {
        if (level[row][col] === 3) {
          this.position = [col, row];
          break;
        }
      }

      if (this.position) break;
    }
  }

  setDirection(direction: Direction) {
    this.nextDirection = direction;
  }

  tick() {
    if (!this.position) return console.error('User cannot be spawned');

    this.checkNextDirection();
    if (this.direction !== Direction.None) {
      const [x, y] = this.getNextPosition().map(value => Math.round(value));

      if (config.showNextStep) {
        this.game.context.fillStyle = '#faa5';
        this.game.context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      if (this.game.level[y][x] !== 1) {
        this.move();
        this.analizeCell();
      }
    }

    this.render();
  }

  private checkNextDirection() {
    if (this.nextDirection === Direction.None) return;

    const [x, y] = this.getNextPosition(this.nextDirection).map(value => Math.round(value));

    if (this.game.level[y][x] !== 1) {
      this.direction = this.nextDirection;
      this.nextDirection = Direction.None;
    }
  }

  private analizeCell() {
    const [x, y] = this.position;

    if (this.game.level[y][x] === 2) {
      this.game.level = this.game.level.map((row, index) => {
        if (index !== y) return row;

        return row.map((cell, index) => {
          if (index === x) return 0;
          return cell;
        });
      })
    }
  }

  private getNextPosition(direction: Direction = this.direction, offset: number = 0): [number, number] {
    const [x, y] = this.position;

    switch(direction) {
      case Direction.Up:
        return [x, y - (STEP_LENGTH + offset)];
      case Direction.Down:
        return [x, y + STEP_LENGTH + offset];
      case Direction.Left:
        return [x - (STEP_LENGTH + offset), y];
      case Direction.Right:
        return [x + STEP_LENGTH + offset, y];
    }

    return this.position;
  }

  private move() {
    this.position = this.getNextPosition();
  }

  private render() {
    const ctx = this.game.context;
    const { position: pos } = this;

    ctx.fillStyle = Color.Yellow;
    ctx.fillRect(
      pos[0] * CELL_SIZE + ((CELL_SIZE - PLAYER_SIZE) / 2),
      pos[1] * CELL_SIZE + ((CELL_SIZE - PLAYER_SIZE) / 2),
      PLAYER_SIZE,
      PLAYER_SIZE,
    );
  }
}

export default Player;
