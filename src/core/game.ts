import playground from '../data/playground';

const RENDER_INTERVAL = 200;
const GAME_SIZE = 600;
const CELL_SIZE = 20;

const FOOD_SIZE = 4;
const PLAYER_SIZE = 18;

enum Color {
  Black = '#000',
  White = '#fff',
  Blue = '#00f',
  Orange = '#fa0',
  Yellow = '#f00',
}

class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private playground: HTMLDivElement;

  private interval: ReturnType<typeof setInterval>;

  constructor () {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.height = GAME_SIZE;
    this.canvas.width = GAME_SIZE;

    this.playground = document.querySelector('.pacman');
  }

  start() {
    this.playground.appendChild(this.canvas);

    this.interval = setInterval(this.render.apply(this), RENDER_INTERVAL);
  }

  private render() {
    const ctx = this.context;

    const color = (colorValue: Color) => { ctx.fillStyle = colorValue };
    
    color(Color.Black);
    ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE)

    playground.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        switch (cell) {
          case 0: break;

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
