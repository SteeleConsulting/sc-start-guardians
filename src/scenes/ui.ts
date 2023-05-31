import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class UI extends Phaser.Scene {
  //PowerUps
  private powerupsLabel!: Phaser.GameObjects.Text;
  private powerupsCollected: number = 0;
  private speedPowerupsCollected: number = 0;
  private shieldPowerupsCollected: number = 0;

  //Levels
  private levelsLabel!: Phaser.GameObjects.Text;
  private level: number = 1;

  //Score
  private scoreLabel!: Phaser.GameObjects.Text;
  private score: number = 0;

  //Lives
  private livesLabel!: Phaser.GameObjects.Text;
  private lives: number = 3;

  //Gameover
  private gameFinished = false;

  constructor() {
    super("ui");
  }

  init() {}

  preload() {}

  create() {
    // add a text label to the screen
    this.powerupsLabel = this.add.text(10, 10, "PowerUps: ", {
      fontSize: "32px",
      color: "white",
    });

    this.levelsLabel = this.add.text(10, 50, "Level: 1", {
      fontSize: "32px",
      color: "white",
    });

    this.scoreLabel = this.add.text(1400, 10, "Score: 0", {
      fontSize: "32px",
      color: "white",
    });

    this.livesLabel = this.add.text(1400, 50, "Lives: 3", {
      fontSize: "32px",
      color: "white",
    });

    // listen to events from the game scene

    //player gains a power up
    events.on("powerup-collided", () => {
      this.powerupsCollected++;
      //  this.powerupsLabel.text = "PowerUps: " + this.powerupsCollected;
      this.powerupsLabel.text = "PowerUps: ";
      this.speedPowerupsCollected++;
    });

    //player's power up expires
    events.on("powerup-expired", () => {
      this.powerupsCollected--;
      this.powerupsLabel.text = "PowerUps: " + this.powerupsCollected;
    });

    //player gains a shield
    events.on("shield-collided", () => {
      this.powerupsCollected++;
      //  this.powerupsLabel.text = "PowerUps: " + this.powerupsCollected;
      this.powerupsLabel.text = "PowerUps: ";
      this.shieldPowerupsCollected++;
    });

    events.on("shield-expired", () => {
      this.powerupsCollected--;
      //  this.powerupsLabel.text = "PowerUps: " + this.powerupsCollected;
      this.shieldPowerupsCollected--;
    });

    //player kills an enemy; gets 10 points
    events.on("enemy-killed", () => {
      this.score += 10;
      this.scoreLabel.text = "Score: " + this.score;
    });

    //player destroys an asteroid; gets 5 points
    events.on("asteroid-destroyed", () => {
      this.score += 5;
      this.scoreLabel.text = "Score: " + this.score;
    });

    //player loses a life
    events.on("life-lost", () => {
      this.lives--;
      this.livesLabel.text = "Lives: " + this.lives;
    });

    //player gains a life
    events.on("life-gained", () => {
      this.lives++;
      this.livesLabel.text = "Lives: " + this.lives;
    });

    //score threshold reached to level up
    events.on("level-up", () => {
      this.level++;
      this.levelsLabel.text = "Level: " + this.level;
    });
  }

  update() {
    if (this.lives == 0 && !this.gameFinished) {
      events.emit("gameover");
      this.gameFinished = true;
    }

    if (this.speedPowerupsCollected > 0) {
      const speedPowerup = this.matter.add.sprite(
        210,
        25,
        "space",
        "Power-ups/powerupYellow_bolt.png",
        {
          isStatic: true,
          isSensor: true,
        }
      );
      speedPowerup.setData("type", "speedPowerup");

      setTimeout(() => {
        speedPowerup.destroy();
        this.speedPowerupsCollected--;
      }, 2000);
    }

    if (this.shieldPowerupsCollected > 0) {
      const shieldPowerup = this.matter.add.sprite(
        250,
        25,
        "space",
        "Power-ups/powerupBlue_shield.png",
        {
          isStatic: true,
          isSensor: true,
        }
      );
      shieldPowerup.setData("type", "shieldPowerup");

      setTimeout(() => {
        shieldPowerup.destroy();
        this.shieldPowerupsCollected--;
      }, 1000);
    }
  }
}
