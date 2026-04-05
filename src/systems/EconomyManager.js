import { TOWER_DATA } from '../data/towers.js'
import EventBus from '../utils/EventBus.js'

export default class EconomyManager {
  constructor(scene, startMoney) {
    this.scene = scene
    this.money = startMoney || 150
  }

  canAfford(towerType) {
    return this.money >= TOWER_DATA[towerType].cost
  }

  spend(towerType) {
    const cost = TOWER_DATA[towerType].cost
    if (this.money < cost) return false
    this.money -= cost
    EventBus.emit('ECONOMY_CHANGED', this.money)
    return true
  }

  add(amount) {
    this.money += amount
    EventBus.emit('ECONOMY_CHANGED', this.money)
  }
}
