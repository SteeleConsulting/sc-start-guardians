import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class GameOver extends Phaser.Scene {
  private gameOverSound!: Phaser.Sound.BaseSound;

  constructor() {
    super("gameover");
  }

  init() {}

  preload() {
    this.load.audio("gameoversound", ["assets/sounds/gameover.mp3"]);
  }

  create() {
    events.on("gameover", () => {
      this.gameOverSound = this.sound.add("gameoversound");
      this.gameOverSound.play();
      this.add.text(600, 480, "Game Over", {
        fontSize: "80px",
        color: "red",
      });
      this.game.scene.remove("game");
    });

    this.gameOverSound = this.sound.add("gameoversound");
  }

  update() {}
}