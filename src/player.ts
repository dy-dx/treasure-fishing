import { TestScene } from "./scenes/test.scene";

export class Player extends Phaser.Physics.Matter.Sprite {
  public scene!: TestScene;

  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    texture: string = "",
    frame?: string | integer,
    options?: object,
  ) {
    super(world, x, y, texture, frame, options);
    this.setRectangle(60, 60, {
      // for defaults, see:
      // https://github.com/photonstorm/phaser/blob/v3.14.0/src/physics/matter-js/lib/body/Body.js

      // Infinity prevents rotation after collision (default 0)
      inertia: Infinity,
    });
  }

  public update(time: number, delta: number): void {
    if (this.scene.cursors.left!.isDown) {
      this.setVelocityX(-5);
    } else if (this.scene.cursors.right!.isDown) {
      this.setVelocityX(5);
    }

    if (this.scene.cursors.up!.isDown) {
      this.setVelocityY(-5);
    } else if (this.scene.cursors.down!.isDown) {
      this.setVelocityY(5);
    }
  }
}
