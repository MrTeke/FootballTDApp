# Capacitor Mobile Kurulum Kılavuzu

## 1. Capacitor Kurulumu

```bash
# Capacitor core
npm install @capacitor/core @capacitor/cli

# Platformlar
npm install @capacitor/ios

# AdMob plugin
npm install @capacitor-community/admob

# Capacitor başlat (capacitor.config.json zaten mevcut, --yes flag ile atla)
npx cap init "Futbol Savunma" "com.footballdefense.game" --web-dir dist
```

---

## 2. Build + Sync

```bash
# Web build al
npm run build

# iOS platform ekle (ilk kez)
npx cap add ios

# Her build sonrası sync et
npx cap sync
```

---

## 3. iOS — Info.plist Değişiklikleri

Dosya: `ios/App/App/Info.plist`

```xml
<!-- Portrait only -->
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
</array>
<key>UISupportedInterfaceOrientations~ipad</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
</array>

<!-- AdMob App ID -->
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>

<!-- ATT (App Tracking Transparency) — iOS 14+ zorunlu -->
<key>NSUserTrackingUsageDescription</key>
<string>Sana daha iyi reklamlar göstermek için izleme izni istiyoruz.</string>

<!-- Safe Area için -->
<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>
```

iOS'ta açmak için (Mac gerekli):
```bash
npx cap open ios
# Xcode açılır → Team seç → Run
```

---

## 4. AdMob Test ID'leri (Geliştirme Sırasında Kullan)

| Format      | Test ID |
|-------------|---------|
| Banner      | `ca-app-pub-3940256099942544/6300978111` |
| Interstitial| `ca-app-pub-3940256099942544/1033173712` |
| Rewarded    | `ca-app-pub-3940256099942544/5224354917` |

`src/systems/AdManager.js` dosyasındaki `adId` alanlarını canlıya geçmeden önce gerçek ID'lerle değiştir.

---

## 6. Olası Sorunlar ve Çözümleri

### CORS Hatası (web'de geliştirirken)
- Sorun: `vite preview` çalıştırırken cross-origin hatası.
- Çözüm: `vite.config.js` içinde `server.cors: true` ekle. Üretimde sorun olmaz.

### Safe Area (iPhone X ve sonrası çentik)
- Sorun: Oyun ekranı çentiğin altına kayıyor.
- Çözüm: `index.html` içine ekle:
```html
<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0">
```
ve CSS'e:
```css
body { padding: env(safe-area-inset-top) env(safe-area-inset-right)
              env(safe-area-inset-bottom) env(safe-area-inset-left); }
```

### AdMob "No Fill" Hatası
- Sorun: Reklam dolmadığında hata fırlatıyor.
- Çözüm: `AdManager.js` içindeki tüm AdMob çağrıları try/catch içinde, sorun yok.

### iOS Build "Signing" Hatası
- Sorun: Xcode'da "No provisioning profile" hatası.
- Çözüm: Xcode → Signing & Capabilities → Team seç → "Automatically manage signing" aç.

### Capacitor Sync Sonrası Beyaz Ekran
- Sorun: `npm run build` sonrası `npx cap sync` yapıldı ama beyaz ekran.
- Çözüm: `vite.config.js` içinde `base: './'` olduğundan emin ol (zaten ayarlı).

---

## 7. Canlıya Alma Checklist

- [ ] AdMob hesabı oluştur: https://admob.google.com
- [ ] Gerçek App ID'leri `capacitor.config.json` ve `AdManager.js`'e ekle
- [ ] `initializeForTesting: false` yap (`AdManager.js` satır 16)
- [ ] iOS: App Store Connect'te uygulama oluştur
- [ ] ATT izin dialog'unu test et (iOS 14+)
- [ ] GDPR banner gerekiyorsa ekle (Avrupa pazarı için)
