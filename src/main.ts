import Phaser from "phaser";
import Game from "./scenes/game";
import UI from "./scenes/ui";
import GameOver from "./scenes/gameover";
import StartScreen from "./scenes/startscreen";
import Level2 from "./scenes/level2";
import Level3 from "./scenes/level3";
import LevelTitleScreen from "./scenes/leveltitlescreen";
import BossTitleScreen from "./scenes/bosstitlescreen";
import GameComplete from "./scenes/gamecomplete";


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1000,
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: {
        y: 0,
      },
    },
  },
  scene: [
    StartScreen,
    Game,
    Level2,
    Level3,
    UI,
    GameOver,
    LevelTitleScreen,
    BossTitleScreen,
    GameComplete
    
  ], // this is the list of scenes to be used in the game, only the first scene is auto launched
};

export default new Phaser.Game(config);
