import EventBus from '../utils/EventBus.js'
import { Storage } from '../utils/Storage.js'

class SoundManagerClass {
  constructor() {
    this._ctx = null
    this._enabled = Storage.load('soundEnabled', true)
    this._lastShoot = 0
    this._setup()
  }

  _setup() {
    EventBus.on('SOUND_TOGGLE',    (val) => { this._enabled = val })
    EventBus.on('WAVE_CHANGED',    (data) => { if (data.current > 0) this._waveStart() })
    EventBus.on('WAVE_COMPLETE',   () => this._waveComplete())
    EventBus.on('ENEMY_KILLED',    () => this._enemyDeath())
    EventBus.on('GOAL_CONCEDED',   () => this._goalConceded())
    EventBus.on('TOWER_PLACED',    () => this._towerPlace())
    EventBus.on('TOWER_SELL',      () => this._towerSell())
    EventBus.on('LEVEL_COMPLETE',  () => this._levelWin())
    EventBus.on('UI_CLICK',        () => this._uiClick())
    EventBus.on('SHOOT',           () => this._shoot())
  }

  get ctx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this._ctx.state === 'suspended') this._ctx.resume()
    return this._ctx
  }

  _ok() { return this._enabled }

  // ─── SOUNDS ──────────────────────────────────────────────────────────────────

  // Tower fires a bullet — subtle, throttled to avoid saturation
  _shoot() {
    if (!this._ok()) return
    const now = performance.now()
    if (now - this._lastShoot < 120) return
    this._lastShoot = now

    const ctx = this.ctx
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(260, t)
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.06)
    gain.gain.setValueAtTime(0.04, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
    osc.start(t)
    osc.stop(t + 0.06)
  }

  // Enemy eliminated — short descending blip
  _enemyDeath() {
    if (!this._ok()) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(360, t)
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.12)
    gain.gain.setValueAtTime(0.07, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    osc.start(t)
    osc.stop(t + 0.12)
  }

  // Enemy reaches goal — ominous low thud + buzz
  _goalConceded() {
    if (!this._ok()) return
    const ctx = this.ctx
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(90, t)
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.45)
    gain.gain.setValueAtTime(0.35, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
    osc.start(t)
    osc.stop(t + 0.45)

    const buzz = ctx.createOscillator()
    const buzzGain = ctx.createGain()
    buzz.connect(buzzGain)
    buzzGain.connect(ctx.destination)
    buzz.type = 'sawtooth'
    buzz.frequency.setValueAtTime(44, t)
    buzzGain.gain.setValueAtTime(0.12, t)
    buzzGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    buzz.start(t)
    buzz.stop(t + 0.3)
  }

  // Wave begins — ascending 3-note arpeggio
  _waveStart() {
    if (!this._ok()) return
    const ctx = this.ctx
    ;[220, 330, 440].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.09
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.11, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
      osc.start(t)
      osc.stop(t + 0.1)
    })
  }

  // Wave cleared — short positive jingle
  _waveComplete() {
    if (!this._ok()) return
    const ctx = this.ctx
    ;[330, 440, 550, 660].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.09
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.1, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13)
      osc.start(t)
      osc.stop(t + 0.13)
    })
  }

  // Level won — C major ascending fanfare
  _levelWin() {
    if (!this._ok()) return
    const ctx = this.ctx
    // C4 E4 G4 C5 E5 G5
    ;[261.6, 329.6, 392.0, 523.3, 659.3, 783.9].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.13
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.14, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
      osc.start(t)
      osc.stop(t + 0.22)
    })
  }

  // Tower placed — satisfying thud
  _towerPlace() {
    if (!this._ok()) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(210, t)
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1)
    gain.gain.setValueAtTime(0.2, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
    osc.start(t)
    osc.stop(t + 0.1)
  }

  // Tower sold — descending coin clink
  _towerSell() {
    if (!this._ok()) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(660, t)
    osc.frequency.exponentialRampToValueAtTime(330, t + 0.15)
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
    osc.start(t)
    osc.stop(t + 0.15)
  }

  // UI button press — sharp tick
  _uiClick() {
    if (!this._ok()) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1100, t)
    gain.gain.setValueAtTime(0.1, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03)
    osc.start(t)
    osc.stop(t + 0.03)
  }
}

export const SoundManager = new SoundManagerClass()
