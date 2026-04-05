import Phaser from 'phaser'
import { Storage } from '../utils/Storage.js'
import EventBus from '../utils/EventBus.js'
import { AdManager } from '../systems/AdsService.js'

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene')
  }

  init(data) {
    this.win = data.win || false
    this.stars = data.stars || 0
    this.level = data.level || 1
    this.lives = data.lives || 0
  }

  create() {
    const W = this.sys.game.config.width
    const H = this.sys.game.config.height

    this.cameras.main.fadeIn(300)

    // Save result
    if (this.win && this.stars > 0) {
      Storage.saveLevelStars(this.level, this.stars)
    }

    this.drawBackground(W, H)
    this.drawResultHeader(W, H)

    if (this.win) {
      this.drawStars(W, H)
    }

    this.drawButtons(W, H)
    this.startAnimations()
  }

  drawBackground(W, H) {
    const color = this.win ? 0x001a00 : 0x1a0000
    this.add.rectangle(W / 2, H / 2, W, H, color)

    // Decorative lines
    const g = this.add.graphics()
    g.lineStyle(1, this.win ? 0x44ff44 : 0xff4444, 0.1)
    for (let i = 0; i < H; i += 20) {
      g.moveTo(0, i)
      g.lineTo(W, i)
    }
    g.strokePath()
  }

  drawResultHeader(W, H) {
    if (this.win) {
      // Win
      this.add.text(W / 2 + 2, H / 2 - 152, 'YOU WIN!', {
        fontSize: '20px',
        fontFamily: '"Press Start 2P"',
        fill: '#000000',
      }).setOrigin(0.5)

      this.headerText = this.add.text(W / 2, H / 2 - 155, 'YOU WIN!', {
        fontSize: '20px',
        fontFamily: '"Press Start 2P"',
        fill: '#ffd700',
      }).setOrigin(0.5)

      this.add.text(W / 2, H / 2 - 120, `LEVEL ${this.level} COMPLETED`, {
        fontSize: '9px',
        fontFamily: '"Press Start 2P"',
        fill: '#88ffaa',
      }).setOrigin(0.5)
    } else {
      // Lose
      this.add.text(W / 2 + 2, H / 2 - 152, 'GAME OVER', {
        fontSize: '18px',
        fontFamily: '"Press Start 2P"',
        fill: '#000000',
      }).setOrigin(0.5)

      this.headerText = this.add.text(W / 2, H / 2 - 155, 'GAME OVER', {
        fontSize: '18px',
        fontFamily: '"Press Start 2P"',
        fill: '#ff4444',
      }).setOrigin(0.5)

      this.add.text(W / 2, H / 2 - 120, `LEVEL ${this.level} - GOAL CONCEDED!`, {
        fontSize: '9px',
        fontFamily: '"Press Start 2P"',
        fill: '#ff8888',
      }).setOrigin(0.5)
    }
  }

  drawStars(W, H) {
    const starY = H / 2 - 70
    this.starObjects = []

    for (let i = 0; i < 3; i++) {
      const x = W / 2 + (i - 1) * 70
      const filled = i < this.stars

      const star = this.add.text(x, starY, '★', {
        fontSize: '48px',
        fill: filled ? '#ffd700' : '#333333',
      }).setOrigin(0.5).setAlpha(0)

      this.starObjects.push(star)
    }
  }

  drawButtons(W, H) {
    const btnY = H / 2 + 50

    if (this.win) {
      const nextLevel = this.level + 1
      if (nextLevel <= 20) {
        const nextBtn = this.createButton(W / 2, btnY - 30, 'NEXT LEVEL →', 0x224422)
        nextBtn.on('pointerdown', () => {
          EventBus.clear()
          this.scene.start('GameScene', { level: nextLevel })
          this.scene.launch('UIScene')
        })
      } else {
        this.add.text(W / 2, btnY - 30, '🏆 ALL LEVELS COMPLETED!', {
          fontSize: '9px',
          fontFamily: '"Press Start 2P"',
          fill: '#ffd700',
          align: 'center',
          wordWrap: { width: 300 }
        }).setOrigin(0.5)
      }

      // Rewarded ad: bonus money for next level
      this.createAdButton(
        W / 2, btnY + 22,
        '📺 WATCH AD → +100$',
        0x223344,
        () => {
          AdManager.showRewarded(() => {
            // Store bonus for next level start
            Storage.save('adBonus', 100)
            this.showAdReward(W, H, '+100$ added for next level!')
          })
        }
      )
    } else {
      // Lose screen — rewarded ad gives +50 bonus gold on retry
      this.createAdButton(
        W / 2, btnY - 30,
        '📺 WATCH AD → +50$ BONUS',
        0x442200,
        () => {
          AdManager.showRewarded(() => {
            Storage.save('adBonus', 50)
            this.showAdReward(W, H, 'Restarting with +50$ bonus!')
            this.time.delayedCall(2100, () => {
              EventBus.clear()
              this.scene.start('GameScene', { level: this.level })
              this.scene.launch('UIScene')
            })
          })
        }
      )
    }

    // Retry
    const offsetY = this.win ? 70 : 22
    const retryBtn = this.createButton(W / 2, btnY + offsetY, '↩ RETRY', 0x222244)
    retryBtn.on('pointerdown', () => {
      EventBus.clear()
      this.scene.start('GameScene', { level: this.level })
      this.scene.launch('UIScene')
    })

    // Level select
    const menuBtn = this.createButton(W / 2, btnY + offsetY + 48, '☰ LEVELS', 0x333333)
    menuBtn.on('pointerdown', () => {
      EventBus.clear()
      this.scene.start('LevelSelectScene')
    })
  }

  createAdButton(x, y, label, color, callback) {
    const btn = this.add.rectangle(x, y, 260, 38, color)
      .setInteractive()
      .setStrokeStyle(2, 0xffaa00)

    this.add.text(x, y, label, {
      fontSize: '7px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffdd88',
    }).setOrigin(0.5)

    btn.on('pointerdown', callback)
    btn.on('pointerover', () => btn.setStrokeStyle(2, 0xffd700))
    btn.on('pointerout',  () => btn.setStrokeStyle(2, 0xffaa00))

    return btn
  }

  showAdReward(W, H, msg) {
    const overlay = this.add.rectangle(W / 2, H / 2, W, 60, 0x000000, 0.8).setDepth(80)
    const txt = this.add.text(W / 2, H / 2, msg, {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffd700',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5).setDepth(81)

    this.time.delayedCall(2000, () => {
      overlay.destroy()
      txt.destroy()
    })
  }

  createButton(x, y, label, color) {
    const btn = this.add.rectangle(x, y, 240, 38, color)
      .setInteractive()
      .setStrokeStyle(2, 0x4488ff)

    this.add.text(x, y, label, {
      fontSize: '9px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffffff',
    }).setOrigin(0.5)

    btn.on('pointerover', () => btn.setStrokeStyle(2, 0xffd700))
    btn.on('pointerout', () => btn.setStrokeStyle(2, 0x4488ff))

    return btn
  }

  startAnimations() {
    // Animate header
    if (this.headerText) {
      this.headerText.setAlpha(0)
      this.tweens.add({
        targets: this.headerText,
        alpha: 1,
        scaleX: { from: 0.5, to: 1 },
        scaleY: { from: 0.5, to: 1 },
        duration: 500,
        ease: 'Back.out'
      })
    }

    // Animate stars one by one
    if (this.win && this.starObjects) {
      this.starObjects.forEach((star, i) => {
        this.time.delayedCall(600 + i * 300, () => {
          star.setAlpha(1)
          this.tweens.add({
            targets: star,
            scaleX: { from: 0, to: 1 },
            scaleY: { from: 0, to: 1 },
            duration: 400,
            ease: 'Back.out'
          })
        })
      })
    }
  }
}
