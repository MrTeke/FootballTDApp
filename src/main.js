import Phaser from 'phaser'
import { GAME_CONFIG } from './config.js'
import BootScene from './scenes/BootScene.js'
import MenuScene from './scenes/MenuScene.js'
import LevelSelectScene from './scenes/LevelSelectScene.js'
import GameScene from './scenes/GameScene.js'
import UIScene from './scenes/UIScene.js'
import GameOverScene from './scenes/GameOverScene.js'

const config = {
  ...GAME_CONFIG,
  scene: [BootScene, MenuScene, LevelSelectScene, GameScene, UIScene, GameOverScene]
}

new Phaser.Game(config)
