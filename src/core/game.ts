class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private playground: HTMLDivElement;
  private interval: ReturnType<typeof setInterval>;

  constructor () {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.height = 600;
    this.canvas.width = 600;

    this.playground = document.querySelector('.pacman');
  }

  start() {
    this.playground.appendChild(this.canvas);
  }
}

export default Game;
