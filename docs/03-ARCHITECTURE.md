# 03 — Kod Mimarisi

## Genel Prensipler

- Her sınıf tek sorumluluğa sahip (Single Responsibility)
- Sahneler arası iletişim EventBus ile
- Oyun verisi (para, can, level) GameScene üzerinde tutulur
- UI ayrı bir sahne (UIScene) — GameScene üstünde çalışır

---

## Phaser Scene Yapısı

```
BootScene     → Asset yükle, bir sonraki sahneye geç
MenuScene     → Ana menü, ayarlar, level seçimi
GameScene     → Ana oyun mantığı (kule, düşman, wave)
UIScene       → HUD (para, can, wave) — GameScene üstünde
GameOverScene → Kazanma/kaybetme ekranı
```

### Scene Sırası

```javascript
// main.js
scene: [BootScene, MenuScene, GameScene, UIScene, GameOverScene]
```

GameScene + UIScene aynı anda çalışır (parallel scenes).

---

## BootScene.js

```javascript
import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() { super('BootScene') }

  preload() {
    // Tüm asset'leri burada yükle
    // Sprite sheet'ler
    this.load.spritesheet('players', 'assets/sprites/players.png', {
      frameWidth: 16, frameHeight: 24
    })
    this.load.spritesheet('enemies', 'assets/sprites/enemies.png', {
      frameWidth: 16, frameHeight: 16
    })

    // Ses dosyaları
    this.load.audio('whistle', 'assets/audio/whistle.mp3')
    this.load.audio('crowd', 'assets/audio/crowd.mp3')
    this.load.audio('tackle', 'assets/audio/tackle.mp3')
    this.load.audio('goal', 'assets/audio/goal.mp3')

    // Tilemap (ilerleyen aşamada)
    // this.load.tilemapTiledJSON('pitch', 'assets/tilemaps/pitch.json')

    // Loading bar
    this.load.on('progress', (value) => {
      // Loading bar güncelle
    })
  }

  create() {
    this.scene.start('MenuScene')
  }
}
```

---

## MenuScene.js

```javascript
export default class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene') }

  create() {
    // Logo
    // "Oyna" butonu → LevelSelectScene veya direkt GameScene
    // "Ayarlar" butonu → ses açma/kapama
    // En yüksek skor
  }
}
```

---

## GameScene.js — Ana Yapı

```javascript
import Phaser from 'phaser'
import Tower from '../objects/Tower.js'
import Enemy from '../objects/Enemy.js'
import WaveManager from '../systems/WaveManager.js'
import EconomyManager from '../systems/EconomyManager.js'
import Grid from '../objects/Grid.js'
import EventBus from '../utils/EventBus.js'
import { LEVELS } from '../data/levels.js'

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene') }

  init(data) {
    // MenuScene'den gelen level numarası
    this.levelNumber = data.level || 1
  }

  create() {
    // 1. Sahayı çiz
    this.drawPitch()

    // 2. Sistemleri başlat
    this.grid = new Grid(this)
    this.economy = new EconomyManager(this)
    this.waveManager = new WaveManager(this, LEVELS[this.levelNumber])

    // 3. Objeler
    this.towers = []
    this.enemies = []

    // 4. Input
    this.setupInput()

    // 5. UI sahnesini başlat (paralel)
    this.scene.launch('UIScene', { gameScene: this })

    // 6. EventBus dinle
    EventBus.on('TOWER_SELECTED', (type) => { this.selectedTowerType = type })
    EventBus.on('WAVE_START_REQUESTED', () => { this.waveManager.startNextWave() })
    EventBus.on('TOWER_SELL', (tower) => { this.sellTower(tower) })
  }

  update(time, delta) {
    this.enemies.forEach(e => e.update(time, delta))
    this.towers.forEach(t => t.update(time, this.enemies))
    this.checkWaveComplete()
  }

  drawPitch() { /* Saha çizim kodu */ }
  setupInput() { /* Tıklama, hover olayları */ }

  placeTower(gridX, gridY) {
    const type = this.selectedTowerType
    if (!this.economy.canAfford(type)) return
    if (!this.grid.isFree(gridX, gridY)) return

    this.economy.spend(type)
    const tower = new Tower(this, gridX, gridY, type)
    this.towers.push(tower)
    this.grid.occupy(gridX, gridY)

    EventBus.emit('ECONOMY_CHANGED', this.economy.money)
  }

  sellTower(tower) {
    const refund = Math.floor(tower.cost * 0.6)
    this.economy.add(refund)
    this.grid.free(tower.gridX, tower.gridY)
    this.towers = this.towers.filter(t => t !== tower)
    tower.destroy()
    EventBus.emit('ECONOMY_CHANGED', this.economy.money)
  }

  onEnemyReachedGoal() {
    this.lives--
    this.cameras.main.shake(250, 0.01)
    EventBus.emit('LIVES_CHANGED', this.lives)
    if (this.lives <= 0) this.gameOver()
  }

  onEnemyKilled(enemy) {
    this.economy.add(enemy.reward)
    EventBus.emit('ECONOMY_CHANGED', this.economy.money)
  }

  checkWaveComplete() {
    if (this.waveManager.isWaveActive && this.enemies.length === 0) {
      this.waveManager.onWaveComplete()
    }
  }

  gameOver() {
    this.scene.stop('UIScene')
    this.scene.start('GameOverScene', { win: false, level: this.levelNumber })
  }

  levelComplete() {
    const stars = this.calculateStars()
    this.scene.stop('UIScene')
    this.scene.start('GameOverScene', { win: true, stars, level: this.levelNumber })
  }

  calculateStars() {
    if (this.lives >= 5) return 3
    if (this.lives >= 3) return 2
    return 1
  }
}
```

---

## Tower.js

```javascript
import { TOWER_DATA } from '../data/towers.js'

export default class Tower {
  constructor(scene, gridX, gridY, type) {
    this.scene = scene
    this.gridX = gridX
    this.gridY = gridY
    this.type = type

    const cfg = TOWER_DATA[type]
    this.range = cfg.range
    this.damage = cfg.damage
    this.fireRate = cfg.fireRate  // ms cinsinden
    this.cost = cfg.cost
    this.lastFired = 0

    // Pixel koordinatları
    this.x = gridX * 40 + 20
    this.y = gridY * 40 + 20 + 80  // HUD offset

    this.draw()
    this.setupInteraction()
  }

  draw() {
    // Phaser Graphics ile pixel art karakter çiz
    this.graphics = this.scene.add.graphics()
    // ... çizim kodu
  }

  setupInteraction() {
    // Tıklanınca seçim halkası + sat butonu göster
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
    // En yakın düşmanı bul (menzil içinde)
    return enemies
      .filter(e => e.alive && Phaser.Math.Distance.Between(
        this.x, this.y, e.x, e.y) < this.range)
      .sort((a, b) => {
        // "First" targeting: kalaya en yakın olan
        const da = Phaser.Math.Distance.Between(a.x, a.y, 240, 640)
        const db = Phaser.Math.Distance.Between(b.x, b.y, 240, 640)
        return da - db
      })[0] || null
  }

  fire(target) {
    // Mermi oluştur
    new Bullet(this.scene, this.x, this.y, target, this.damage)
  }

  destroy() {
    this.graphics.destroy()
  }
}
```

---

## Enemy.js

```javascript
import { ENEMY_DATA } from '../data/enemies.js'

export default class Enemy {
  constructor(scene, spawnX, spawnY, type) {
    this.scene = scene
    this.type = type

    const cfg = ENEMY_DATA[type]
    this.hp = cfg.hp
    this.maxHp = cfg.hp
    this.speed = cfg.speed
    this.reward = cfg.reward
    this.alive = true

    this.x = spawnX
    this.y = spawnY

    // Hedef: Kale merkezi
    this.targetX = 240
    this.targetY = 600

    this.draw()
  }

  draw() {
    this.container = this.scene.add.container(this.x, this.y)
    // Karakter grafiği
    this.bodyGraphic = this.scene.add.graphics()
    // HP bar
    this.hpBarBg = this.scene.add.rectangle(0, -12, 20, 3, 0x333333)
    this.hpBar = this.scene.add.rectangle(-10, -12, 20, 3, 0x00ff44)
    this.hpBar.setOrigin(0, 0.5)

    this.container.add([this.bodyGraphic, this.hpBarBg, this.hpBar])
    this.drawBody()
  }

  drawBody() {
    // Pixel art düşman çizimi
    this.bodyGraphic.clear()
    // ... çizim kodu
  }

  update(time, delta) {
    if (!this.alive) return
    this.move(delta)
    this.updateHpBar()

    // Kaleye ulaştı mı?
    const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY)
    if (dist < 20) {
      this.alive = false
      this.destroy()
      this.scene.onEnemyReachedGoal()
    }
  }

  move(delta) {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Normalize + speed uygula
    const vx = (dx / dist) * this.speed * (delta / 1000)
    const vy = (dy / dist) * this.speed * (delta / 1000)

    // Diğer düşmanlarla separation
    const separation = this.calculateSeparation()

    this.x += vx + separation.x
    this.y += vy + separation.y
    this.container.setPosition(this.x, this.y)
  }

  calculateSeparation() {
    let sx = 0, sy = 0
    this.scene.enemies.forEach(other => {
      if (other === this || !other.alive) return
      const dx = this.x - other.x
      const dy = this.y - other.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 24 && d > 0) {
        sx += (dx / d) * (1 - d / 24) * 2
        sy += (dy / d) * (1 - d / 24) * 2
      }
    })
    return { x: sx, y: sy }
  }

  takeDamage(amount) {
    this.hp -= amount
    if (this.hp <= 0) {
      this.alive = false
      this.destroy()
      this.scene.onEnemyKilled(this)
    }
  }

  updateHpBar() {
    const pct = this.hp / this.maxHp
    this.hpBar.width = 20 * pct
    this.hpBar.fillColor = pct > 0.5 ? 0x00ff44 : pct > 0.25 ? 0xffaa00 : 0xff2200
  }

  destroy() {
    this.container.destroy()
    this.scene.enemies = this.scene.enemies.filter(e => e !== this)
  }
}
```

---

## WaveManager.js

```javascript
export default class WaveManager {
  constructor(scene, levelData) {
    this.scene = scene
    this.levelData = levelData
    this.currentWave = 0
    this.totalWaves = levelData.waves.length
    this.isWaveActive = false
  }

  startNextWave() {
    if (this.isWaveActive) return
    if (this.currentWave >= this.totalWaves) return

    this.isWaveActive = true
    const wave = this.levelData.waves[this.currentWave]
    this.currentWave++

    EventBus.emit('WAVE_CHANGED', this.currentWave)
    this.spawnWave(wave)
  }

  spawnWave(wave) {
    let delay = 0
    wave.enemies.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) {
        this.scene.time.delayedCall(delay, () => {
          this.spawnEnemy(type)
        })
        delay += wave.interval || 1000
      }
    })
  }

  spawnEnemy(type) {
    const spawnPoints = this.levelData.spawnPoints
    const sp = spawnPoints[Math.floor(Math.random() * spawnPoints.length)]
    const enemy = new Enemy(this.scene, sp.x, sp.y, type)
    this.scene.enemies.push(enemy)
  }

  onWaveComplete() {
    this.isWaveActive = false
    const bonus = this.currentWave * 25
    this.scene.economy.add(bonus)
    EventBus.emit('WAVE_COMPLETE', { wave: this.currentWave, bonus })

    if (this.currentWave >= this.totalWaves) {
      this.scene.time.delayedCall(1500, () => this.scene.levelComplete())
    } else {
      EventBus.emit('NEXT_WAVE_READY')
    }
  }
}
```

---

## EventBus.js

```javascript
// Sahneler arası iletişim için basit event sistemi

class EventBusClass {
  constructor() { this.events = {} }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
  }

  off(event, callback) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(cb => cb(data))
  }

  clear() { this.events = {} }
}

export default new EventBusClass()
```

---

## Storage.js

```javascript
// Oyun verisi kaydetme/yükleme

export const Storage = {
  save(key, value) {
    try {
      localStorage.setItem(`fd_${key}`, JSON.stringify(value))
    } catch (e) { console.warn('Save failed:', e) }
  },

  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`fd_${key}`)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) { return defaultValue }
  },

  // Level yıldızlarını kaydet
  saveLevelStars(level, stars) {
    const all = this.load('stars', {})
    if (!all[level] || all[level] < stars) {
      all[level] = stars
      this.save('stars', all)
    }
  },

  getLevelStars(level) {
    const all = this.load('stars', {})
    return all[level] || 0
  },

  isLevelUnlocked(level) {
    if (level === 1) return true
    return this.getLevelStars(level - 1) > 0
  }
}
```
