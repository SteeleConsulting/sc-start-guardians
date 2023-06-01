import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import level from "./ui";

export default class LevelTitleScreen extends Phaser.Scene {
  private levelUpSound!: Phaser.Sound.BaseSound;
  constructor() {
    super("leveltitlescreen");
  }

  init() {}

  preload() {
    this.load.audio("levelup", ["assets/sounds/LevelUpSound.mp3"]);
  }

  create() {
    this.levelUpSound = this.sound.add("levelup");
    this.levelUpSound.play();

    console.log("Got to the level title screen");
    this.add.text(600, 480, "Level 2", {
      fontSize: "60px",
      color: "white",
    });
    console.log("past it");
    setTimeout(() => {
      this.scene.start("level2");
      this.game.scene.remove("leveltitlescreen");
      this.game.scene.remove("game");
<<<<<<< HEAD
    }, 1000);
    this.game.scene.remove("game");
=======
    }, 2000);
>>>>>>> origin/roberto
  }

  update() {}
}
