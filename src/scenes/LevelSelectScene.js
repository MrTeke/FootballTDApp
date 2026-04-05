import Phaser from 'phaser'
import { LEVELS } from '../data/levels.js'
import { Storage } from '../utils/Storage.js'
import { COLORS } from '../config.js'

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene')
  }

  create() {
    const W = this.sys.game.config.width
    const H = this.sys.game.config.height

    this.cameras.main.fadeIn(300)

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0f1a)

    // Title
    this.add.text(W / 2, 30, 'SELECT LEVEL', {
      fontSize: '14px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffd700',
    }).setOrigin(0.5)

    this.drawGrid(W)
    this.addBackButton(W, H)
  }

  drawGrid(W) {
    const cols = 4
    const rows = 5
    const cellW = 90
    const cellH = 90
    const startX = (W - cols * cellW) / 2 + cellW / 2
    const startY = 80

    for (let i = 0; i < 20; i++) {
      const level = i + 1
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = startX + col * cellW
      const y = startY + row * cellH

      this.drawLevelCell(x, y, level)
    }
  }

  drawLevelCell(x, y, level) {
    const unlocked = Storage.isLevelUnlocked(level)
    const stars = Storage.getLevelStars(level)
    const levelData = LEVELS[level]

    const bg = this.add.rectangle(x, y, 80, 78, unlocked ? 0x1a2a3a : 0x111111)
      .setStrokeStyle(2, unlocked ? 0x4488ff : 0x333333)

    if (unlocked) {
      bg.setInteractive()
      bg.on('pointerover', () => bg.setFillStyle(0x224466))
      bg.on('pointerout', () => bg.setFillStyle(0x1a2a3a))
      bg.on('pointerdown', () => this.startLevel(level))
    }

    // Level number
    this.add.text(x, y - 22, `${level}`, {
      fontSize: '14px',
      fontFamily: '"Press Start 2P"',
      fill: unlocked ? '#ffffff' : '#444444',
    }).setOrigin(0.5)

    if (unlocked) {
      // Group name (short)
      const group = levelData.group.substring(0, 8)
      this.add.text(x, y - 5, group, {
        fontSize: '5px',
        fontFamily: '"Press Start 2P"',
        fill: '#8899aa',
      }).setOrigin(0.5)

      // Stars
      const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars)
      this.add.text(x, y + 14, starStr, {
        fontSize: '10px',
        fill: stars > 0 ? '#ffd700' : '#333333',
      }).setOrigin(0.5)
    } else {
      // Lock icon
      this.add.text(x, y, '🔒', { fontSize: '18px' }).setOrigin(0.5)
    }
  }

  startLevel(level) {
    this.scene.start('GameScene', { level })
    this.scene.launch('UIScene')
  }

  addBackButton(W, H) {
    const btn = this.add.rectangle(W / 2, H - 30, 160, 36, 0x333366)
      .setInteractive()
      .setStrokeStyle(1, 0x6666aa)

    this.add.text(W / 2, H - 30, '← BACK', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      fill: '#aaaacc',
    }).setOrigin(0.5)

    btn.on('pointerdown', () => this.scene.start('MenuScene'))
  }
}
