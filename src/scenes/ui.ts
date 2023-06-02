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
    this.load.image("level1", "UI/numeral1.png");
    this.load.image("level2", "UI/numeral2png");
    this.load.image("level3", "UI/numeral3.png");

    this.load.audio("shield", ["assets/sounds/shield.mp3"]);
  }

  create() {

    // add a text label to the screen
    this.powerupsLabel = this.add.text(10, 10, "PowerUps: ", {
      fontSize: "32px",
      color: "white",
    });

    this.levelsLabel = this.add.text(10, 50, "Level: ", {
      fontSize: "32px",
      color: "white",
    });

    this.scoreLabel = this.add.text(1400, 10, "Score: " + this.score, {
      fontSize: "32px",
      color: "white",
    });

    this.livesLabel = this.add.text(1400, 50, "Lives: " + this.lives, {
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

    //player gains a life
    events.on("life-gained", () => {
      this.lives++;
      this.livesLabel.text = "Lives: " + this.lives;
    });

    // reached to level up
    events.on("level-up", () => {
      this.level++;
      this.levelsLabel.text = "Level: ";
      this.scene.start("leveltitlescreen");
    });

    //  reaches boss level
    events.on("bosslevel-up", () => {
      console.log("Made it to the UI event");
      this.level++;
      this.levelsLabel.text = "Level: ";
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

    /**
     * display level asset according to level number
     */
    switch (this.level) {
      case 1:
        const level1Image = this.matter.add.sprite(
          150,
          68,
          "space",
          "UI/numeral1.png",
          {
            isStatic: true,
            isSensor: true,
          }
        );
        level1Image.setData("type", "level1");
        break;
      case 2:
        const level2Image = this.matter.add.sprite(
          150,
          65,
          "space",
          "UI/numeral2.png",
          {
            isStatic: true,
            isSensor: true,
          }
        );
        level2Image.setData("type", "level2");
        break;
      case 3:
        const level3Image = this.matter.add.sprite(
          150,
          65,
          "space",
          "UI/numeral3.png",
          {
            isStatic: true,
            isSensor: true,
          }
        );
        level3Image.setData("type", "level3");
        break;

      default:
        break;
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
