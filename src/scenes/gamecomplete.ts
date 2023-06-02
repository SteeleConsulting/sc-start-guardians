import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class GameComplete extends Phaser.Scene {
  private gameCompleteSound!: Phaser.Sound.BaseSound;
  private soundPlayed = false;

  constructor() {
    super("gamecomplete");
  }

  init() {}

  preload() {
    this.load.audio("gamecompletesound", ["assets/sounds/winning.mp3"]);
  }

  create() {
    events.on("game-complete", () => {
      this.gameCompleteSound = this.sound.add("gamecompletesound");
      if(!this.soundPlayed) {
        this.gameCompleteSound.play();
        this.soundPlayed = true;
      }
      this.add.text(500, 480, "Game Completed!", {
        fontSize: "80px",
        color: "white",
      });
      this.game.scene.remove("game");
      this.game.scene.remove("level2");
      this.game.scene.remove("level3");
    });
  }

  update() {}
}