# 04 — UI Tasarımı

## Ekranlar Listesi

```
1. Boot / Yükleme Ekranı
2. Ana Menü
3. Level Seçim
4. Oyun İçi HUD
5. Wave Duyuru Overlay
6. Kule Seçim Paneli (alt bar)
7. Kule Detay Popup (tıklanınca)
8. Kazandın / Kaybettin Ekranı
9. Ayarlar
```

---

## Renk Paleti

```css
/* Ana renkler */
--pitch-green:    #2d7a1b;
--pitch-dark:     #1e5a10;
--ui-dark:        #0a0a1a;
--ui-panel:       #111128;
--ui-border:      #2a3a5a;

/* Aksan renkler */
--gold:           #ffd700;
--green-neon:     #7fff00;
--red-alert:      #ff4444;
--blue-bek:       #4488ff;
--orange-stoper:  #ff8800;
--yellow-kaleci:  #ffdd00;

/* Metin */
--text-primary:   #ffffff;
--text-secondary: #aaaacc;
--text-muted:     #555577;
```

---

## Font

Pixel art his için:
- **Başlık:** `Press Start 2P` (Google Fonts — retro pixel font)
- **HUD sayılar:** `Press Start 2P` küçük boyutta
- **Açıklamalar:** Monospace veya `Courier New`

```html
<!-- index.html <head> içine ekle -->
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

---

## 1. HUD (Oyun İçi Üst Bar)

```
┌──────────────────────────────────────────┐
│ 💰 250    ❤️❤️❤️❤️❤️    🌊 2/5   ▶ WAVE │
└──────────────────────────────────────────┘
```

**Ölçüler:** Genişlik 480px, Yükseklik 60px, sahanın üstünde

**Elemanlar:**
- Para göstergesi (sol) — para değişince kısa animasyon
- Can göstergesi (orta sol) — kalp ikonları
- Wave sayacı (orta sağ) — "2/5" formatı
- Wave başlat butonu (sağ) — wave aktifken pasif görünür

**UIScene.js örneği:**
```javascript
create(data) {
  this.gameScene = data.gameScene

  // Para
  this.moneyText = this.add.text(10, 20, '💰 150', {
    fontFamily: '"Press Start 2P"',
    fontSize: '10px',
    color: '#ffd700'
  })

  // Canlar (kalp ikonları)
  this.hearts = []
  for (let i = 0; i < 5; i++) {
    const h = this.add.text(150 + i * 22, 20, '❤️', { fontSize: '14px' })
    this.hearts.push(h)
  }

  // Wave bilgisi
  this.waveText = this.add.text(310, 20, 'WAVE 0/3', {
    fontFamily: '"Press Start 2P"',
    fontSize: '8px',
    color: '#aaaacc'
  })

  // Wave butonu
  this.waveBtn = this.add.text(410, 15, '▶ BAŞLAT', {
    fontFamily: '"Press Start 2P"',
    fontSize: '8px',
    color: '#7fff00',
    backgroundColor: '#1a3a0a',
    padding: { x: 8, y: 6 }
  }).setInteractive().on('pointerdown', () => {
    EventBus.emit('WAVE_START_REQUESTED')
  })

  // EventBus dinle
  EventBus.on('ECONOMY_CHANGED', (money) => this.updateMoney(money))
  EventBus.on('LIVES_CHANGED', (lives) => this.updateLives(lives))
  EventBus.on('WAVE_CHANGED', (wave) => this.updateWave(wave))
}

updateMoney(amount) {
  this.moneyText.setText(`💰 ${amount}`)
  // Kısa animasyon: sarı flash
  this.tweens.add({
    targets: this.moneyText,
    scaleX: 1.2, scaleY: 1.2,
    duration: 100, yoyo: true
  })
}

updateLives(lives) {
  this.hearts.forEach((h, i) => {
    h.setAlpha(i < lives ? 1 : 0.2)
  })
}
```

---

## 2. Kule Seçim Paneli (Alt Bar)

```
┌────────────────────────────────────────────────┐
│  [BEK 50₺]  [STOPER 100₺]  [KALECİ 200₺]  [?] │
└────────────────────────────────────────────────┘
```

**Ölçüler:** Genişlik 480px, Yükseklik 80px, ekranın altında  
**Sabit kalır** — oyun sahası 60px üst + 80px alt = 500px saha alanı

**Kule Butonu Tasarımı:**
```
┌──────────┐
│  [İKON]  │  ← Pixel art kule görseli (32×32)
│   BEK    │  ← İsim
│   50₺   │  ← Maliyet (altın rengi)
└──────────┘
Seçilince: parlak border + hafif yeşil bg
Para yoksa: soluk/disabled görünüm
```

---

## 3. Wave Duyuru Overlay

Wave başlayınca 2 saniye görünür, sonra kaybolur:

```
┌─────────────────────────┐
│                         │
│    ⚽ WAVE 2 BAŞLIYOR!  │
│    Hazır ol...          │
│                         │
└─────────────────────────┘
```

Stil: Yarı şeffaf siyah bg, altın border, büyük metin, fade in/out animasyonu

---

## 4. Kule Tıklama Popup

Yerleştirilmiş bir kuleye tıklanınca:

```
        ┌──────────────┐
        │ 🛡️ STOPER    │
        │ Hasar: 35    │
        │ Menzil: 65   │
        │ [SAT: 60₺]   │
        └──────────────┘
              │
           [KULE]
```

**Davranış:**
- Kuleye yakın açılır (üstünde veya yanında)
- Başka yere tıklanınca kapanır
- "Sat" butonuna basınca EventBus'a emit

---

## 5. Level Tamamlandı Ekranı

```
┌──────────────────────────────┐
│                              │
│    ⚽ LEVEL 3 TAMAMLANDI!    │
│                              │
│         ⭐ ⭐ ⭐              │
│                              │
│   Gol Yenilen: 2             │
│   Wave Tamamlanan: 3/3       │
│                              │
│  [ANA MENÜ]  [SONRAKI LEVEL] │
└──────────────────────────────┘
```

---

## 6. Game Over Ekranı

```
┌──────────────────────────────┐
│                              │
│         😔 DÜŞMAN KAZANDI    │
│                              │
│      Kaleyi Koruyamadın!     │
│                              │
│  Wave: 2/3    Can: 0/5       │
│                              │
│  [ANA MENÜ]    [TEKRAR]      │
│                              │
│    📺 REKLAM İZLE → +50₺    │ ← AdMob rewarded reklam
└──────────────────────────────┘
```

---

## 7. Level Seçim Ekranı

Grid görünümü (4 sütun × 5 satır = 20 level):

```
┌────┬────┬────┬────┐
│ ⭐⭐⭐│ ⭐⭐ │ ⭐  │ 🔒 │
│  1 │  2 │  3 │  4 │
├────┼────┼────┼────┤
│ 🔒 │ 🔒 │ 🔒 │ 🔒 │
│  5 │  6 │  7 │  8 │
...
```

- Tamamlanan levellar yıldız gösterir
- Kilitli levellar 🔒 ikonu + soluk görünüm
- Tıklanınca GameScene'e geçer

---

## 8. Ana Menü

```
┌──────────────────────────────┐
│                              │
│    ⚽ FOOTBALL DEFENSE ⚽    │
│                              │
│     [animasyonlu logo]       │
│                              │
│         [ OYNA ]             │
│       [ AYARLAR ]            │
│                              │
│   🔊 Ses  🏆 En Yüksek Skor  │
└──────────────────────────────┘
```

---

## Responsive / Mobile Notlar

Oyun 480×640 sabit çözünürlükte çalışır.  
Capacitor ile mobil'e taşınınca `Phaser.Scale.FIT` + `CENTER_BOTH` ile her ekrana sığar.

Dokunmatik için:
- Butonlar minimum **44×44 px** (Apple guideline)
- Tüm `pointerdown` eventleri dokunmayla da çalışır (Phaser varsayılanı)
- Zoom/pinch devre dışı bırak:

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```
