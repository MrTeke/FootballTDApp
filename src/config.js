import Phaser from 'phaser'

export const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

// Grid: 12 cols × 11 rows, 40px cells
// HUD: top 60px, bottom panel: 80px
// Playfield Y: 60 → 500 (440px = 11 rows × 40px)
export const GRID = {
  cols: 12,
  rows: 11,
  cellSize: 40,
  offsetX: 0,
  offsetY: 60,   // below HUD
}

export const COLORS = {
  pitch: 0x2d7a1b,
  pitchAlt: 0x267016,
  lines: 0xffffff,
  hudBg: 0x0a0a1a,
  panelBg: 0x111122,
  gold: 0xffd700,
  red: 0xff4444,
  green: 0x44ff44,
  blue: 0x4488ff,
  white: 0xffffff,
  gray: 0x888888,
  darkGray: 0x333333,
}

export const GOAL_X = 240
export const GOAL_Y = 490
export const HUD_HEIGHT = 60
export const PANEL_HEIGHT = 80
