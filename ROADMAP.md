# Football Defense — Development Roadmap

Son güncelleme: 2026-04-05

---

## ✅ TAMAMLANDI

### Faz 1 — Proje Kurulumu
- [x] `package.json` — Phaser 3.60 + Vite 5
- [x] `vite.config.js` — `base: './'`, Capacitor stub plugin (dev server), externals (build)
- [x] `index.html` — Press Start 2P font, `#game-container`
- [x] `capacitor.config.json` — appId: `com.footballdefense.game`
- [x] `CAPACITOR-SETUP.md` — iOS kurulum rehberi, olası sorunlar
- [x] `docs/` — 00–09 tüm dokümantasyon dosyaları yerleştirildi

### Faz 2 — Veri Katmanı
- [x] `src/config.js` — GAME_CONFIG, GRID (12×11, 40px), COLORS, GOAL_X/Y
- [x] `src/data/towers.js` — Defender / Stopper / Goalkeeper stats
- [x] `src/data/enemies.js` — Amateur / Forward / Striker stats
- [x] `src/data/levels.js` — 20 levelin tamamı + SPAWN_CONFIGS

### Faz 3 — Yardımcı Araçlar
- [x] `src/utils/EventBus.js` — Singleton emit/on/off
- [x] `src/utils/Storage.js` — localStorage (stars, locks, adBonus)

### Faz 4 — Oyun Nesneleri
- [x] `src/objects/Grid.js` — occupy/free/isFree/getPixelPos/pixelToGrid
- [x] `src/objects/Bullet.js` — move to target, deal damage, destroy
- [x] `src/objects/Tower.js` — pixel art (3 types), range, fire, sell button
- [x] `src/objects/Enemy.js` — pixel art (3 types), steering, separation, HP bar

### Faz 5 — Sistemler
- [x] `src/systems/EconomyManager.js` — spend/earn money, EventBus emit
- [x] `src/systems/WaveManager.js` — spawn queue, wave completion, bonus
- [x] `src/systems/AdsService.js` — Capacitor AdMob (banner, interstitial, rewarded)

### Faz 6 — Sahneler
- [x] `src/scenes/BootScene.js` — loading bar → MenuScene
- [x] `src/scenes/MenuScene.js` — animated ball, PLAY button, sound toggle
- [x] `src/scenes/LevelSelectScene.js` — 4×5 grid, 20 levels, lock system, stars
- [x] `src/scenes/GameScene.js` — pitch drawing, tower placement, wave management, ad bonus
- [x] `src/scenes/UIScene.js` — HUD (5 hearts, money tween), wave overlay, tower info panel, bottom panel
- [x] `src/scenes/GameOverScene.js` — star animation, ad buttons (retry bonus / next level bonus)

### Faz 7 — Test & İlk Düzeltmeler (2026-03-19)
- [x] `npm run dev` çalıştırıldı, oyun tarayıcıda açıldı
- [x] AdMob dosyası `AdsService.js` olarak yeniden adlandırıldı (ad blocker fix)
- [x] UIScene'e ☰ menü butonu eklendi (LevelSelectScene'e dönüş)
- [x] Fail ekranına reklam → +$50 bonus özelliği eklendi
- [x] Tüm UI metinleri İngilizce'ye çevrildi
- [x] Para birimi $ olarak güncellendi
- [x] Balancing: Defender dmg 15→20, Forward HP 120→95
- [x] Level 7 yeniden dengelendi
- [x] Level 8–20 yeniden dengelendi (startMoney artırıldı, wave 1 yoğunluğu azaltıldı)

### Faz 8 — Balancing Testi Level 1–14 (2026-03-20)
- [x] Level 1–8 test edildi, sorun yok
- [x] Level 9 Wave 4 fix: interval 950→1150ms, Forward 6→4 (Striker kalabalığında Forward sızıyordu)
- [x] Level 14 Wave 4–5 hafif zorlaştırıldı:
  - Wave 4: interval 840→800ms, Striker 11→13, Forward 10→12
  - Wave 5: interval 670→630ms, Forward 18→21, Striker 8→10

### Faz 9 — Balancing Testi Level 15–20 (2026-04-05)
- [x] Level 15–18 test edildi, sorun yok
- [x] Level 19–20 wave 3 sonrası hafif zorlaştırıldı (bitiş baskısı):
  - Level 19 Wave 4: interval 750→720ms
  - Level 19 Wave 5: interval 600→570ms
  - Level 20 Wave 4: interval 820→790ms
  - Level 20 Wave 5: interval 650→620ms
  - Level 20 Wave 6: interval 580→550ms

---

## 🔜 YAPILACAKLAR

### ~~Öncelik 1 — Ses~~ ✅ TAMAMLANDI (2026-04-05)
- [x] `src/systems/SoundManager.js` oluşturuldu (Web Audio API, sıfır harici dosya)
- [x] 8 ses sentezlendi: shoot, enemy_death, goal_conceded, wave_start, wave_complete, level_win, tower_place, tower_sell
- [x] EventBus emit'leri eklendi (Tower.js, GameScene.js, UIScene.js, MenuScene.js)
- [x] MenuScene sound toggle gerçek ses kontrolüne bağlandı

### Öncelik 3 — Görsel Geliştirmeler (Opsiyonel)
- [x] Spawn noktalarında kırmızı üçgen pulse animasyonu
- [x] Tower seçiminde grid highlight
- [ ] Enemy ölünce patlama efekti
- [x] Level geçişlerinde fade animasyonu

### Öncelik 4 — Capacitor iOS Build
- [ ] `npm run build` → `npx cap sync` (Mac gerekli)
- [ ] iOS: Xcode'da test (Mac gerekli)
- [x] AdMob gerçek App ID'leri `AdsService.js` ve `capacitor.config.json`'a girildi
- [x] `AdsService.js`'de `initializeForTesting: false` yapıldı
- [ ] ATT izin dialog'u testi (Mac gerekli)

### Öncelik 5 — App Store
- [ ] `docs/08-APPSTORE.md` takip et
- [ ] App ikonları (1024×1024 iOS)
- [x] Store açıklamaları (EN) — docs/appstore-listing.md
- [ ] Screenshots (6.5" iPhone, Mac gerekli)
- [x] Privacy policy URL — https://mrteke.github.io/FootballTDApp/privacy-policy.html

---

## 📁 Proje Yapısı (Güncel)

```
FootballTDApp/
├── docs/                    ← 00-09 documentation
├── public/assets/           ← Audio files go here
├── src/
│   ├── main.js
│   ├── config.js
│   ├── scenes/              ← 6 scenes (all done)
│   ├── objects/             ← Tower, Enemy, Bullet, Grid
│   ├── systems/             ← WaveManager, EconomyManager, AdsService
│   ├── data/                ← towers, enemies, levels (20 levels)
│   └── utils/               ← EventBus, Storage
├── index.html
├── package.json
├── vite.config.js
├── capacitor.config.json
├── CAPACITOR-SETUP.md
└── ROADMAP.md               ← This file
```

---

## 🐛 Bilinen Riskler / Dikkat Edilecekler

| Risk | Açıklama | Çözüm |
|------|----------|-------|
| EventBus leak | Scene geçişinde handler temizlenmezse birikiyor | `UIScene.shutdown()` mevcut, `EventBus.clear()` çağrılıyor |
| Bullet → dead target | Target ölünce bullet yönelemiyor | `Bullet.update()` içinde `!target.alive` kontrolü mevcut |
| Wave completion | `pendingEnemies` senkron değil | `WaveManager.checkWaveComplete()` her frame çalışıyor |
| iOS safe area | iPhone X çentiği | `CAPACITOR-SETUP.md` bölüm 5'te çözüm mevcut |
| Ad blocker | "AdManager" isimli dosyalar engelleniyor | Dosya `AdsService.js` olarak adlandırıldı |
