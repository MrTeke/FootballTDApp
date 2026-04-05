import { GRID } from '../config.js'

export default class Grid {
  constructor(scene) {
    this.scene = scene
    this.cells = {}  // key: "col,row" → true if occupied
  }

  key(col, row) {
    return `${col},${row}`
  }

  isInBounds(col, row) {
    return col >= 0 && col < GRID.cols && row >= 0 && row < GRID.rows
  }

  isFree(col, row) {
    if (!this.isInBounds(col, row)) return false
    return !this.cells[this.key(col, row)]
  }

  occupy(col, row) {
    this.cells[this.key(col, row)] = true
  }

  free(col, row) {
    delete this.cells[this.key(col, row)]
  }

  // Pixel center of a cell
  getPixelPos(col, row) {
    return {
      x: GRID.offsetX + col * GRID.cellSize + GRID.cellSize / 2,
      y: GRID.offsetY + row * GRID.cellSize + GRID.cellSize / 2,
    }
  }

  // Convert pixel coords to grid cell
  pixelToGrid(px, py) {
    const col = Math.floor((px - GRID.offsetX) / GRID.cellSize)
    const row = Math.floor((py - GRID.offsetY) / GRID.cellSize)
    return { col, row }
  }

  // Check if pixel is within playfield
  isPixelInGrid(px, py) {
    const { col, row } = this.pixelToGrid(px, py)
    return this.isInBounds(col, row)
  }
}
