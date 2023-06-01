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
    this.add.text(380, 480, "Guardians of the Galaxy", {
      fontSize: "60px",
      color: "white",
    });
    this.add.text(540, 920, "Press spacebar to start Game", {
      fontSize: "30px",
      color: "white",
    });
    this.input.keyboard.on("keydown-SPACE", this.startScene, this);
  }

  update() {}

  startScene() {
    this.scene.start("game");
  }
}
