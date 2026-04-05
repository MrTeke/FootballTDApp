import Phaser from 'phaser'
import Tower from '../objects/Tower.js'
import Grid from '../objects/Grid.js'
import WaveManager from '../systems/WaveManager.js'
import EconomyManager from '../systems/EconomyManager.js'
import EventBus from '../utils/EventBus.js'
import { LEVELS } from '../data/levels.js'
import { GRID, COLORS, GOAL_X, GOAL_Y, HUD_HEIGHT, PANEL_HEIGHT } from '../config.js'
import { Storage } from '../utils/Storage.js'
import '../systems/SoundManager.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  init(data) {
    this.levelNumber = data.level || 1
    this.bonusLives = data.bonusLives || 0
  }

  create() {
    this.enemies = []
    this.towers = []
    this.bullets = []
    this.selectedTowerType = null
    this.paused = false

    const levelData = LEVELS[this.levelNumber]

    this.grid = new Grid(this)

    // Apply ad-rewarded bonus money if any
    const adBonus = Storage.load('adBonus', 0)
    Storage.save('adBonus', 0)

    this.economy = new EconomyManager(this, levelData.startMoney + adBonus)
    this.lives = levelData.lives + this.bonusLives

    this.drawPitch()
    this.drawGoal()
    this.drawSpawnIndicators(levelData.spawnPoints)

    this.waveManager = new WaveManager(this, levelData)

    this.setupInput()
    this.setupEventBus()

    // Launch UI (parallel scene)
    this.scene.launch('UIScene', { levelNumber: this.levelNumber })

    this.cameras.main.fadeIn(300)

    // Notify UI of initial state
    this.time.delayedCall(100, () => {
      EventBus.emit('ECONOMY_CHANGED', this.economy.money)
      EventBus.emit('LIVES_CHANGED', this.lives)
      EventBus.emit('WAVE_CHANGED', { current: 0, total: this.waveManager.totalWaves })
      EventBus.emit('NEXT_WAVE_READY', { wave: 1, total: this.waveManager.totalWaves })
    })
  }

  drawPitch() {
    const g = this.add.graphics()
    g.setDepth(0)

    const playH = GRID.rows * GRID.cellSize   // 440
    const playY = GRID.offsetY                 // 60

    // Alternating green stripes
    for (let col = 0; col < GRID.cols; col++) {
      const color = col % 2 === 0 ? COLORS.pitch : COLORS.pitchAlt
      g.fillStyle(color)
      g.fillRect(col * GRID.cellSize, playY, GRID.cellSize, playH)
    }

    // Bottom panel area (below grid)
    g.fillStyle(0x0d0d22)
    g.fillRect(0, playY + playH, 480, PANEL_HEIGHT)

    // HUD area background
    g.fillStyle(0x090914)
    g.fillRect(0, 0, 480, HUD_HEIGHT)

    // Field lines (subtle grid)
    g.lineStyle(1, 0xffffff, 0.06)
    for (let col = 0; col <= GRID.cols; col++) {
      g.moveTo(col * GRID.cellSize, playY)
      g.lineTo(col * GRID.cellSize, playY + playH)
    }
    for (let row = 0; row <= GRID.rows; row++) {
      g.moveTo(0, playY + row * GRID.cellSize)
      g.lineTo(480, playY + row * GRID.cellSize)
    }
    g.strokePath()

    // Center circle
    g.lineStyle(1, 0xffffff, 0.2)
    g.strokeCircle(240, playY + playH / 2, 60)

    // Center line
    g.lineStyle(2, 0xffffff, 0.25)
    g.moveTo(0, playY + playH / 2)
    g.lineTo(480, playY + playH / 2)
    g.strokePath()

    // Penalty area (bottom)
    g.lineStyle(2, 0xffffff, 0.3)
    g.strokeRect(130, playY + playH - 100, 220, 90)

    // Goal area
    g.strokeRect(175, playY + playH - 40, 130, 30)

    // Field boundary
    g.lineStyle(2, 0xffffff, 0.4)
    g.strokeRect(0, playY, 480, playH)
  }

  drawGoal() {
    const g = this.add.graphics()
    g.setDepth(2)

    // Goal posts
    g.lineStyle(4, 0xffffff, 0.9)
    g.strokeRect(GOAL_X - 45, GOAL_Y - 10, 90, 25)

    // Net (hatching)
    g.lineStyle(1, 0xdddddd, 0.4)
    for (let i = 0; i <= 90; i += 10) {
      g.moveTo(GOAL_X - 45 + i, GOAL_Y - 10)
      g.lineTo(GOAL_X - 45 + i, GOAL_Y + 15)
    }
    for (let j = 0; j <= 25; j += 8) {
      g.moveTo(GOAL_X - 45, GOAL_Y - 10 + j)
      g.lineTo(GOAL_X + 45, GOAL_Y - 10 + j)
    }
    g.strokePath()

    // KALE label
    this.add.text(GOAL_X, GOAL_Y + 22, 'GOAL', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffffff88',
    }).setOrigin(0.5).setDepth(3)
  }

  drawSpawnIndicators(spawnPoints) {
    spawnPoints.forEach(sp => {
      const g = this.add.graphics().setDepth(3)
      g.fillStyle(0xff2222, 1)
      g.fillTriangle(
        sp.x, sp.y + 10,
        sp.x - 8, sp.y - 4,
        sp.x + 8, sp.y - 4
      )
      this.tweens.add({
        targets: g,
        alpha: 0.2,
        duration: 750,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      if (this.paused) return

      const px = pointer.x
      const py = pointer.y

      // Check if click is in playfield
      if (!this.grid.isPixelInGrid(px, py)) return

      // Deselect tower if clicking empty space
      this.towers.forEach(t => t.deselect())

      if (!this.selectedTowerType) return

      const { col, row } = this.grid.pixelToGrid(px, py)

      // Cannot place on top row (spawn zone) or last row (goal area)
      if (row === 0 || row >= GRID.rows - 1) {
        this.showWarning('Cannot place here!', px, py)
        return
      }

      if (!this.grid.isFree(col, row)) {
        this.showWarning('Occupied!', px, py)
        return
      }

      if (!this.economy.canAfford(this.selectedTowerType)) {
        this.showWarning('Not enough money!', px, py)
        return
      }

      this.placeTower(col, row, this.selectedTowerType)
    })
  }

  placeTower(col, row, type) {
    this.economy.spend(type)
    const tower = new Tower(this, col, row, type)
    this.towers.push(tower)
    this.grid.occupy(col, row)
    EventBus.emit('TOWER_PLACED')
    this.updateGridHighlight(this.selectedTowerType)

    // Flash feedback
    const pos = this.grid.getPixelPos(col, row)
    const flash = this.add.rectangle(pos.x, pos.y, GRID.cellSize, GRID.cellSize, 0xffffff, 0.4)
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    })
  }

  sellTower(tower) {
    const refund = Math.floor(tower.cost * 0.6)
    this.economy.add(refund)
    this.grid.free(tower.gridCol, tower.gridRow)
    this.towers = this.towers.filter(t => t !== tower)
    tower.destroy()
    this.showFloatingText(`+${refund}$`, tower.x, tower.y, '#ffdd00')
    this.updateGridHighlight(this.selectedTowerType)
  }

  updateGridHighlight(type) {
    if (!this._gridHighlight) {
      this._gridHighlight = this.add.graphics().setDepth(1)
    }
    this._gridHighlight.clear()
    if (!type) return

    this._gridHighlight.fillStyle(0x4488ff, 0.13)
    for (let row = 1; row < GRID.rows - 1; row++) {
      for (let col = 0; col < GRID.cols; col++) {
        if (this.grid.isFree(col, row)) {
          this._gridHighlight.fillRect(
            GRID.offsetX + col * GRID.cellSize,
            GRID.offsetY + row * GRID.cellSize,
            GRID.cellSize,
            GRID.cellSize
          )
        }
      }
    }
  }

  setupEventBus() {
    this._onTowerSelected = (type) => {
      this.selectedTowerType = type
      this.updateGridHighlight(type)
    }
    this._onWaveStart = () => { this.waveManager.startNextWave() }
    this._onTowerSell = (tower) => { this.sellTower(tower) }

    EventBus.on('TOWER_TYPE_SELECTED', this._onTowerSelected)
    EventBus.on('WAVE_START_REQUESTED', this._onWaveStart)
    EventBus.on('TOWER_SELL', this._onTowerSell)
  }

  onEnemyReachedGoal() {
    this.lives--
    EventBus.emit('LIVES_CHANGED', this.lives)
    EventBus.emit('GOAL_CONCEDED')

    // Screen shake
    this.cameras.main.shake(300, 0.012)

    // Red flash
    const flash = this.add.rectangle(240, 320, 480, 640, 0xff0000, 0.3).setDepth(50)
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy()
    })

    if (this.lives <= 0) {
      this.time.delayedCall(500, () => this.gameOver())
    }
  }

  onEnemyKilled(enemy) {
    this.economy.add(enemy.reward)
    this.showFloatingText(`+${enemy.reward}$`, enemy.x, enemy.y, '#44ff88')
    EventBus.emit('ENEMY_KILLED')
  }

  showFloatingText(text, x, y, color) {
    const t = this.add.text(x, y, text, {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      fill: color || '#ffffff',
    }).setOrigin(0.5).setDepth(30)

    this.tweens.add({
      targets: t,
      y: y - 30,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => t.destroy()
    })
  }

  showWarning(msg, x, y) {
    const t = this.add.text(x, y, msg, {
      fontSize: '8px',
      fontFamily: '"Press Start 2P"',
      fill: '#ff4444',
      backgroundColor: '#000000aa',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5).setDepth(30)

    this.tweens.add({
      targets: t,
      y: y - 25,
      alpha: 0,
      duration: 700,
      onComplete: () => t.destroy()
    })
  }

  update(time, delta) {
    if (this.paused) return

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update(time, delta)
    }

    this.towers.forEach(t => t.update(time, this.enemies))

    if (this.bullets) {
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        this.bullets[i].update(delta)
      }
    }

    this.waveManager.checkWaveComplete()
  }

  gameOver() {
    this.paused = true
    this.cameras.main.fadeOut(400)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      EventBus.clear()
      this.scene.stop('UIScene')
      this.scene.start('GameOverScene', { win: false, level: this.levelNumber, lives: this.lives })
    })
  }

  levelComplete() {
    const stars = this.calculateStars()
    EventBus.emit('LEVEL_COMPLETE')
    this.cameras.main.fadeOut(400)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      EventBus.clear()
      this.scene.stop('UIScene')
      this.scene.start('GameOverScene', { win: true, stars, level: this.levelNumber, lives: this.lives })
    })
  }

  calculateStars() {
    if (this.lives >= 5) return 3
    if (this.lives >= 3) return 2
    return 1
  }
}
