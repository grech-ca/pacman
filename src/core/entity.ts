import config from '../data/config';

import Game from './game';

import { CELL_SIZE, GAME_SIZE, STEP_LENGTH } from '../utils/constants';
import { Direction, LevelObject } from '../utils/enums';
import { Position } from '../utils/types';

abstract class Entity {
  direction: Direction = Direction.None;
  nextDirection: Direction = Direction.None;
  position: Position;

  game: Game;

  constructor(game: Game, position: Position) {
    this.game = game;
    this.position = position;
  }

  tick() {}
  analizeCell() {}
  move() {}

  setDirection(direction: Direction) {
    this.nextDirection = direction;
  }

  tryMove() {
    this.checkNextDirection();
    if (this.direction !== Direction.None) {
      const [x, y] = this.getNextPosition().map(value => Math.round(value));

      if (config.showNextStep) {
        this.game.context.fillStyle = '#faa5';
        this.game.context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }

      if (this.game.level[y][x] !== LevelObject.Wall) this.move();;
    }
  }

  checkNextDirection() {
    if (this.nextDirection === Direction.None) return;

    const [x, y] = this.getNextPosition(this.nextDirection).map(value => Math.round(value));

    if (this.game.level[y][x] !== LevelObject.Wall) {
      this.direction = this.nextDirection;
      this.nextDirection = Direction.None;
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
}

export default Entity;
