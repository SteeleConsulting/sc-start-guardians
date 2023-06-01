import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class StartScreen extends Phaser.Scene {
  private titleScreenMusic!: Phaser.Sound.BaseSound

  constructor() {
    super("startscreen");
  }

  init() {}

  preload() {
    this.load.audio("neon", ["assets/sounds/neon-sky.mp3"])
  }

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

    //loading music here
    this.titleScreenMusic = this.sound.add("neon")
    this.titleScreenMusic.play()
  }

  update() {}

  startScene() {
    this.scene.start("game");
    this.sound.stopByKey("neon");
    this.scene.remove();
  }
}
