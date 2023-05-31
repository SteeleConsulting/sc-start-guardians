import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class StartScreen extends Phaser.Scene {
  //   private gameOverSound!: Phaser.Sound.BaseSound;

  constructor() {
    super("startscreen");
  }

  init() {}

  preload() {}

  create() {
    const startBtn = this.add
      .text(600, 480, "Start Game", {
        fontSize: "60px",
        color: "white",
      })
      .setInteractive();

    startBtn.on(
      "pointerdown",
      function (pointer) {
        console.log("start game");
        this.scene.start("game");
      },
      this
    );
  }

  update() {}
}
