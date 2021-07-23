import Game from './game';
import Entity from './entity';

import config from '../data/config';

import { CELL_SIZE, GAME_SIZE, PLAYER_SIZE, STEP_LENGTH } from '../utils/constants';
import { centerize } from '../utils/helpers';
import { Direction, Color, LevelObject } from '../utils/enums';
import { DirectionMap } from '../utils/mappings';
import { Position } from '../utils/types';

const checkCollision = ([ax, ay]: Position, [bx, by]: Position) => {
  if (ax * CELL_SIZE < bx * CELL_SIZE + CELL_SIZE || ax * CELL_SIZE > bx * CELL_SIZE) return true;
  if (bx * CELL_SIZE < ax * CELL_SIZE + CELL_SIZE || bx * CELL_SIZE > ax * CELL_SIZE) return true;
  if (ay * CELL_SIZE < by * CELL_SIZE + CELL_SIZE || ay * CELL_SIZE > by * CELL_SIZE) return true;
  if (by * CELL_SIZE < ay * CELL_SIZE + CELL_SIZE || by * CELL_SIZE > ay * CELL_SIZE) return true;
  return false;
};

class Player extends Entity {
  constructor(game: Game, position) {
    super(game, position);
  }

  setDirection(direction: Direction) {
    this.nextDirection = direction;
  }

  // tryMove() {
  //   this.checkNextDirection();
  //   if (this.direction !== Direction.None) {
  //     const [x, y] = this.getNextPosition().map(value => Math.round(value));

  //     if (config.showNextStep) {
  //       this.game.context.fillStyle = '#faa5';
  //       this.game.context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  //     }

  //     if (this.game.level[y][x] !== LevelObject.Wall) this.move();;
  //   }
  // }

  tick() {
    if (!this.position) return console.error('User cannot be spawned');

    this.tryMove();
    this.render();

    document.getElementById('position').textContent = JSON.stringify(this.position);
    document.getElementById('direction').textContent = DirectionMap[this.direction]
  }

  checkNextDirection() {
    if (this.nextDirection === Direction.None) return;

    const [x, y] = this.getNextPosition(this.nextDirection).map(value => Math.round(value));

    if (this.game.level[y][x] !== LevelObject.Wall) {
      this.direction = this.nextDirection;
      this.nextDirection = Direction.None;
    }
  }

  analizeCell() {
    const [x, y] = this.position;

    if (this.game.level[y][x] === LevelObject.Food) {
      this.game.level = this.game.level.map((row, index) => {
        if (index !== y) return row;

        return row.map((cell, index) => {
          if (index === x) return LevelObject.Air;
          return cell;
        });
      })
    }
  }

  getNextPosition(direction: Direction = this.direction): Position {
    const [x, y] = this.position;

    switch(direction) {
      case Direction.Up: {
        const newY = y - STEP_LENGTH;
        return [x, newY < 0 ? GAME_SIZE - 1 : newY];
      }
      case Direction.Down: {
        const newY = y + STEP_LENGTH;
        return [x, newY > GAME_SIZE - 1 ? 0 : newY];
      }
      case Direction.Left: {
        const newX = x - STEP_LENGTH;
        return [newX < 0 ? GAME_SIZE - 1 : newX, y];
      }
      case Direction.Right: {
        const newX = x + STEP_LENGTH;
        return [newX > GAME_SIZE - 1 ? 0 : newX, y];
      }
    }

    return this.position;
  }

  move() {
    this.position = this.getNextPosition();
    this.analizeCell();
  }

  render() {
    const ctx = this.game.context;
    const [x, y] = this.position;

    ctx.fillStyle = Color.Yellow;
    ctx.fillRect(
      x * CELL_SIZE + centerize(PLAYER_SIZE),
      y * CELL_SIZE + centerize(PLAYER_SIZE),
      PLAYER_SIZE,
      PLAYER_SIZE,
    );
  }
}

export default Player;
