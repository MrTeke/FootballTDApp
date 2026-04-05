import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const { width, height } = this.sys.game.config

    // Loading bar background
    const barBg = this.add.rectangle(width / 2, height / 2, 300, 20, 0x333333)
    const bar = this.add.rectangle(width / 2 - 150, height / 2, 0, 16, 0x4488ff)
    bar.setOrigin(0, 0.5)

    const loadingText = this.add.text(width / 2, height / 2 - 30, 'LOADING...', {
      fontSize: '12px',
      fontFamily: '"Press Start 2P"',
      fill: '#ffffff'
    }).setOrigin(0.5)

    this.load.on('progress', (value) => {
      bar.width = 296 * value
    })

    this.load.on('complete', () => {
      loadingText.setText('READY!')
    })

    // No external assets needed — all drawn via Graphics API
    // This scene is ready immediately but we keep it for structure
  }

  create() {
    // Short delay then go to menu
    this.time.delayedCall(400, () => {
      this.scene.start('MenuScene')
    })
  }
}
