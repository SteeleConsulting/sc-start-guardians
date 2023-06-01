import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import level from "./ui";

export default class BossTitleScreen extends Phaser.Scene {
  private levelUpSound!: Phaser.Sound.BaseSound;
  
  constructor() {
    super("bosstitlescreen");
  }

  init() {}

  preload() {
    this.load.audio("levelup", ["assets/sounds/LevelUpSound.mp3"]);
  }

  create() {
    // this.levelUpSound = this.sound.add("levelup");
    // this.levelUpSound.play();

    console.log("Got to the boss title screen");
    this.add.text(600, 480, "Level 3", {
      fontSize: "60px",
      color: "white",
    });
    this.add.text(540, 920, "Boss level", {
        fontSize: "30px",
        color: "white",
      });

    setTimeout(() => {
        this.scene.start("level3");
        this.game.scene.remove("bosstitlescreen");
        this.game.scene.remove("level2");
    }, 1000);

  }

  update() {}
}