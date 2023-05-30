import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";


export default class UI extends Phaser.Scene {
 private powerupsLabel!: Phaser.GameObjects.Text;
 private powerupsCollected: number = 0;
 private levelsLabel!: Phaser.GameObjects.Text;
 private levelUps: number = 0;
 private scoreLabel!: Phaser.GameObjects.Text;


 constructor() {
   super("ui");
 }


 init() {}


 preload() {}


 create() {
   // add a text label to the screen
   this.powerupsLabel = this.add.text(10, 10, "PowerUps: ", {
     fontSize: "32px",
     color: "yellow",
   });


   this.levelsLabel = this.add.text(10, 50, "Level: 1", {
     fontSize: "32px",
     color: "yellow",
   });


   this.scoreLabel = this.add.text(1400, 10, "Score: 0", {
     fontSize: "32px",
     color: "yellow",
   });


   // listen to events coming from the game scene
   events.on("powerup-collided", () => {
     this.powerupsCollected++;
     this.powerupsLabel.text = "PowerUps: " + this.powerupsCollected;
   });
 }


 update() {}
 
}