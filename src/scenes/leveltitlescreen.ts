import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";
import level from "./ui";

export default class LevelTitleScreen extends Phaser.Scene {
  constructor() {
    super("leveltitlescreen");
  }

  init() {}

  preload() {}

  create() {
    console.log("Got to the level title screen");
    this.add.text(600, 480, "Level 2", {
      fontSize: "60px",
      color: "white",
    });
    console.log("past it");
    setTimeout(() => {
      this.scene.start("level2");
    }, 1000);
  }

  update() {}
}
