// @ts-ignore
import hookSprite from "../assets/icons8-fishing-hook-30.png";
import { Player } from "../player";

export class TestScene extends Phaser.Scene {
  public cursors!: Phaser.Input.Keyboard.CursorKeys;
  public player!: Player;

  public BoundsCollisionCategory!: number;
  public PlayerCollisionCategory!: number;
  public PlatformCollisionCategory!: number;
  public RopeCollisionCategory!: number;

  constructor() {
    super({key: "Test"});
  }

  public preload() {
    this.load.image("hook", hookSprite);
  }

  public create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    // This can be done with repeated calls to this.matter.world.nextCategory()
    // but it doesn't seem to get reset after game.destroy()
    /* tslint:disable:no-bitwise */
    this.BoundsCollisionCategory = 1 << 0;
    this.PlayerCollisionCategory = 1 << 1;
    this.PlatformCollisionCategory = 1 << 2;
    this.RopeCollisionCategory = 1 << 3;

    this.matter.world.setBounds(
      0,
      -200,
      (this.game.config.width as number),
      (this.game.config.height as number) + 200,
    );

    // I don't know why, but objects created with `this.add.rectangle()` aren't visible unless
    // I use the graphics api first for unrelated objects
    const graphics = this.add.graphics({ x: 4, y: 4, fillStyle: { color: 0x0000aa } });
    graphics.fillRectShape(new Phaser.Geom.Rectangle(0, 0, 4, 4));

    const platform = (this.add.rectangle(360, 80, 700, 10, 0xaa0000) as any as Phaser.Physics.Matter.Image);
    this.matter.add.gameObject(platform, { isStatic: true });
    platform.setCollisionCategory(this.PlatformCollisionCategory);

    this.player = new Player(this.matter.world, 360, 40);
    this.sys.displayList.add(this.player);
    this.sys.updateList.add(this.player);
    this.player.setCollisionCategory(this.PlayerCollisionCategory);

    this.player.setCollidesWith([this.BoundsCollisionCategory, this.PlatformCollisionCategory]);

    this.matter.add.mouseSpring({});
  }

  public update(time: number, delta: number): void {
    this.player.update(time, delta);
  }
}
