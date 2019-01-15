import Phaser from "phaser";
import { TestScene } from "./scenes/test.scene";

interface IRopeSegment extends Phaser.Physics.Matter.Sprite {
  joint?: MatterJS.Constraint;
}

export class Player extends Phaser.Physics.Matter.Sprite {
  public scene!: TestScene;

  public ropeSegments: IRopeSegment[];

  public retractRopeTimer: Phaser.Time.TimerEvent;
  public extendRopeTimer: Phaser.Time.TimerEvent;

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
      // can also be done with this.setFixedRotation()
      inertia: Infinity,
    });

    this.extendRopeTimer = this.scene.time.addEvent({
      delay: 100, // ms
      callback: () => { this.addRopeSegment(); },
      loop: true,
      paused: true,
    });

    this.retractRopeTimer = this.scene.time.addEvent({
      delay: 130, // ms
      callback: () => { this.removeRopeSegment(); },
      loop: true,
      paused: true,
    });

    this.ropeSegments = [];
    this.addRopeSegment();
  }

  public update(time: number, delta: number): void {
    if (this.scene.cursors.left!.isDown) {
      this.setVelocityX(-5);
    } else if (this.scene.cursors.right!.isDown) {
      this.setVelocityX(5);
    }

    if (this.scene.cursors.down!.isUp) {
      this.retractRopeTimer.paused = true;
    }
    if (this.scene.cursors.up!.isUp) {
      this.extendRopeTimer.paused = true;
    }

    if (this.scene.cursors.down!.isDown) {
      this.extendRope();
    } else if (this.scene.cursors.up!.isDown) {
      this.retractRope();
    }

    const ropeHead = this.getRopeHead();
    if (ropeHead) {
      ropeHead.setX(this.x);
      ropeHead.setY(this.y + 50);
    }
  }

  private extendRope(): void {
    if (this.extendRopeTimer.paused) {
      this.extendRopeTimer.paused = false;
    }
  }
  private retractRope(): void {
    if (this.retractRopeTimer.paused) {
      this.retractRopeTimer.paused = false;
    }
  }

  private getRopeHead() {
    return this.ropeSegments[this.ropeSegments.length - 1];
  }

  private addRopeSegment(): IRopeSegment {
    const head = this.getRopeHead();
    const [x, y] = head ? [head.x, head.y] : [this.x, this.y + 50];

    const segment = (this.scene.add.rectangle(x, y, 6, 14, 0x00aa00) as any as IRopeSegment);
    this.scene.matter.add.gameObject(segment, { mass: 0.6, frictionAir: 0.2 });
    segment.setCollisionCategory(this.scene.RopeCollisionCategory);
    segment.setCollidesWith([
      this.scene.BoundsCollisionCategory,
      // this.scene.RopeCollisionCategory,
    ]);

    segment.setStatic(true);
    this.ropeSegments.push(segment);
    if (head) {
      head.setStatic(false);
      head.setY(head.y + 12);

      const joint = this.scene.matter.add.joint(segment, head, 8, 0.6, {
        pointA: {x: 0, y: 4},
        pointB: {x: 0, y: -4},
        render: {
          anchors: false,
          lineWidth: 1,
          type: "line",
        },
      });
      segment.joint = joint;
    }
    return segment;
  }

  private removeRopeSegment(): void {
    const head = this.getRopeHead();
    if (!head) { return; }

    if (head.joint) {
      this.scene.matter.world.removeConstraint(head.joint, false);
      head.joint = undefined;
    }
    head.destroy(true);
    this.ropeSegments.splice(this.ropeSegments.length - 1, 1);

    const nextHead = this.getRopeHead();
    if (nextHead) {
      nextHead.setAngle(0);
      nextHead.setStatic(true);
    }
  }
}
