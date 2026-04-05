export const Storage = {
  save(key, value) {
    try {
      localStorage.setItem(`fd_${key}`, JSON.stringify(value))
    } catch (e) {
      console.warn('Save failed:', e)
    }
  },

  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`fd_${key}`)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      return defaultValue
    }
  },

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
  },

  getHighestUnlockedLevel() {
    for (let i = 20; i >= 1; i--) {
      if (this.isLevelUnlocked(i)) return i
    }
    return 1
  }
}
