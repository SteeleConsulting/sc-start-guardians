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
  private lives: number = 4;

  //Gameover
  private gameFinished = false;

  constructor() {
    super("ui");
  }

  init() {}

  preload() {
    this.load.atlas(
      "space",
      "assets/space-shooter/space-shooter-tileset.png",
      "assets/space-shooter/space-shooter-tileset.json"
    );

    this.load.audio("shield", ["assets/sounds/shield.mp3"]);
  }

  create() {
    // add a text label to the screen
    this.powerupsLabel = this.add.text(10, 10, "PowerUps: ", {
      fontSize: "32px",
      color: "white",
    });

    this.levelsLabel = this.add.text(10, 50, "Level: " + this.level, {
      fontSize: "32px",
      color: "white",
    });

    this.scoreLabel = this.add.text(1350, 10, "Score: " + this.score, {
      fontSize: "32px",
      color: "white",
    });

    this.livesLabel = this.add.text(1350, 50, "Lives: " + this.lives, {
      fontSize: "32px",
      color: "white",
    });

    // listen to events from the game scene

    //player gains a power up
    events.on("powerup-collided", () => {
      this.powerupsCollected++;
      this.powerupsLabel.text = "PowerUps: ";
      this.speedPowerupsCollected++;
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
      }, 5000);
    });

    //player's power up expires
    events.on("powerup-expired", () => {
      this.powerupsCollected--;
      this.powerupsLabel.text = "PowerUps: ";
    });

    //player gains a shield
    events.on("shield-collided", () => {
      this.powerupsCollected++;
      this.powerupsLabel.text = "PowerUps: ";
      this.shieldPowerupsCollected++;
    });

    events.on("shield-expired", () => {
      this.powerupsCollected--;
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

    // player gains a life
    events.on("life-gained", () => {
      this.lives++;
      this.livesLabel.text = "Lives: " + this.lives;
    });

    // reached to level up
    events.on("level-up", () => {
      this.level = 2;
      this.shieldPowerupsCollected = 0;
      this.scene.start("leveltitlescreen");
    });

    //  reaches boss level
    events.on("bosslevel-up", () => {
      this.level = 3;
      this.scene.start("bosstitlescreen");
    });

    //laser power up badge
    events.on("laser-powerup", () => {
      const laserPowerup = this.matter.add.sprite(
        290,
        25,
        "space",
        "Power-ups/powerupGreen_star.png",
        {
          isStatic: true,
          isSensor: true,
        }
      );
      laserPowerup.setData("type", "laserPowerup");
      setTimeout(() => {
        laserPowerup.destroy();
      }, 5000);
    });
  }

  update() {
    if (this.lives <= 0 && !this.gameFinished) {
      events.emit("gameover");
      this.gameFinished = true;
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
      }, 100);
    }
  }
}
