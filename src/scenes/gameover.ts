import Phaser from "phaser";
import { sharedInstance as events } from "../helpers/eventCenter";

export default class GameOver extends Phaser.Scene {
    private gameOverSound!: Phaser.Sound.BaseSound;

    constructor() {
        super('gameover');
    }

    init() {
    }

    preload(){
        this.load.audio("gameover", ["assets/sounds/gameover.mp3"]);
    }

    create(){
        this.gameOverSound = this.sound.add("gameover");

        events.on('gameover', () => {
            this.add.text(600, 480, 'Game Over!', {
                fontSize: '80px', color: 'white'
            });
            this.gameOverSound.play()
        });
    }

    update() {

    }
}