import { TOWER_DATA } from '../data/towers.js'
import { GRID, GOAL_X, GOAL_Y } from '../config.js'
import Bullet from './Bullet.js'
import EventBus from '../utils/EventBus.js'

export default class Tower {
  constructor(scene, gridCol, gridRow, type) {
    this.scene = scene
    this.gridCol = gridCol
    this.gridRow = gridRow
    this.type = type
    this.selected = false

    const cfg = TOWER_DATA[type]
    this.range = cfg.range
    this.damage = cfg.damage
    this.fireRate = cfg.fireRate
    this.cost = cfg.cost
    this.color = cfg.color
    this.projectileSpeed = cfg.projectileSpeed
    this.lastFired = 0

    // Pixel center
    this.x = GRID.offsetX + gridCol * GRID.cellSize + GRID.cellSize / 2
    this.y = GRID.offsetY + gridRow * GRID.cellSize + GRID.cellSize / 2

    this.graphics = scene.add.graphics()
    this.graphics.setDepth(5)

    this.rangeGraphic = scene.add.graphics()
    this.rangeGraphic.setDepth(1)
    this.rangeGraphic.setAlpha(0)

    this.sellButton = null
    this.draw()
    this.setupInteraction()
  }

  draw() {
    const g = this.graphics
    g.clear()

    const x = this.x
    const y = this.y

    if (this.type === 'bek') {
      this.drawBek(g, x, y)
    } else if (this.type === 'stoper') {
      this.drawStoper(g, x, y)
    } else if (this.type === 'kaleci') {
      this.drawKaleci(g, x, y)
    }

    // Selection ring
    if (this.selected) {
      g.lineStyle(2, 0xffffff, 1)
      g.strokeCircle(x, y, 18)
    }
  }

  drawBek(g, x, y) {
    // Shadow
    g.fillStyle(0x000000, 0.3)
    g.fillEllipse(x + 2, y + 10, 18, 6)
    // Legs
    g.fillStyle(0x2244aa)
    g.fillRect(x - 4, y + 4, 4, 8)
    g.fillRect(x + 1, y + 4, 4, 8)
    // Body (jersey)
    g.fillStyle(0x4488ff)
    g.fillRect(x - 6, y - 5, 13, 11)
    // Arms
    g.fillRect(x + 6, y - 4, 4, 7)
    g.fillRect(x - 9, y - 4, 4, 7)
    // Head
    g.fillStyle(0xffdab0)
    g.fillRect(x - 4, y - 13, 9, 9)
    // Hair
    g.fillStyle(0x553311)
    g.fillRect(x - 4, y - 15, 9, 4)
    // Jersey number dot
    g.fillStyle(0xffffff)
    g.fillRect(x - 1, y - 1, 3, 3)
  }

  drawStoper(g, x, y) {
    // Shadow
    g.fillStyle(0x000000, 0.3)
    g.fillEllipse(x + 2, y + 12, 22, 8)
    // Legs
    g.fillStyle(0xaa4400)
    g.fillRect(x - 5, y + 6, 5, 9)
    g.fillRect(x + 1, y + 6, 5, 9)
    // Body (bigger)
    g.fillStyle(0xff8800)
    g.fillRect(x - 7, y - 6, 15, 13)
    // Arms
    g.fillRect(x + 7, y - 5, 5, 8)
    g.fillRect(x - 11, y - 5, 5, 8)
    // Head
    g.fillStyle(0xffdab0)
    g.fillRect(x - 5, y - 16, 11, 11)
    // Hair
    g.fillStyle(0x222222)
    g.fillRect(x - 5, y - 18, 11, 4)
    // Jersey number
    g.fillStyle(0xffffff)
    g.fillRect(x - 2, y - 1, 4, 4)
  }

  drawKaleci(g, x, y) {
    // Shadow
    g.fillStyle(0x000000, 0.3)
    g.fillEllipse(x + 2, y + 14, 26, 8)
    // Legs
    g.fillStyle(0xaa9900)
    g.fillRect(x - 6, y + 7, 6, 10)
    g.fillRect(x + 1, y + 7, 6, 10)
    // Body (largest)
    g.fillStyle(0xffdd00)
    g.fillRect(x - 8, y - 7, 17, 15)
    // Arms with gloves
    g.fillRect(x + 8, y - 6, 6, 9)
    g.fillRect(x - 13, y - 6, 6, 9)
    // Gloves
    g.fillStyle(0xee4400)
    g.fillRect(x + 13, y - 5, 5, 7)
    g.fillRect(x - 17, y - 5, 5, 7)
    // Head (bigger)
    g.fillStyle(0xffdab0)
    g.fillRect(x - 6, y - 19, 13, 13)
    // Hair
    g.fillStyle(0xffaa00)
    g.fillRect(x - 6, y - 21, 13, 4)
    // Jersey number
    g.fillStyle(0x000000)
    g.fillRect(x - 2, y - 2, 5, 5)
  }

  drawRangeCircle() {
    const g = this.rangeGraphic
    g.clear()
    g.lineStyle(1, this.color, 0.4)
    g.strokeCircle(this.x, this.y, this.range)
    g.fillStyle(this.color, 0.05)
    g.fillCircle(this.x, this.y, this.range)
  }

  setupInteraction() {
    // Invisible hit area
    this.hitArea = this.scene.add.rectangle(
      this.x, this.y, GRID.cellSize - 2, GRID.cellSize - 2, 0x000000, 0
    ).setInteractive()
    this.hitArea.setDepth(6)

    this.hitArea.on('pointerdown', (pointer) => {
      pointer.event.stopPropagation()
      this.toggleSelect()
    })
  }

  toggleSelect() {
    if (this.selected) {
      this.deselect()
    } else {
      // Deselect any other tower
      this.scene.towers.forEach(t => { if (t !== this) t.deselect() })
      this.select()
    }
  }

  select() {
    this.selected = true
    this.draw()
    this.drawRangeCircle()
    this.rangeGraphic.setAlpha(1)
    this.showSellButton()
    EventBus.emit('TOWER_SELECTED_FOR_INFO', { tower: this })
  }

  deselect() {
    this.selected = false
    this.draw()
    this.rangeGraphic.setAlpha(0)
    this.hideSellButton()
    EventBus.emit('TOWER_DESELECTED', null)
  }

  showSellButton() {
    this.hideSellButton()
    const sellPrice = Math.floor(this.cost * 0.6)
    this.sellButton = this.scene.add.text(
      this.x, this.y - 28,
      `SELL ${sellPrice}$`,
      { fontSize: '9px', fontFamily: '"Press Start 2P"', fill: '#ffdd00', backgroundColor: '#000000aa', padding: { x: 4, y: 2 } }
    ).setOrigin(0.5).setDepth(20).setInteractive()

    this.sellButton.on('pointerdown', (pointer) => {
      pointer.event.stopPropagation()
      EventBus.emit('TOWER_SELL', this)
    })
  }

  hideSellButton() {
    if (this.sellButton) {
      this.sellButton.destroy()
      this.sellButton = null
    }
  }

  update(time, enemies) {
    if (time - this.lastFired < this.fireRate) return
    const target = this.findTarget(enemies)
    if (target) {
      this.fire(target)
      this.lastFired = time
    }
  }

  findTarget(enemies) {
    const inRange = enemies.filter(e =>
      e.alive &&
      Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y) < this.range
    )
    if (inRange.length === 0) return null

    // "First" targeting — closest to goal
    return inRange.sort((a, b) => {
      const da = Phaser.Math.Distance.Between(a.x, a.y, GOAL_X, GOAL_Y)
      const db = Phaser.Math.Distance.Between(b.x, b.y, GOAL_X, GOAL_Y)
      return da - db
    })[0]
  }

  fire(target) {
    new Bullet(this.scene, this.x, this.y, target, this.damage, this.projectileSpeed)
    EventBus.emit('SHOOT')
  }

  destroy() {
    this.hideSellButton()
    this.graphics.destroy()
    this.rangeGraphic.destroy()
    if (this.hitArea) this.hitArea.destroy()
  }
}
