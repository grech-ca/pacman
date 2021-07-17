import playground from '../data/playground';
import Player from './player';

import { GAME_SIZE, CELL_SIZE, FOOD_SIZE, TICK_SPEED } from '../utils/constants';
import { ArrowDirectionMap } from '../utils/mappings';
import { Color, Arrow } from '../utils/enums';

class Game {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  playground: HTMLDivElement;
  level: number[][];
  player: Player;

  interval: ReturnType<typeof setInterval>;

  constructor () {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.height = GAME_SIZE;
    this.canvas.width = GAME_SIZE;
    this.canvas.tabIndex = 0;

    this.playground = document.querySelector('.pacman');
    this.level = playground;

    this.player = new Player(this);

    this.canvas.addEventListener('keydown', e => {
      if (Object.values(Arrow).includes(e.key as Arrow)) this.player.setDirection(ArrowDirectionMap[e.key]);
      if (e.key === " ") {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        } else {
          this.interval = setInterval(this.tick, TICK_SPEED);
        }
      }
    })
  }

  start() {
    this.playground.appendChild(this.canvas);
    this.canvas.focus();

    this.interval = setInterval(this.tick, TICK_SPEED);
  }

  private tick = () => {
    this.render();
    // console.log('tick')
    this.player.tick();
  }

  private render = () => {
    const ctx = this.context;

    const color = (colorValue: Color) => { ctx.fillStyle = colorValue };
    
    color(Color.Black);
    ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE)

    this.level.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        switch (cell) {
          case 0:
          case 3:
            break;

          case 1: {
            color(Color.Blue);
            ctx.fillRect(
              cellIndex * CELL_SIZE,
              rowIndex * CELL_SIZE,
              CELL_SIZE,
              CELL_SIZE
            );
            break;
          }

          case 2: {
            color(Color.Orange);
            ctx.fillRect(
              cellIndex * CELL_SIZE + ((CELL_SIZE - FOOD_SIZE) / 2),
              rowIndex * CELL_SIZE + ((CELL_SIZE - FOOD_SIZE) / 2),
              FOOD_SIZE,
              FOOD_SIZE,
            )
          }
        }
      })
    });
  }
}

export default Game;
