import Game from './game';
import Entity from './entity';

import { GHOST_COLORS, GHOST_SIZE, CELL_SIZE, GAME_SIZE } from '../utils/constants';
import { pickRandom, centerize, compareArrays } from '../utils/helpers';
import { Color, Direction, LevelObject } from '../utils/enums';
import { Position } from '../utils/types';
import { OppositeDirectionMap } from '../utils/mappings';

class Ghost extends Entity {
  private color: Color;
  possibleDirections: Direction[] = [];

  constructor(game: Game, position: Position) {
    super(game, position);

    if (this.game.ghosts.length > GHOST_COLORS.length) {
      this.color = pickRandom(GHOST_COLORS);
    } else {
      const unusedColors = GHOST_COLORS.filter(color => !this.game.ghosts.some(ghost => ghost.getColor() === color));
      this.color = pickRandom(unusedColors);
    }
  }

  tick() {
    if (this.game.player.direction !== Direction.None) this.updateDirection();

    this.render();
    this.tryMove();
  }

  move() {
    this.position = this.getNextPosition();
  }

  getColor() {
    return this.color;
  }

  private render() {
    const ctx = this.game.context;

    const [x, y] = this.position;

    ctx.fillStyle = this.color;
    ctx.fillRect(
      x * CELL_SIZE + centerize(GHOST_SIZE),
      y * CELL_SIZE + centerize(GHOST_SIZE),
      GHOST_SIZE,
      GHOST_SIZE,
    );
  }

  private getDirectionToPlayer(): Direction | null {
    const [x, y] = this.position;
    const { level, player } = this.game;

    for (let direction of this.possibleDirections) {
      switch(direction) {
        case Direction.Up:
          for (let row = y; row > 0; row--) {
            if (level[row][x] === LevelObject.Wall) break;
            if (compareArrays(player.position, [x, row])) return Direction.Right;
          }
        case Direction.Down:
          for (let row = y; row < GAME_SIZE; row++) {
            if (level[row][x] === LevelObject.Wall) break;
            if (compareArrays(player.position, [x, row])) return Direction.Right;
          }
        case Direction.Left:
          for (let cell = x; cell > 0; cell--) {
            if (level[y][cell] === LevelObject.Wall) break;
            if (compareArrays(player.position, [cell, y])) return Direction.Right;
          }
        case Direction.Right:
          for (let cell = x; cell < GAME_SIZE; cell++) {
            if (level[y][cell] === LevelObject.Wall) break;
            if (compareArrays(player.position, [cell, y])) return Direction.Right;
          }
      }
    }

    return null;
  }

  private updateDirection() {
    if (this.possibleDirections.length) {
      const directionToPlayer = this.getDirectionToPlayer();

      if (directionToPlayer !== null) {
        this.direction = directionToPlayer;
        return;
      }
    }

    const possibleDirections =
      [Direction.Up, Direction.Down, Direction.Left, Direction.Right]
        .filter(direction => {
          const [x, y] = this.getNextPosition(direction);

          if (this.direction !== Direction.None && direction === OppositeDirectionMap[this.direction]) return false;

          return this.game.level[y][x] !== LevelObject.Wall;
        });

    if (!compareArrays(possibleDirections, this.possibleDirections)) {
      this.direction = pickRandom(possibleDirections);
      this.possibleDirections = possibleDirections;
    }
  }
}

export default Ghost;
