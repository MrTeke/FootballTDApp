# 01 — Teknik Kurulum

## Gereksinimler

Bilgisayarında şunların kurulu olması gerekiyor:

- **Node.js** v18+ → https://nodejs.org
- **VS Code** → https://code.visualstudio.com
- **Git** → https://git-scm.com

Kurulu mu kontrol et:
```bash
node --version   # v18.x.x çıkmalı
npm --version    # 9.x.x çıkmalı
```

---

## Proje Kurulumu (Adım Adım)

### 1. Proje klasörünü oluştur

```bash
mkdir football-defense
cd football-defense
```

### 2. Vite + Vanilla JS ile başlat

```bash
npm create vite@latest . -- --template vanilla
npm install
```

### 3. Phaser.js ekle

```bash
npm install phaser
```

### 4. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` aç. Değişiklik yaptıkça otomatik yenilenir.

---

## Klasör Yapısı

```
football-defense/
├── docs/                    ← Bu MD dosyaları buraya koy
├── public/
│   └── assets/
│       ├── sprites/         ← Pixel art görseller
│       │   ├── players/
│       │   ├── enemies/
│       │   └── ui/
│       ├── audio/           ← Ses efektleri
│       └── tilemaps/        ← Saha tile verileri
├── src/
│   ├── main.js              ← Giriş noktası
│   ├── config.js            ← Oyun konfigürasyonu
│   ├── scenes/
│   │   ├── BootScene.js     ← Asset yükleme
│   │   ├── MenuScene.js     ← Ana menü
│   │   ├── GameScene.js     ← Ana oyun sahnesi
│   │   ├── UIScene.js       ← HUD (üst katman)
│   │   └── GameOverScene.js ← Oyun sonu
│   ├── objects/
│   │   ├── Tower.js         ← Kule sınıfı
│   │   ├── Enemy.js         ← Düşman sınıfı
│   │   ├── Bullet.js        ← Mermi sınıfı
│   │   └── Grid.js          ← Yerleştirme grid'i
│   ├── systems/
│   │   ├── WaveManager.js   ← Wave/dalga yönetimi
│   │   ├── EconomyManager.js← Para sistemi
│   │   ├── Pathfinding.js   ← Düşman yol bulma
│   │   └── LevelManager.js  ← Level yükleme
│   ├── data/
│   │   ├── towers.js        ← Kule istatistikleri
│   │   ├── enemies.js       ← Düşman istatistikleri
│   │   └── levels.js        ← 20 level verisi
│   └── utils/
│       ├── EventBus.js      ← Sahne arası iletişim
│       └── Storage.js       ← LocalStorage (kayıt)
├── index.html
├── package.json
└── vite.config.js
```

---

## VS Code Eklentileri (Kur)

VS Code'u aç → Extensions (Ctrl+Shift+X) → şunları kur:

| Eklenti | Amaç |
|---------|------|
| **ESLint** | Kod kalitesi |
| **Prettier** | Otomatik formatlama |
| **JavaScript (ES6) code snippets** | Hızlı yazım |
| **Path Intellisense** | Dosya yolu tamamlama |
| **GitLens** | Git takibi |

---

## vite.config.js

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',          // Capacitor için gerekli
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5173,
    open: true,        // Otomatik tarayıcı aç
  }
})
```

---

## src/main.js (Başlangıç)

```javascript
import Phaser from 'phaser'
import { GAME_CONFIG } from './config.js'
import BootScene from './scenes/BootScene.js'
import MenuScene from './scenes/MenuScene.js'
import GameScene from './scenes/GameScene.js'
import UIScene from './scenes/UIScene.js'
import GameOverScene from './scenes/GameOverScene.js'

const config = {
  ...GAME_CONFIG,
  scene: [BootScene, MenuScene, GameScene, UIScene, GameOverScene]
}

new Phaser.Game(config)
```

---

## src/config.js

```javascript
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

export const GRID = {
  cols: 12,
  rows: 16,
  cellSize: 40,
  offsetX: 0,
  offsetY: 0,
}

export const COLORS = {
  pitch: 0x2d7a1b,
  pitchAlt: 0x2a7018,
  lines: 0xffffff,
  uiBg: 0x0a0a1a,
  gold: 0xffd700,
  red: 0xff4444,
  green: 0x7fff00,
}
```

---

## Capacitor Kurulumu (Mobile için — Sonra Yapılacak)

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npx cap init "Football Defense" "com.yourname.footballdefense"

# Build al
npm run build

# Platform ekle
npx cap add ios
npx cap add android

# Sync
npx cap sync

# iOS'ta aç (Mac gerekli)
npx cap open ios

# Android'de aç
npx cap open android
```

---

## Pixel Art Asset'leri Nereden Alırsın

Ücretsiz kaynaklar:
- **itch.io** → https://itch.io/game-assets/free → "pixel soccer" ara
- **OpenGameArt** → https://opengameart.org → "football" ara
- **Kenney.nl** → https://kenney.nl/assets → spor paketleri

Satın alınabilir (kaliteli):
- **Craftpix** → https://craftpix.net → ~$15-30/paket
- **GameDevMarket** → https://www.gamedevmarket.net

İlk prototip için: Phaser'ın **Graphics API** ile renk kodlu dikdörtgen/daireler kullan.
Görsel asset'leri sonra entegre edersin.
