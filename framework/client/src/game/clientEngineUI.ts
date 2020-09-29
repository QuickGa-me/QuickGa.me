import keyboardJS from 'keyboardjs';
import {ClientEngine, ClientGameOptions} from './clientEngine';
import {IClientSocket} from '../socket';
import {BaseEntityModels, Game, GameDebug} from '@quickga.me/framework.common';
import {GameView} from './gameView';

export class ClientEngineUI<EntityModels extends BaseEntityModels> {
  clientEngine: ClientEngine<EntityModels>;
  drawTick = 0;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(
    game: Game<EntityModels>,
    serverPath: string,
    options: ClientGameOptions<EntityModels>,
    socket: IClientSocket
  ) {
    this.clientEngine = new ClientEngine(serverPath, options, socket, game);
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;

    window.addEventListener(
      'resize',
      () => {
        this.canvas.width = GameConstants.screenSize.width;
        this.canvas.height = GameConstants.screenSize.height;
        this.gameView.setBounds(GameConstants.screenSize.width, GameConstants.screenSize.height);
        this.draw();
      },
      true
    );

    keyboardJS.bind(
      'w',
      () => this.clientEngine.setKey('up', true),
      () => this.clientEngine.setKey('up', false)
    );
    keyboardJS.bind(
      'a',
      () => this.clientEngine.setKey('left', true),
      () => this.clientEngine.setKey('left', false)
    );
    keyboardJS.bind(
      's',
      () => this.clientEngine.setKey('down', true),
      () => this.clientEngine.setKey('down', false)
    );

    keyboardJS.bind(
      'd',
      () => this.clientEngine.setKey('right', true),
      () => this.clientEngine.setKey('right', false)
    );
    keyboardJS.bind(
      'space',
      () => this.clientEngine.setKey('shoot', true),
      () => this.clientEngine.setKey('shoot', false)
    );

    const requestNextFrame = () => {
      requestAnimationFrame(() => {
        this.draw();
        requestNextFrame();
      });
    };
    requestNextFrame();
  }

  gameView = new GameView(100, 100);
  draw() {
    this.drawTick++;
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;

    const context = this.context;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    context.save();
    const box = this.gameView.viewBox;
    context.scale(this.gameView.scale, this.gameView.scale);
    context.translate(-box.x, -box.y);

    context.font = '25px bold';
    const entities = this.clientEngine.game.entities.array;
    const sortedEntities = entities.sort((a, b) => a.actor!.zIndex - b.actor!.zIndex);

    const {outerViewBox} = this.gameView;
    for (const entity of sortedEntities) {
      if (
        !entity.inView(
          outerViewBox.x,
          outerViewBox.y,
          outerViewBox.width,
          outerViewBox.height,
          this.clientEngine.game.clientPlayerId!
        )
      ) {
        continue;
      }
      entity.actor!.draw(context);
    }

    context.restore();
    for (const entity of sortedEntities) {
      if (
        !entity.inView(
          outerViewBox.x,
          outerViewBox.y,
          outerViewBox.width,
          outerViewBox.height,
          this.clientEngine.game.clientPlayerId!
        )
      ) {
        continue;
      }
      entity.actor!.staticDraw(context);
    }

    /*
    if (GameDebug.client) {
      context.save();
      context.font = '22px bold';
      context.fillStyle = 'white';
      context.textBaseline = 'top';
      let debugY = context.canvas.height - 22;
      for (const key of Object.keys(this.clientEngine.debugValues)) {
        context.fillText(`${key}: ${this.clientEngine.debugValues[key]}`, 0, debugY);
        debugY -= 22;
      }
      // todo lag? context.fillText(`Average Lag between ticks: ${this.clientEngine.lagAverage.average.toFixed(1)}ms`, 0, debugY);
      // debugY -= 22;
      context.fillText(`Latency: ${this.clientEngine.latency.toFixed(1)}ms`, 0, debugY);
      context.restore();
      context.restore();
    }
*/

    if (GameDebug.collisions) {
      context.save();
      context.beginPath();
      context.scale(this.gameView.scale, this.gameView.scale);
      context.translate(-box.x, -box.y);
      this.clientEngine.game.collisionEngine.draw(context);
      context.fillStyle = 'rgba(255,0,85,0.4)';
      context.fill();
      context.restore();
    }
  }
}
