import Phaser from 'phaser'
import { COLORS } from '../config.js'
import { Storage } from '../utils/Storage.js'
import EventBus from '../utils/EventBus.js'

// Global sound state
export let soundEnabled = Storage.load('soundEnabled', true)

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const W = this.sys.game.config.width
    const H = this.sys.game.config.height

    this.cameras.main.fadeIn(350)

    this.drawBackground(W, H)
    this.drawPitchDecor(W, H)
    this.addTitle(W)
    this.addAnimatedBall(W, H)
    this.addButtons(W, H)
    this.addBestScore(W, H)
    this.addSoundButton(W)
  }

  drawBackground(W, H) {
    // Dark background
    this.add.rectangle(W / 2, H / 2, W, H, 0x0a0f1a)

    // Pitch area
    const g = this.add.graphics()
    g.fillStyle(COLORS.pitch)
    g.fillRect(0, 120, W, H - 200)

    // Alternating stripes
    g.fillStyle(COLORS.pitchAlt, 0.5)
    for (let i = 0; i < 6; i++) {
      g.fillRect(i * 80, 120, 40, H - 200)
    }

    // Field lines
    g.lineStyle(2, 0xffffff, 0.3)
    g.strokeRect(30, 150, W - 60, H - 290)
    // Center line
    g.strokeRect(30, H / 2 - 1, W - 60, 2)
    // Center circle
    g.strokeCircle(W / 2, H / 2, 50)
  }

  drawPitchDecor(W, H) {
    // Goal at bottom
    const g = this.add.graphics()
    g.lineStyle(3, 0xffffff, 0.6)
    g.strokeRect(W / 2 - 50, H - 120, 100, 30)
  }

  addTitle(W) {
    // Shadow
    this.add.text(W / 2 + 2, 52, 'CLEAN SHEET', {
      fontSize: '22px',
      fontFamily: '"Press Start 2P"',
      fill: '#000000',
      align: 'center',
    }).setOrigin(0.5)

    // Main title
    this.add.text(W / 2, 50, 'CLEAN SHEET', {
      fontSize: '22px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffd700',
      align: 'center',
    }).setOrigin(0.5)

    // Subtitle
    this.add.text(W / 2, 98, 'TOWER DEFENSE', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      fill: '#88aaff',
    }).setOrigin(0.5)
  }

  addAnimatedBall(W, H) {
    // Draw a football
    this.ball = this.add.graphics()
    this.ballX = W / 2
    this.ballY = H / 2 - 30
    this.ballVX = 60
    this.ballVY = 45
    this.drawBall()

    // Animate on update
    this.ballTime = 0
  }

  drawBall() {
    const g = this.ball
    g.clear()
    g.fillStyle(0xffffff)
    g.fillCircle(this.ballX, this.ballY, 14)
    g.fillStyle(0x222222)
    // Pentagon pattern
    g.fillCircle(this.ballX, this.ballY - 8, 4)
    g.fillCircle(this.ballX - 7, this.ballY + 4, 4)
    g.fillCircle(this.ballX + 7, this.ballY + 4, 4)
    // Shine
    g.fillStyle(0xffffff, 0.6)
    g.fillCircle(this.ballX + 4, this.ballY - 6, 3)
  }

  addButtons(W, H) {
    // PLAY button
    const playBtn = this.createButton(W / 2, H - 180, 'PLAY', 0x22aa44)
    playBtn.on('pointerdown', () => {
      this.scene.start('LevelSelectScene')
    })

    // Continue (if have progress)
    const highestUnlocked = Storage.getHighestUnlockedLevel()
    if (highestUnlocked > 1) {
      const continueBtn = this.createButton(W / 2, H - 130, `CONTINUE (LVL ${highestUnlocked})`, 0x2244aa)
      continueBtn.on('pointerdown', () => {
        this.scene.start('GameScene', { level: highestUnlocked })
        this.scene.launch('UIScene')
      })
    }
  }

  createButton(x, y, label, color) {
    const btn = this.add.rectangle(x, y, 220, 40, color)
      .setInteractive()
      .setStrokeStyle(2, 0xffffff)

    this.add.text(x, y, label, {
      fontSize: '10px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffffff',
    }).setOrigin(0.5)

    btn.on('pointerover', () => btn.setFillStyle(Phaser.Display.Color.ValueToColor(color).lighten(20).color))
    btn.on('pointerout', () => btn.setFillStyle(color))

    return btn
  }

  addBestScore(W, H) {
    const stars = Storage.load('stars', {})
    const total = Object.values(stars).reduce((a, b) => a + b, 0)
    if (total > 0) {
      this.add.text(W / 2, H - 55, `★ TOTAL: ${total}`, {
        fontSize: '9px',
        fontFamily: '"Press Start 2P"',
        fill: '#ffd700',
      }).setOrigin(0.5)
    }

    this.add.text(W / 2, H - 25, 'v1.0', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      fill: '#444466',
    }).setOrigin(0.5)
  }

  addSoundButton(W) {
    const label = () => soundEnabled ? '🔊' : '🔇'
    const btn = this.add.text(W - 20, 20, label(), {
      fontSize: '20px',
    }).setOrigin(1, 0.5).setInteractive()

    btn.on('pointerdown', () => {
      soundEnabled = !soundEnabled
      Storage.save('soundEnabled', soundEnabled)
      btn.setText(label())
      EventBus.emit('SOUND_TOGGLE', soundEnabled)
    })

    btn.on('pointerover', () => btn.setAlpha(0.7))
    btn.on('pointerout', () => btn.setAlpha(1))
  }

  update(time, delta) {
    // Bounce ball
    const dt = delta / 1000
    this.ballX += this.ballVX * dt
    this.ballY += this.ballVY * dt

    const W = this.sys.game.config.width
    const H = this.sys.game.config.height
    if (this.ballX < 20 || this.ballX > W - 20) this.ballVX *= -1
    if (this.ballY < 130 || this.ballY > H - 150) this.ballVY *= -1

    this.drawBall()
  }
}
