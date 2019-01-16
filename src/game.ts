import Phaser from "phaser";
import { TestScene } from "./scenes/test.scene";

export default function createGame(elem: HTMLElement, width: number, height: number) {
  return new Phaser.Game({
    parent: elem,
    type: Phaser.AUTO,
    width,
    height,
    resolution: 1,
    physics: {
      default: "matter",
      arcade: {
        debug: true,
        gravity: {
          y: 200,
        },
      },
      matter: {
        debug: true,
        gravity: {
          y: 0.7,
        },
      },
    },
    scene: [TestScene],
  });
}
