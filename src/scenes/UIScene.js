import Phaser from 'phaser'
import { TOWER_DATA } from '../data/towers.js'
import { LEVELS } from '../data/levels.js'
import EventBus from '../utils/EventBus.js'
import { COLORS, HUD_HEIGHT, PANEL_HEIGHT } from '../config.js'

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene')
  }

  init(data) {
    this.levelNumber = data.levelNumber || 1
  }

  create() {
    const W = this.sys.game.config.width
    const H = this.sys.game.config.height
    const levelData = LEVELS[this.levelNumber]

    this.selectedTowerType = null
    this.maxLives = levelData.lives

    this.drawHUD(W, levelData)
    this.drawPanel(W, H)
    this.createTowerButtons(W, H)
    this.createWaveButton(W, H)
    this.createTowerInfoPanel(W, H)
    this.createMenuButton(W)

    this.setupEventListeners()
  }

  // ─── HUD ──────────────────────────────────────────────────────────────────

  drawHUD(W, levelData) {
    const g = this.add.graphics()
    g.fillStyle(0x090914)
    g.fillRect(0, 0, W, HUD_HEIGHT)
    g.lineStyle(1, 0x333355)
    g.moveTo(0, HUD_HEIGHT)
    g.lineTo(W, HUD_HEIGHT)
    g.strokePath()

    // Level name
    this.add.text(W / 2, 8, `LVL ${this.levelNumber}: ${levelData.name}`, {
      fontSize: '7px',
      fontFamily: '"Press Start 2P"',
      fill: '#8899bb',
    }).setOrigin(0.5)

    // Money icon + text
    this.add.text(10, 34, '$', { fontSize: '14px', fill: '#ffd700' })
    this.moneyText = this.add.text(28, 34, '---', {
      fontSize: '12px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffd700',
    })
    this.moneyText.setDepth(10)

    // Lives — heart icons
    this.heartIcons = []
    for (let i = 0; i < this.maxLives; i++) {
      const heart = this.add.text(W / 2 - 52 + i * 22, 22, '❤', {
        fontSize: '13px',
        fill: '#ff4444',
      })
      this.heartIcons.push(heart)
    }

    // Wave counter
    this.waveText = this.add.text(W - 10, 22, 'WAVE 0/0', {
      fontSize: '7px',
      fontFamily: '"Press Start 2P"',
      fill: '#88bbff',
    }).setOrigin(1, 0)
  }

  // ─── BOTTOM PANEL ─────────────────────────────────────────────────────────

  drawPanel(W, H) {
    this.panelY = H - PANEL_HEIGHT
    const g = this.add.graphics()
    g.fillStyle(0x0d0d22)
    g.fillRect(0, this.panelY, W, PANEL_HEIGHT)
    g.lineStyle(1, 0x334466)
    g.moveTo(0, this.panelY)
    g.lineTo(W, this.panelY)
    g.strokePath()
  }

  // ─── TOWER BUTTONS ────────────────────────────────────────────────────────

  createTowerButtons(W, H) {
    const panelY = H - PANEL_HEIGHT
    const types = Object.keys(TOWER_DATA)
    // 3 buttons share left 390px, wave button takes right 90px
    const btnW = 100
    const totalW = types.length * (btnW + 10) - 10
    const startX = (390 - totalW) / 2 + btnW / 2

    this.towerButtons = {}

    types.forEach((type, i) => {
      const cfg = TOWER_DATA[type]
      const x = startX + i * (btnW + 10)
      const y = panelY + PANEL_HEIGHT / 2
      const colorHex = '#' + cfg.color.toString(16).padStart(6, '0')

      const bg = this.add.rectangle(x, y, btnW, 60, 0x112233)
        .setStrokeStyle(2, 0x334466)
        .setInteractive()

      // Tower color blob
      const preview = this.add.graphics()
      preview.fillStyle(cfg.color)
      preview.fillCircle(x - 32, y, 9)

      const nameText = this.add.text(x - 22, y - 14, cfg.name, {
        fontSize: '7px',
        fontFamily: '"Press Start 2P"',
        fill: colorHex,
      }).setOrigin(0, 0.5)

      const costText = this.add.text(x - 22, y, `${cfg.cost}$`, {
        fontSize: '9px',
        fontFamily: '"Press Start 2P"',
        fill: '#ffd700',
      }).setOrigin(0, 0.5)

      const descText = this.add.text(x - 22, y + 14, cfg.description.substring(0, 18), {
        fontSize: '5px',
        fontFamily: '"Press Start 2P"',
        fill: '#667788',
        wordWrap: { width: 90 }
      }).setOrigin(0, 0.5)

      bg.on('pointerdown', () => this.selectTowerType(type))
      bg.on('pointerover', () => { if (this.selectedTowerType !== type) bg.setFillStyle(0x1a3344) })
      bg.on('pointerout',  () => { if (this.selectedTowerType !== type) bg.setFillStyle(0x112233) })

      this.towerButtons[type] = { bg, preview, nameText, costText }
    })
  }

  // ─── WAVE BUTTON ──────────────────────────────────────────────────────────

  createWaveButton(W, H) {
    const btnX = W - 48
    const btnY = H - PANEL_HEIGHT / 2

    this.waveBtn = this.add.rectangle(btnX, btnY, 84, 58, 0x224422)
      .setStrokeStyle(2, 0x44aa44)
      .setInteractive()
      .setAlpha(0.5)

    this.waveBtnText = this.add.text(btnX, btnY - 9, 'WAVE', {
      fontSize: '7px',
      fontFamily: '"Press Start 2P"',
      fill: '#44ff44',
    }).setOrigin(0.5)

    this.waveBtnSubText = this.add.text(btnX, btnY + 9, 'START', {
      fontSize: '7px',
      fontFamily: '"Press Start 2P"',
      fill: '#44ff44',
    }).setOrigin(0.5)

    this.waveBtn.on('pointerdown', () => {
      if (this.waveBtn.alpha < 0.9) return
      EventBus.emit('UI_CLICK')
      EventBus.emit('WAVE_START_REQUESTED')
      this.waveBtn.setAlpha(0.4)
      this.waveBtnText.setText('WAVE')
      this.waveBtnSubText.setText('IN PROGRESS..')
    })
  }

  // ─── TOWER INFO PANEL (in HUD, right side) ────────────────────────────────

  createTowerInfoPanel(W, H) {
    // Hidden container shown when a tower is selected
    this.towerInfoContainer = this.add.container(W - 10, 62)
    this.towerInfoContainer.setDepth(20)
    this.towerInfoContainer.setAlpha(0)

    this.towerInfoBg = this.add.rectangle(0, 0, 160, 90, 0x000000, 0.85)
      .setStrokeStyle(1, 0x4488ff)
      .setOrigin(1, 0)

    this.towerInfoText = this.add.text(-6, 4, '', {
      fontSize: '7px',
      fontFamily: '"Press Start 2P"',
      fill: '#cceeff',
      lineSpacing: 6,
      align: 'right',
    }).setOrigin(1, 0)

    this.towerInfoContainer.add([this.towerInfoBg, this.towerInfoText])
  }

  showTowerInfo(tower) {
    const cfg = TOWER_DATA[tower.type]
    const sellPrice = Math.floor(tower.cost * 0.6)
    const dps = (tower.damage / (tower.fireRate / 1000)).toFixed(1)

    this.towerInfoText.setText([
      cfg.name.toUpperCase(),
      `DAMAGE: ${tower.damage}`,
      `RANGE : ${tower.range}px`,
      `DPS   : ${dps}`,
      `SELL  : ${sellPrice}$`,
    ])

    this.towerInfoContainer.setAlpha(0)
    this.tweens.add({
      targets: this.towerInfoContainer,
      alpha: 1,
      duration: 150,
    })
  }

  hideTowerInfo() {
    this.tweens.add({
      targets: this.towerInfoContainer,
      alpha: 0,
      duration: 100,
    })
  }

  // ─── WAVE ANNOUNCEMENT OVERLAY ────────────────────────────────────────────

  showWaveAnnouncement(waveNum, total) {
    const W = this.sys.game.config.width
    const H = this.sys.game.config.height

    // Dark overlay strip
    const overlay = this.add.rectangle(W / 2, H / 2, W, 60, 0x000000, 0.75)
      .setDepth(60)

    const txt = this.add.text(W / 2, H / 2, `⚽ WAVE ${waveNum}/${total} STARTING!`, {
      fontSize: '12px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffffff',
    }).setOrigin(0.5).setDepth(61).setAlpha(0)

    // Fade in → hold → fade out
    this.tweens.add({
      targets: [overlay, txt],
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(1400, () => {
          this.tweens.add({
            targets: [overlay, txt],
            alpha: 0,
            duration: 400,
            onComplete: () => { overlay.destroy(); txt.destroy() }
          })
        })
      }
    })
  }

  // ─── MENU BUTTON ──────────────────────────────────────────────────────────

  createMenuButton(W) {
    const btn = this.add.text(12, 10, '☰', {
      fontSize: '18px',
      fill: '#aaaacc',
    }).setOrigin(0, 0).setInteractive().setDepth(20)

    btn.on('pointerover', () => btn.setAlpha(0.7))
    btn.on('pointerout',  () => btn.setAlpha(1))
    btn.on('pointerdown', () => {
      EventBus.clear()
      this.scene.stop('GameScene')
      this.scene.stop('UIScene')
      this.scene.start('LevelSelectScene')
    })
  }

  // ─── SELECTOR ─────────────────────────────────────────────────────────────

  selectTowerType(type) {
    if (this.selectedTowerType === type) {
      this.deselectAll()
      EventBus.emit('TOWER_TYPE_SELECTED', null)
      return
    }

    this.selectedTowerType = type
    this.hideTowerInfo()

    Object.entries(this.towerButtons).forEach(([t, { bg }]) => {
      if (t === type) {
        bg.setFillStyle(0x224466)
        bg.setStrokeStyle(2, 0x4488ff)
      } else {
        bg.setFillStyle(0x112233)
        bg.setStrokeStyle(2, 0x334466)
      }
    })

    EventBus.emit('TOWER_TYPE_SELECTED', type)
  }

  deselectAll() {
    this.selectedTowerType = null
    Object.values(this.towerButtons).forEach(({ bg }) => {
      bg.setFillStyle(0x112233)
      bg.setStrokeStyle(2, 0x334466)
    })
  }

  // ─── EVENT LISTENERS ──────────────────────────────────────────────────────

  setupEventListeners() {
    this._onEconomy = (money) => {
      if (!this.moneyText) return
      this.moneyText.setText(`${money}`)
      // Pulse tween
      this.tweens.add({
        targets: this.moneyText,
        scaleX: 1.35,
        scaleY: 1.35,
        duration: 80,
        yoyo: true,
        ease: 'Power2',
      })
      this.updateButtonAffordability(money)
    }

    this._onLives = (lives) => {
      if (!this.heartIcons) return
      this.heartIcons.forEach((heart, i) => {
        const alive = i < lives
        heart.setAlpha(alive ? 1 : 0.18)
        // Shake lost heart
        if (!alive && heart.alpha > 0.17) {
          this.tweens.add({
            targets: heart,
            x: heart.x + 4,
            duration: 60,
            yoyo: true,
            repeat: 2,
          })
        }
      })
    }

    this._onWaveChanged = (data) => {
      if (this.waveText) this.waveText.setText(`WAVE ${data.current}/${data.total}`)
      if (data.current > 0) {
        this.showWaveAnnouncement(data.current, data.total)
      }
    }

    this._onNextWaveReady = (data) => {
      if (!this.waveBtn) return
      this.waveBtn.setAlpha(1)
      this.waveBtnText.setText(`WAVE ${data.wave}`)
      this.waveBtnSubText.setText('START ▶')
    }

    this._onWaveComplete = (data) => {
      const W = this.sys.game.config.width
      const bonus = this.add.text(W / 2, 120, `WAVE BONUS +${data.bonus}$`, {
        fontSize: '10px',
        fontFamily: '"Press Start 2P"',
        fill: '#ffd700',
        backgroundColor: '#000000bb',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5).setDepth(50)

      this.tweens.add({
        targets: bonus,
        y: 90,
        alpha: 0,
        duration: 1800,
        delay: 400,
        onComplete: () => bonus.destroy()
      })
    }

    this._onTowerInfo = ({ tower }) => {
      this.deselectAll()
      this.showTowerInfo(tower)
    }

    this._onTowerDeselected = () => {
      this.deselectAll()
      this.hideTowerInfo()
    }

    EventBus.on('ECONOMY_CHANGED',       this._onEconomy)
    EventBus.on('LIVES_CHANGED',         this._onLives)
    EventBus.on('WAVE_CHANGED',          this._onWaveChanged)
    EventBus.on('NEXT_WAVE_READY',       this._onNextWaveReady)
    EventBus.on('WAVE_COMPLETE',         this._onWaveComplete)
    EventBus.on('TOWER_SELECTED_FOR_INFO', this._onTowerInfo)
    EventBus.on('TOWER_DESELECTED',      this._onTowerDeselected)
  }

  updateButtonAffordability(money) {
    Object.entries(this.towerButtons).forEach(([type, { bg, costText }]) => {
      const cost = TOWER_DATA[type].cost
      const canAfford = money >= cost
      costText.setAlpha(canAfford ? 1 : 0.35)
      if (this.selectedTowerType !== type) {
        bg.setFillStyle(canAfford ? 0x112233 : 0x0d0d0d)
      }
    })
  }

  shutdown() {
    EventBus.off('ECONOMY_CHANGED',         this._onEconomy)
    EventBus.off('LIVES_CHANGED',           this._onLives)
    EventBus.off('WAVE_CHANGED',            this._onWaveChanged)
    EventBus.off('NEXT_WAVE_READY',         this._onNextWaveReady)
    EventBus.off('WAVE_COMPLETE',           this._onWaveComplete)
    EventBus.off('TOWER_SELECTED_FOR_INFO', this._onTowerInfo)
    EventBus.off('TOWER_DESELECTED',        this._onTowerDeselected)
  }
}
