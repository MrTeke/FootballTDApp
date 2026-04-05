// AdMob integration via Capacitor
// Only active on native platforms (iOS/Android)

const isNative = typeof window !== 'undefined' &&
  window.Capacitor && window.Capacitor.isNativePlatform()

let AdMob = null

async function loadAdMob() {
  if (isNative && !AdMob) {
    try {
      const mod = await import('@capacitor-community/admob')
      AdMob = mod.AdMob
    } catch (e) {
      console.warn('AdMob not available:', e)
    }
  }
}

export const AdManager = {
  async initialize() {
    if (!isNative) return
    await loadAdMob()
    if (!AdMob) return
    await AdMob.initialize({ testingDevices: [], initializeForTesting: false })
  },

  async showBanner() {
    if (!isNative || !AdMob) return
    try {
      await AdMob.showBanner({
        adId: 'ca-app-pub-5486950376190567/7852621234',
        adSize: 'BANNER',
        position: 'BOTTOM_CENTER',
      })
    } catch (e) {
      console.warn('Banner failed:', e)
    }
  },

  async hideBanner() {
    if (!isNative || !AdMob) return
    try { await AdMob.hideBanner() } catch (e) {}
  },

  async showInterstitial() {
    if (!isNative || !AdMob) return
    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-5486950376190567/8587118404',
      })
      await AdMob.showInterstitial()
    } catch (e) {
      console.warn('Interstitial failed:', e)
    }
  },

  async showRewarded(onRewarded) {
    if (!isNative || !AdMob) {
      // In web/dev, just give the reward directly
      if (onRewarded) onRewarded()
      return
    }
    try {
      await AdMob.prepareRewardVideoAd({
        adId: 'ca-app-pub-5486950376190567/2628943669',
      })
      AdMob.addListener('onRewarded', () => {
        if (onRewarded) onRewarded()
      })
      await AdMob.showRewardVideoAd()
    } catch (e) {
      console.warn('Rewarded ad failed:', e)
    }
  }
}
