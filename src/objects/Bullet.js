export default class Bullet {
  constructor(scene, fromX, fromY, target, damage, speed) {
    this.scene = scene
    this.target = target
    this.damage = damage
    this.speed = speed || 250
    this.alive = true
    this.x = fromX
    this.y = fromY

    this.graphic = scene.add.graphics()
    this.graphic.fillStyle(0xffffff, 1)
    this.graphic.fillCircle(0, 0, 3)
    this.graphic.setPosition(fromX, fromY)
    this.graphic.setDepth(10)

    if (!scene.bullets) scene.bullets = []
    scene.bullets.push(this)
  }

  update(delta) {
    if (!this.alive) return

    if (!this.target || !this.target.alive) {
      this.destroy()
      return
    }

    const dx = this.target.x - this.x
    const dy = this.target.y - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 8) {
      this.target.takeDamage(this.damage)
      this.destroy()
      return
    }

    const dt = delta / 1000
    this.x += (dx / dist) * this.speed * dt
    this.y += (dy / dist) * this.speed * dt
    this.graphic.setPosition(this.x, this.y)
  }

  destroy() {
    if (!this.alive) return
    this.alive = false
    this.graphic.destroy()
    if (this.scene.bullets) {
      this.scene.bullets = this.scene.bullets.filter(b => b !== this)
    }
  }
}
