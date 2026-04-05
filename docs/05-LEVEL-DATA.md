# 05 — Level Verileri

## Veri Şeması

```javascript
// src/data/levels.js

export const LEVELS = {
  1: {
    name: "Antrenman 1",
    group: "Başlangıç",
    startMoney: 150,
    lives: 5,
    spawnPoints: [
      { x: 80,  y: 80 },
      { x: 240, y: 80 },
      { x: 400, y: 80 },
    ],
    waves: [
      {
        id: 1,
        interval: 1500,    // ms — düşmanlar arası süre
        enemies: [
          { type: 'amateur', count: 5 }
        ]
      },
      {
        id: 2,
        interval: 1200,
        enemies: [
          { type: 'amateur', count: 6 },
          { type: 'forward', count: 2 }
        ]
      },
      {
        id: 3,
        interval: 1000,
        enemies: [
          { type: 'forward', count: 4 },
          { type: 'striker', count: 1 }  // mini boss
        ]
      }
    ]
  },
  // ... diğer levellar
}
```

---

## Düşman Tipi Referansı

| Kod | İsim | Açıklama |
|-----|------|----------|
| `amateur` | Amatör | Yavaş, zayıf — tutorial |
| `forward` | Forvet | Hızlı, orta güç |
| `striker` | Golcü | Yavaş ama çok dayanıklı |

---

## 20 Level Tam Tanımı

### GRUP 1 — BAŞLANGIÇ (Level 1-4)

**Level 1 — Antrenman 1**
- Para: 150 | Can: 5 | Wave: 3
- Spawn: 3 nokta (sol, orta, sağ üst)
- Wave 1: 5× Amatör (interval: 1500ms)
- Wave 2: 7× Amatör (interval: 1300ms)
- Wave 3: 8× Amatör + 1× Forvet (interval: 1200ms)

**Level 2 — Antrenman 2**
- Para: 150 | Can: 5 | Wave: 3
- Spawn: 3 nokta
- Wave 1: 6× Amatör (interval: 1400ms)
- Wave 2: 5× Amatör + 3× Forvet (interval: 1200ms)
- Wave 3: 8× Forvet (interval: 1100ms)

**Level 3 — Antrenman 3**
- Para: 150 | Can: 5 | Wave: 4
- Spawn: 4 nokta (ek: orta-sol)
- Wave 1: 8× Amatör (interval: 1200ms)
- Wave 2: 5× Forvet + 3× Amatör (interval: 1100ms)
- Wave 3: 8× Forvet (interval: 1000ms)
- Wave 4: 6× Forvet + 1× Golcü (interval: 1000ms)

**Level 4 — İlk Maç**
- Para: 150 | Can: 5 | Wave: 4
- Spawn: 4 nokta
- Wave 1: 8× Amatör + 2× Forvet (interval: 1100ms)
- Wave 2: 6× Forvet + 2× Amatör (interval: 1000ms)
- Wave 3: 8× Forvet (interval: 900ms)
- Wave 4: 4× Forvet + 2× Golcü (interval: 1000ms)

---

### GRUP 2 — AMATÖR LİG (Level 5-8)

**Level 5 — Sezon Başı**
- Para: 200 | Can: 5 | Wave: 4
- Spawn: 4 nokta
- Wave 1: 10× Amatör + 3× Forvet (interval: 1000ms)
- Wave 2: 8× Forvet (interval: 900ms)
- Wave 3: 5× Forvet + 2× Golcü (interval: 1000ms)
- Wave 4: 10× Forvet + 1× Golcü (interval: 800ms)

**Level 6 — Deplasman**
- Para: 200 | Can: 5 | Wave: 4
- Spawn: 5 nokta (tüm üst kenar)
- Wave 1: 8× Forvet + 5× Amatör (interval: 900ms)
- Wave 2: 10× Forvet (interval: 850ms)
- Wave 3: 6× Forvet + 3× Golcü (interval: 900ms)
- Wave 4: 12× Forvet + 2× Golcü (interval: 750ms)

**Level 7 — Kritik Maç**
- Para: 200 | Can: 5 | Wave: 5
- Spawn: 5 nokta
- Wave 1: 10× Forvet (interval: 900ms)
- Wave 2: 8× Forvet + 4× Amatör (interval: 800ms)
- Wave 3: 5× Golcü (interval: 1200ms)
- Wave 4: 12× Forvet (interval: 750ms)
- Wave 5: 8× Forvet + 2× Golcü (interval: 700ms)

**Level 8 — Derbi**
- Para: 200 | Can: 5 | Wave: 5
- Spawn: 5 nokta
- Wave 1: 12× Forvet (interval: 800ms)
- Wave 2: 10× Forvet + 3× Golcü (interval: 800ms)
- Wave 3: 15× Forvet (interval: 700ms)
- Wave 4: 8× Golcü (interval: 1000ms)
- Wave 5: 10× Forvet + 4× Golcü (interval: 700ms)

---

### GRUP 3 — PROFESYONEL LİG (Level 9-12)

**Level 9 — 1. Lig**
- Para: 250 | Can: 5 | Wave: 5
- Spawn: 5 nokta
- Wave 1: 12× Forvet + 5× Amatör (interval: 750ms)
- Wave 2: 10× Forvet + 5× Golcü (interval: 800ms)
- Wave 3: 15× Forvet (interval: 650ms)
- Wave 4: 6× Golcü + 8× Forvet (interval: 750ms)
- Wave 5: 15× Forvet + 3× Golcü (interval: 600ms)

**Level 10 — Şampiyonlar Kapısı**
- Para: 250 | Can: 5 | Wave: 5
- Spawn: 5 nokta
- Wave 1: 15× Forvet (interval: 700ms)
- Wave 2: 8× Golcü + 10× Forvet (interval: 750ms)
- Wave 3: 18× Forvet (interval: 600ms)
- Wave 4: 10× Golcü (interval: 800ms)
- Wave 5: 20× Forvet + 4× Golcü (interval: 550ms)

**Level 11 — Avrupa Gecesi**
- Para: 250 | Can: 5 | Wave: 5
- Spawn: 5 nokta
- Notlar: Düşmanlar daha hızlı (+10% speed modifier tüm tiplere)
- Wave 1: 15× Forvet + 5× Golcü (interval: 700ms)
- Wave 2: 20× Forvet (interval: 600ms)
- Wave 3: 12× Golcü (interval: 800ms)
- Wave 4: 20× Forvet + 5× Golcü (interval: 550ms)
- Wave 5: 15× Golcü + 10× Forvet (interval: 650ms)

**Level 12 — Yarı Final**
- Para: 250 | Can: 5 | Wave: 5
- Spawn: 5 nokta
- Wave 1: 18× Forvet + 8× Amatör (interval: 650ms)
- Wave 2: 15× Forvet + 8× Golcü (interval: 700ms)
- Wave 3: 25× Forvet (interval: 550ms)
- Wave 4: 12× Golcü + 10× Forvet (interval: 650ms)
- Wave 5: 20× Forvet + 6× Golcü (interval: 500ms)

---

### GRUP 4 — ELİT (Level 13-16)

**Level 13-16** için genel pattern:
- Para: 300 | Can: 5 | Wave: 5
- Her wave daha yoğun (önceki gruba göre +20% düşman)
- Spawn intervalları 450-600ms arasında
- Golcü oranı artıyor

---

### GRUP 5 — ŞAMPİYONLUK (Level 17-20)

**Level 17-19** için genel pattern:
- Para: 300 | Can: 5 | Wave: 5-6
- Tüm düşman tipleri karışık
- Spawn intervalları 350-500ms
- Wave aralarında kısa (5 saniye) mola

**Level 20 — Dünya Kupası Finali**
- Para: 300 | Can: 5 | Wave: 6
- Spawn: 5 nokta (hepsi aktif)
- Wave 1: 20× Forvet + 10× Amatör (interval: 600ms)
- Wave 2: 15× Forvet + 10× Golcü (interval: 650ms)
- Wave 3: 25× Forvet (interval: 450ms)
- Wave 4: 15× Golcü (interval: 700ms)
- Wave 5: 25× Forvet + 8× Golcü (interval: 400ms)
- Wave 6 (FINAL): 20× Forvet + 15× Golcü (interval: 350ms)

---

## Spawn Noktaları Koordinatları

Saha: 480px genişlik, oyun alanı Y=80'den başlıyor (HUD)

```javascript
export const SPAWN_CONFIGS = {
  '3-points': [
    { x: 100, y: 85 },
    { x: 240, y: 85 },
    { x: 380, y: 85 },
  ],
  '4-points': [
    { x: 80,  y: 85 },
    { x: 185, y: 85 },
    { x: 295, y: 85 },
    { x: 400, y: 85 },
  ],
  '5-points': [
    { x: 60,  y: 85 },
    { x: 150, y: 85 },
    { x: 240, y: 85 },
    { x: 330, y: 85 },
    { x: 420, y: 85 },
  ],
}
```

---

## Balancing Notları

Level zorluğunu ayarlamak için bu değerleri değiştir:

| Parametre | Etki |
|-----------|------|
| `interval` düşür | Daha zor (düşmanlar daha hızlı gelir) |
| `count` artır | Daha zor (daha fazla düşman) |
| `startMoney` artır | Daha kolay (daha fazla kule alabilirsin) |
| Golcü oranı artır | Daha zor (dayanıklı düşman) |
| Forvet oranı artır | Daha zor (hızlı düşman) |

**Altın kural:** Her level 30-60 saniye sürmeli. Çok kısa = tatminsiz, çok uzun = sıkıcı.
