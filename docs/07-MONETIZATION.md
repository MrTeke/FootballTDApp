# 07 — Monetizasyon (Reklam Stratejisi)

## Genel Strateji

Oyun **ücretsiz** olacak. Gelir tamamen reklamdan.

**Neden ücretsiz + reklam?**
- $0.99 ödeme = kullanıcı direnci (özellikle TR'de)
- Ücretsiz = daha fazla indirme = daha fazla veri + viral potansiyel
- Doğru reklam yerleşimi ile $0.99'dan çok daha fazla kazanılabilir

---

## Reklam Tipleri

### 1. Interstitial (Tam Ekran Reklam)
- Ne zaman: Level tamamlanınca veya game over'da
- Sıklık: Her 2 levelda bir (çok sık gösterme)
- Süre: 5-30 saniye, kapatılabilir
- eCPM: $1-5

### 2. Rewarded Video (Ödüllü Video)
- Ne zaman: Game over ekranında "Devam Et" butonu
- Ödül: +50₺ para VEYA +1 can ile devam et
- Kullanıcı isteğiyle izler — düşük rahatsızlık
- eCPM: $5-20 (en değerli format)
- **Bu en önemli reklam tipi!**

### 3. Banner
- Ne zaman: Ana menü ve level seçim ekranında
- Konum: Ekranın altı (oyun içinde yok)
- eCPM: $0.3-1 (düşük ama pasif)

---

## Reklam Yerleşim Haritası

```
Ana Menü        → Banner (alt)
Level Seçim     → Banner (alt)
Oyun İçi        → REKLAM YOK (kullanıcı deneyimi bozulur)
Level Tamamlama → Interstitial (her 2 levelda bir)
Game Over       → Rewarded Video butonu ("Devam Et")
```

---

## Capacitor AdMob Kurulumu

### 1. Paketi Kur

```bash
npm install @capacitor-community/admob
npx cap sync
```

### 2. AdMob Hesabı Aç

- https://admob.google.com adresine git
- Hesap oluştur (ücretsiz)
- "Uygulama Ekle" → iOS ve Android için ayrı ayrı
- Her reklam tipi için Ad Unit ID al:
  - Banner ID
  - Interstitial ID
  - Rewarded Video ID

### 3. iOS Konfigürasyonu (ios/App/App/Info.plist)

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
```

### 4. Android Konfigürasyonu (android/app/src/main/AndroidManifest.xml)

```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"/>
```

---

## AdMob Kod Entegrasyonu

### src/systems/AdManager.js

```javascript
import { AdMob, BannerAdSize, BannerAdPosition, AdOptions } from '@capacitor-community/admob'

// Test ID'leri — geliştirme sırasında bunları kullan
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
}

// Canlı ID'ler — yayına alınca bunları kullan
const PROD_IDS = {
  banner: 'ca-app-pub-XXXX/XXXX',
  interstitial: 'ca-app-pub-XXXX/XXXX',
  rewarded: 'ca-app-pub-XXXX/XXXX',
}

const IS_PROD = false  // Yayına alınca true yap
const IDS = IS_PROD ? PROD_IDS : TEST_IDS

export const AdManager = {
  async initialize() {
    await AdMob.initialize({
      requestTrackingAuthorization: true,  // iOS için
      testingDevices: [],
      initializeForTesting: !IS_PROD,
    })
  },

  async showBanner() {
    await AdMob.showBanner({
      adId: IDS.banner,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    })
  },

  async hideBanner() {
    await AdMob.hideBanner()
  },

  async showInterstitial() {
    await AdMob.prepareInterstitial({ adId: IDS.interstitial })
    await AdMob.showInterstitial()
  },

  async showRewarded(onReward) {
    await AdMob.prepareRewardVideoAd({ adId: IDS.rewarded })

    // Ödül alındığında callback
    AdMob.addListener('onRewardedVideoAdReward', () => {
      onReward()
    })

    await AdMob.showRewardVideoAd()
  }
}
```

### Game Over Ekranında Kullanım

```javascript
// GameOverScene.js

async onContinuePressed() {
  await AdManager.showRewarded(() => {
    // Reklam izlendi → ödülü ver
    this.scene.start('GameScene', {
      level: this.levelNumber,
      bonusMoney: 50,    // +50₺ ile devam
      bonusLives: 1,     // +1 can ile devam
    })
  })
}
```

### Level Tamamlanınca

```javascript
// GameScene.js → levelComplete()

async levelComplete() {
  const stars = this.calculateStars()
  Storage.saveLevelStars(this.levelNumber, stars)

  // Her 2 levelda interstitial göster
  if (this.levelNumber % 2 === 0) {
    await AdManager.showInterstitial()
  }

  this.scene.stop('UIScene')
  this.scene.start('GameOverScene', { win: true, stars, level: this.levelNumber })
}
```

---

## Web'de Çalışırken (Geliştirme)

Capacitor plugin'leri sadece mobil cihazda çalışır.
Geliştirme sırasında web'de hata almamak için:

```javascript
// src/systems/AdManager.js başına ekle

const isMobile = window.Capacitor?.isNativePlatform() ?? false

export const AdManager = {
  async initialize() {
    if (!isMobile) return   // Web'de atla
    // ... gerçek kod
  },

  async showInterstitial() {
    if (!isMobile) {
      console.log('[AdManager] Interstitial (simüle)')
      return
    }
    // ... gerçek kod
  },

  async showRewarded(onReward) {
    if (!isMobile) {
      console.log('[AdManager] Rewarded (simüle) → ödül veriliyor')
      onReward()   // Web'de direkt ödülü ver (test için)
      return
    }
    // ... gerçek kod
  }
}
```

---

## Gelir Tahmini (Tekrar)

| Senaryo | Günlük Aktif | Aylık Gelir |
|---------|-------------|-------------|
| Kötü | 200 | ~$20-50 |
| Orta | 1.000 | ~$150-400 |
| İyi | 5.000 | ~$800-2.500 |

**Rewarded video eCPM özellikle TR'de $3-8 arasında.**  
1.000 rewarded gösterim = $3-8 → Günde 200 kullanıcı × %30 izleme = 60 gösterim = ~$0.25-0.50/gün

Asıl hedef: **Global trafik** çekmek. ABD/EU kullanıcısı 5-10x daha değerli.

---

## GDPR / Gizlilik (Zorunlu)

App Store ve Google Play reklam için gizlilik politikası ister.

1. **Privacy Policy** sayfası oluştur (ücretsiz: https://www.privacypolicygenerator.info)
2. App Store Connect'te URL'yi gir
3. Oyun içine "Gizlilik Politikası" linki ekle (menüde)

iOS 14+ için ATT (App Tracking Transparency) izin dialogu gerekiyor:
- `requestTrackingAuthorization: true` (AdMob initialize'da — zaten ekledik)
