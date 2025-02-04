import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter"; // this is the shared events emitter

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceship?: Phaser.Physics.Matter.Sprite;
  private upgraded: boolean = false;
  private laserPowerupActive = false;

  private speed = 3;
  private normalSpeed = 3;
  private turboSpeed = 10;
  private shootSpeed = -25;
  private scrollSpeed = -1;
  private powerUpSpeed = 15;

  private laserSound!: Phaser.Sound.BaseSound;
  private explosionSound!: Phaser.Sound.BaseSound;
  private backgroundMusic!: Phaser.Sound.BaseSound;
  private powerupSound!: Phaser.Sound.BaseSound;
  private MarioSound!: Phaser.Sound.BaseSound;
  private shieldBrokenSound!: Phaser.Sound.BaseSound;
  private speedPowerUpActive = false;
  private shieldPowerupActive = false;

  constructor() {
    super("game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys(); // setup keyboard input

    // load the other scenes
    this.scene.launch("ui");
    this.scene.launch("gameover");
  }

  preload() {
    this.load.image("star", "assets/star2.png");

    this.load.atlas(
      "explosion",
      "assets/explosion.png",
      "assets/explosion.json"
    );

    //this loads a whole tileset, check assets/space-shooter/space-shooter-tileset.json for individual image names
    this.load.atlas(
      "space",
      "assets/space-shooter/space-shooter-tileset.png",
      "assets/space-shooter/space-shooter-tileset.json"
    );

    // this file has the start locations of all objects in the game
    this.load.tilemapTiledJSON("spacemap", "assets/space-shooter-tilemap.json");

    this.load.audio("laser", ["assets/sounds/laser.wav"]);
    this.load.audio("explosion", ["assets/sounds/explosion.mp3"]);
    this.load.audio("powerup", ["assets/sounds/powerup.wav"]);
    this.load.audio("wifi", ["assets/sounds/mariowifi.mp3"]);
    this.load.audio("mario", ["assets/sounds/SuperMarioBros-Star.mp3"]);
    this.load.audio("shieldBroken", ["assets/sounds/cracked-shield.mp3"]);
  }

  create() {
    const { width, height } = this.scale; // width and height of the scene
    this.MarioSound = this.sound.add("mario");
    this.shieldBrokenSound = this.sound.add("shieldBroken");

    // Add random stars background
    var bg = this.add.group({ key: "star", frameQuantity: 3000 });

    var rect = new Phaser.Geom.Rectangle(0, 0, width, 6200);
    Phaser.Actions.RandomRectangle(bg.getChildren(), rect);

    this.createSpaceshipAnimations();
    this.createEnemyAnimations();

    // load tilemap with object locations
    const map = this.make.tilemap({ key: "spacemap" });
    const objectsLayer = map.getObjectLayer("objects");

    objectsLayer.objects.forEach((obj) => {
      const { x = 0, y = 0, name } = obj; // get the coordinates and name of the object from the tile map
      // console.log(
      //   "adding object from tilemap at x:" + x + " y:" + y + " name:" + name
      // );

      // find where the objects are in the tile map and add sprites accordingly by object name
      switch (name) {
        case "spawn":
          this.cameras.main.scrollY = y - 800; // set camera to spaceship Y coordinates
          this.spaceship = this.matter.add
            .sprite(x, y, "space")
            .play("spaceship-idle");

          // configure collision detection
          this.spaceship.setOnCollide((data: MatterJS.ICollisionPair) => {
            const spriteA = (data.bodyA as MatterJS.BodyType)
              .gameObject as Phaser.Physics.Matter.Sprite;
            const spriteB = (data.bodyB as MatterJS.BodyType)
              .gameObject as Phaser.Physics.Matter.Sprite;

            if (!spriteA?.getData || !spriteB?.getData) return;
            if (spriteA?.getData("type") == "speedup") {
              console.log("collided with speedup");
              this.powerupSound.play();
              this.MarioSound.play();
              events.emit("powerup-collided");
              spriteB.destroy();
              this.speedPowerUpActive = true;
              setTimeout(() => {
                this.speedPowerUpActive = false;
                events.emit("powerup-expired");
              }, 5000);
            }

            if (spriteB?.getData("type") == "speedup") {
              events.emit("powerup-collided");
              this.powerupSound.play();
              this.MarioSound.play();
              spriteB.destroy();
              this.speedPowerUpActive = true;
              setTimeout(() => {
                this.speedPowerUpActive = false;
                events.emit("powerup-expired");
                console.log("speedup expired");
              }, 5000);
            }
            //shield
            if (spriteB?.getData("type") == "shield") {
              events.emit("shield-collided");
              this.shieldBrokenSound.play();
              spriteB.destroy();
              this.createShield(spriteA.x, spriteA.y);
              this.shieldPowerupActive = true;
            }
            if (
              spriteB?.getData("type") == "meteor" &&
              this.shieldPowerupActive == false
            ) {
              spriteB.destroy();
              events.emit("life-lost");
            }
            if (spriteB?.getData("type") == "helper") {
              console.log("Collided with laser powerup");
              events.emit("laser-powerup");
              this.laserPowerupActive = true;
              spriteB.destroy();

              setTimeout(() => {
                this.laserPowerupActive = false;
                console.log("laser powerup expired");
              }, 5000);
            }
          });
          break;
        case "speedup":
          const speedup = this.matter.add.sprite(
            x,
            y,
            "space",
            "Power-ups/bolt_gold.png",
            {
              isStatic: true,
              isSensor: true,
            }
          );
          speedup.setBounce(1);
          speedup.setData("type", "speedup");
          break;

        case "powerup":
          const powerup = this.matter.add.sprite(
            x,
            y,
            "space",
            "Power-ups/powerupBlue_shield.png",
            {
              isStatic: true,
              isSensor: true,
            }
          );
          powerup.setBounce(1);
          powerup.setData("type", "shield");

          const helperPowerup = this.matter.add.sprite(
            x + Math.floor(Math.random() * 701),
            y,
            "space",
            "Power-ups/powerupGreen_star.png",
            {
              isStatic: true,
              isSensor: true,
            }
          );
          helperPowerup.setBounce(1);
          helperPowerup.setData("type", "helper");
          break;

        case "asteroid":
          const meteor = this.matter.add.sprite(
            x + Math.floor(Math.random() * 701),
            y,
            "space",
            "Meteors/meteorBrown_big1.png",
            {
              isStatic: true,
              isSensor: true,
            }
          );

          meteor.setBounce(1);
          meteor.setData("type", "meteor");
          break;
      }
    });

    // Sounds are loaded into memory here
    this.powerupSound = this.sound.add("powerup");
    this.explosionSound = this.sound.add("explosion");
    this.laserSound = this.sound.add("laser");
    this.backgroundMusic = this.sound.add("wifi");

    this.backgroundMusic.play();
  }

  update() {
    if (!this.spaceship?.active)
      // This checks if the spaceship has been created yet
      return;

    const beam = this.matter.add.sprite(
      this.spaceship.x,
      this.spaceship.y + 50,
      "space",
      "Effects/fire08.png",
      {
        isStatic: true,
        isSensor: true,
      }
    );
    beam.flipY = false;
    setTimeout(() => {
      beam.destroy();
    }, 100);

    // move camera up
    this.cameras.main.scrollY -= this.normalSpeed;
    this.spaceship.setVelocityY(-this.normalSpeed);
    if (this.cameras.main.scrollY < 0) {
      // this.scene.start("level2");
      this.backgroundMusic.pause();
      events.emit("level-up");
    }

    // handle keyboard input
    if (this.cursors.left.isDown) {
      this.speedPowerUpActive == true
        ? this.spaceship.setVelocityX(-this.powerUpSpeed)
        : this.spaceship.setVelocityX(-this.speed);

      if (this.spaceship.x < 50) this.spaceship.setX(50); // left boundary
      this.spaceship.flipX = false;
    } else if (this.cursors.right.isDown) {
      this.speedPowerUpActive == true
        ? this.spaceship.setVelocityX(this.powerUpSpeed)
        : this.spaceship.setVelocityX(this.speed);
      if (this.spaceship.x > 1550) this.spaceship.setX(1550); // right boundary
      this.spaceship.flipX = false;
    } else {
      this.spaceship.setVelocityX(0);
    }

    if (this.cursors.down.isDown) {
      this.speedPowerUpActive == true
        ? this.spaceship.setVelocityY(this.powerUpSpeed)
        : this.spaceship.setVelocityY(this.speed);
      this.spaceship.flipY = false;
    } else if (this.cursors.up.isDown) {
      this.speedPowerUpActive == true
        ? this.spaceship.setVelocityY(-this.powerUpSpeed)
        : this.spaceship.setVelocityY(-this.speed - 5);
      this.spaceship.flipY = false;
    }

    const shiftJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.shift); // this is to make sure it only happens once per key press
    if (this.cursors.shift.isDown && shiftJustPressed) {
      // shoot laser
      this.createLaser(
        this.spaceship.x,
        this.spaceship.y - 50,
        0,
        this.shootSpeed,
        0
      );

      this.sound.play("laser");
    }
  }
  spawnHelpers() {
    var helper = this.matter.add.sprite(
      this.spaceship!.x + 80,
      this.spaceship!.y,
      "space",
      "UI/playerLife3_red.png",
      {
        isSensor: true,
      }
    );
    this.upgraded;
    helper.setData("type", "helper");
  }

  createShield(x, y) {
    const shield = this.matter.add.sprite(
      x,
      y,
      "space",
      "Effects/shield1.png",
      {
        isSensor: true,
      }
    );
    shield.setBounce(1);
    shield.setData("type", "shield");
    shield.setOnCollide((data: MatterJS.ICollisionPair) => {
      const spriteA = (data.bodyA as MatterJS.BodyType)
        .gameObject as Phaser.Physics.Matter.Sprite;
      const spriteB = (data.bodyB as MatterJS.BodyType)
        .gameObject as Phaser.Physics.Matter.Sprite;

      if (!spriteA?.getData || !spriteB?.getData) return;

      if (spriteA?.getData("type") == "meteor") {
        console.log("shield collided with enemy");
        spriteA.destroy();
        spriteB.destroy();
        this.explosionSound.play();
        events.emit("shield-expired");
        events.emit("asteroid-destroyed");
        this.shieldPowerupActive = false;
      }
    });
  }

  // create a laser sprite
  createLaser(
    x: number,
    y: number,
    xSpeed: number,
    ySpeed: number,
    radians: number = 0
  ) {
    if (this.laserPowerupActive == false) {
      var laser = this.matter.add.sprite(
        x,
        y,
        "space",
        "Lasers/laserRed01.png",
        { isSensor: true }
      );
      laser.setVelocityY(ySpeed);
      this.upgraded;
      laser.setData("type", "laser");
      laser.setOnCollide((data: MatterJS.ICollisionPair) => {
        const spriteA = (data.bodyA as MatterJS.BodyType)
          .gameObject as Phaser.Physics.Matter.Sprite;
        const spriteB = (data.bodyB as MatterJS.BodyType)
          .gameObject as Phaser.Physics.Matter.Sprite;

        if (!spriteA?.getData || !spriteB?.getData) return;

        if (spriteA?.getData("type") == "meteor") {
          console.log("laser collided with enemy");
          spriteA.destroy();
          spriteB.destroy();

          this.explosionSound.play();
          events.emit("asteroid-destroyed");
        }
      });
      setTimeout(() => {
        laser.destroy();
      }, 1000);
    } else {
      var laser = this.matter.add.sprite(
        x - 10,
        y,
        "space",
        "Lasers/laserGreen08.png",
        { isSensor: true }
      );
      laser.setVelocityY(ySpeed);
      this.upgraded;
      laser.setData("type", "laser");
      laser.setOnCollide((data: MatterJS.ICollisionPair) => {
        const spriteA = (data.bodyA as MatterJS.BodyType)
          .gameObject as Phaser.Physics.Matter.Sprite;
        const spriteB = (data.bodyB as MatterJS.BodyType)
          .gameObject as Phaser.Physics.Matter.Sprite;

        if (!spriteA?.getData || !spriteB?.getData) return;

        if (spriteA?.getData("type") == "meteor") {
          console.log("laser collided with enemy");
          spriteA.destroy();

          this.explosionSound.play();
          events.emit("asteroid-destroyed");
        }
      });

      // destroy laser object after 500ms, otherwise lasers stay in memory and slow down the game
      setTimeout(() => laser.destroy(), 3000);

      var laser2 = this.matter.add.sprite(
        x + 10,
        y,
        "space",
        "Lasers/laserGreen08.png",
        { isSensor: true }
      );
      laser2.setVelocityY(ySpeed);
      this.upgraded;
      laser2.setData("type", "laser");
      laser2.setOnCollide((data: MatterJS.ICollisionPair) => {
        const spriteA = (data.bodyA as MatterJS.BodyType)
          .gameObject as Phaser.Physics.Matter.Sprite;
        const spriteB = (data.bodyB as MatterJS.BodyType)
          .gameObject as Phaser.Physics.Matter.Sprite;

        if (!spriteA?.getData || !spriteB?.getData) return;

        if (spriteA?.getData("type") == "meteor") {
          console.log("laser collided with enemy");
          spriteA.destroy();

          this.explosionSound.play();
          events.emit("asteroid-destroyed");
        }
      });

      // destroy laser object after 500ms, otherwise lasers stay in memory and slow down the game
      setTimeout(() => laser2.destroy(), 3000);
    }
  }

  private createSpaceshipAnimations() {
    this.anims.create({
      key: "spaceship-idle",
      frames: [{ key: "space", frame: "playerShip1_blue.png" }],
    });
    this.anims.create({
      key: "spaceship-explode",
      frameRate: 30,
      frames: this.anims.generateFrameNames("explosion", {
        start: 1,
        end: 16,
        prefix: "explosion",
        suffix: ".png",
      }),
      repeat: 1,
    });
  }

  private createEnemyAnimations() {
    this.anims.create({
      key: "enemy-idle",
      frames: [{ key: "space", frame: "Enemies/enemyBlack1.png" }],
    });

    this.anims.create({
      key: "enemy-explode",
      frameRate: 15,
      frames: this.anims.generateFrameNames("explosion", {
        start: 1,
        end: 16,
        prefix: "explosion",
        suffix: ".png",
      }),
      repeat: 1,
    });

    this.anims.create({
      key: "asteroid-explode",
      frameRate: 15,
      frames: this.anims.generateFrameNames("explosion", {
        start: 1,
        end: 16,
        prefix: "explosion",
        suffix: ".png",
      }),
      repeat: 1,
    });
  }
}
