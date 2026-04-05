import { ENEMY_DATA } from '../data/enemies.js'
import { GOAL_X, GOAL_Y } from '../config.js'

export default class Enemy {
  constructor(scene, spawnX, spawnY, type, speedModifier) {
    this.scene = scene
    this.type = type
    this.alive = true

    const cfg = ENEMY_DATA[type]
    this.maxHp = cfg.hp
    this.hp = cfg.hp
    this.speed = cfg.speed * (speedModifier || 1)
    this.reward = cfg.reward
    this.color = cfg.color
    this.label = cfg.label

    this.x = spawnX
    this.y = spawnY

    this.targetX = GOAL_X
    this.targetY = GOAL_Y

    this.draw()
  }

  draw() {
    this.container = this.scene.add.container(this.x, this.y)
    this.container.setDepth(8)

    this.bodyGraphic = this.scene.add.graphics()
    this.drawBody()

    // HP bar background
    this.hpBarBg = this.scene.add.rectangle(0, -14, 20, 3, 0x333333)
    this.hpBarBg.setOrigin(0.5, 0.5)

    // HP bar fill
    this.hpBar = this.scene.add.rectangle(-10, -14, 20, 3, 0x00ff44)
    this.hpBar.setOrigin(0, 0.5)

    this.container.add([this.bodyGraphic, this.hpBarBg, this.hpBar])
  }

  drawBody() {
    const g = this.bodyGraphic
    g.clear()

    if (this.type === 'amateur') {
      this.drawAmateur(g)
    } else if (this.type === 'forward') {
      this.drawForward(g)
    } else if (this.type === 'striker') {
      this.drawStriker(g)
    }
  }

  drawAmateur(g) {
    // Small red player
    g.fillStyle(0x000000, 0.2)
    g.fillEllipse(1, 7, 12, 5)
    // Legs
    g.fillStyle(0xaa3333)
    g.fillRect(-3, 3, 3, 6)
    g.fillRect(1, 3, 3, 6)
    // Body
    g.fillStyle(0xff6666)
    g.fillRect(-4, -5, 9, 9)
    // Head
    g.fillStyle(0xffdab0)
    g.fillRect(-3, -11, 7, 7)
    // Ball
    g.fillStyle(0xffffff)
    g.fillCircle(6, 3, 3)
    g.fillStyle(0x333333, 0.6)
    g.fillCircle(7, 2, 1.5)
  }

  drawForward(g) {
    // Orange, leaning forward (faster look)
    g.fillStyle(0x000000, 0.2)
    g.fillEllipse(2, 8, 15, 5)
    // Legs (longer)
    g.fillStyle(0xaa5500)
    g.fillRect(-3, 4, 3, 7)
    g.fillRect(2, 4, 3, 7)
    // Lean
    g.fillStyle(0xff9900)
    g.fillRect(-5, -6, 11, 11)
    // Head
    g.fillStyle(0xffdab0)
    g.fillRect(-4, -13, 8, 8)
    // Ball
    g.fillStyle(0xffffff)
    g.fillCircle(7, 4, 3)
    g.fillStyle(0x000000, 0.5)
    g.fillCircle(8, 3, 1.5)
  }

  drawStriker(g) {
    // Large purple tank
    g.fillStyle(0x000000, 0.3)
    g.fillEllipse(2, 12, 22, 7)
    // Thick legs
    g.fillStyle(0x770077)
    g.fillRect(-5, 6, 5, 9)
    g.fillRect(2, 6, 5, 9)
    // Big body
    g.fillStyle(0xcc00cc)
    g.fillRect(-8, -7, 17, 14)
    // Visor strip on chest
    g.fillStyle(0xff44ff)
    g.fillRect(-6, -2, 13, 3)
    // Head (helmet-like)
    g.fillStyle(0x880088)
    g.fillRect(-6, -17, 13, 11)
    // Visor
    g.fillStyle(0x44ffff)
    g.fillRect(-5, -14, 11, 5)
    // Ball
    g.fillStyle(0xffffff)
    g.fillCircle(9, 5, 4)
    g.fillStyle(0x000000, 0.5)
    g.fillCircle(10, 4, 2)
  }

  update(time, delta) {
    if (!this.alive) return
    this.move(delta)
    this.updateHpBar()

    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY)
    if (dist < 20) {
      this.alive = false
      this.container.destroy()
      this.scene.enemies = this.scene.enemies.filter(e => e !== this)
      this.scene.onEnemyReachedGoal()
    }
  }

  move(delta) {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return

    const dt = delta / 1000
    const vx = (dx / dist) * this.speed * dt
    const vy = (dy / dist) * this.speed * dt

    const sep = this.calculateSeparation()

    this.x += vx + sep.x
    this.y += vy + sep.y
    this.container.setPosition(this.x, this.y)
  }

  calculateSeparation() {
    let sx = 0, sy = 0
    const enemies = this.scene.enemies
    for (let i = 0; i < enemies.length; i++) {
      const other = enemies[i]
      if (other === this || !other.alive) continue
      const dx = this.x - other.x
      const dy = this.y - other.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 22 && d > 0) {
        const force = (1 - d / 22) * 1.5
        sx += (dx / d) * force
        sy += (dy / d) * force
      }
    }
    return { x: sx, y: sy }
  }

  takeDamage(amount) {
    if (!this.alive) return
    this.hp -= amount
    if (this.hp <= 0) {
      this.alive = false
      this.container.destroy()
      this.scene.enemies = this.scene.enemies.filter(e => e !== this)
      this.scene.onEnemyKilled(this)
    }
  }

  updateHpBar() {
    const pct = this.hp / this.maxHp
    this.hpBar.width = 20 * pct
    if (pct > 0.6) {
      this.hpBar.fillColor = 0x00ff44
    } else if (pct > 0.3) {
      this.hpBar.fillColor = 0xffaa00
    } else {
      this.hpBar.fillColor = 0xff2200
    }
  }
}
