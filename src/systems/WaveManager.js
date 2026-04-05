import Enemy from '../objects/Enemy.js'
import EventBus from '../utils/EventBus.js'

export default class WaveManager {
  constructor(scene, levelData) {
    this.scene = scene
    this.levelData = levelData
    this.currentWave = 0
    this.totalWaves = levelData.waves.length
    this.isWaveActive = false
    this.pendingEnemies = 0
    this.speedModifier = levelData.speedModifier || 1
  }

  startNextWave() {
    if (this.isWaveActive) return
    if (this.currentWave >= this.totalWaves) return

    this.isWaveActive = true
    const waveData = this.levelData.waves[this.currentWave]
    this.currentWave++

    EventBus.emit('WAVE_CHANGED', { current: this.currentWave, total: this.totalWaves })
    this.spawnWave(waveData)
  }

  spawnWave(waveData) {
    let totalCount = 0
    waveData.enemies.forEach(e => { totalCount += e.count })
    this.pendingEnemies = totalCount

    let delay = 0
    waveData.enemies.forEach(({ type, count }) => {
      for (let i = 0; i < count; i++) {
        this.scene.time.delayedCall(delay, () => {
          if (this.scene.scene.isActive('GameScene')) {
            this.spawnEnemy(type)
          }
        })
        delay += waveData.interval
      }
    })
  }

  spawnEnemy(type) {
    const spawnPoints = this.levelData.spawnPoints
    const sp = spawnPoints[Math.floor(Math.random() * spawnPoints.length)]
    const enemy = new Enemy(this.scene, sp.x, sp.y, type, this.speedModifier)
    this.scene.enemies.push(enemy)
    this.pendingEnemies--
  }

  checkWaveComplete() {
    if (!this.isWaveActive) return
    if (this.pendingEnemies > 0) return
    if (this.scene.enemies.length > 0) return

    this.onWaveComplete()
  }

  onWaveComplete() {
    this.isWaveActive = false
    const bonus = this.currentWave * 25
    this.scene.economy.add(bonus)
    EventBus.emit('WAVE_COMPLETE', { wave: this.currentWave, bonus })

    if (this.currentWave >= this.totalWaves) {
      this.scene.time.delayedCall(1500, () => {
        if (this.scene.scene.isActive('GameScene')) {
          this.scene.levelComplete()
        }
      })
    } else {
      this.scene.time.delayedCall(500, () => {
        EventBus.emit('NEXT_WAVE_READY', { wave: this.currentWave + 1, total: this.totalWaves })
      })
    }
  }

  isAllWavesDone() {
    return this.currentWave >= this.totalWaves
  }
}
