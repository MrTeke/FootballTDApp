# 06 — Kule ve Düşman Spesifikasyonları

## KULELER

### src/data/towers.js

```javascript
export const TOWER_DATA = {
  bek: {
    name: 'Bek',
    label: 'B',
    cost: 50,
    color: 0x4488ff,
    range: 90,        // px
    damage: 15,
    fireRate: 1000,   // ms (1 saniyede 1 atış)
    projectileSpeed: 280,
    description: 'Geniş alan, hızlı ateş. Temel savunma.',
    pixelSize: 14,    // sprite boyutu referansı
  },

  stoper: {
    name: 'Stoper',
    label: 'S',
    cost: 100,
    color: 0xff8800,
    range: 75,
    damage: 35,
    fireRate: 1600,
    projectileSpeed: 220,
    description: 'Yüksek hasar, orta menzil. Güçlü ama yavaş.',
    pixelSize: 18,
  },

  kaleci: {
    name: 'Kaleci',
    label: 'K',
    cost: 200,
    color: 0xffdd00,
    range: 55,
    damage: 90,
    fireRate: 2200,
    projectileSpeed: 160,
    description: 'Çok yüksek hasar, kısa menzil. Kale önüne yerleştir.',
    pixelSize: 22,
  },
}
```

---

## Kule Karşılaştırma Tablosu

| Kule | Maliyet | Menzil | Hasar | Ateş Hızı | DPS* | Verimlilik |
|------|---------|--------|-------|-----------|------|-----------|
| Bek | 50₺ | 90px | 15 | 1.0/s | 15 | 0.30/₺ |
| Stoper | 100₺ | 75px | 35 | 0.63/s | 22 | 0.22/₺ |
| Kaleci | 200₺ | 55px | 90 | 0.45/s | 40.5 | 0.20/₺ |

*DPS = Damage Per Second

**Tasarım Prensibi:**
- Bek: En verimli, her durumda kullanılabilir
- Stoper: Grup kontrolü için iyi
- Kaleci: Güçlü düşmanlar için gerekli ama pahalı

---

## Kule Görsel Tasarımı (Pixel Art — Phaser Graphics)

```javascript
// Tower.js içinde drawBody() metodu

drawBek() {
  const g = this.graphics
  const x = 0, y = 0

  // Gölge
  g.fillStyle(0x000000, 0.3)
  g.fillEllipse(x + 2, y + 4, 18, 8)

  // Bacaklar
  g.fillStyle(0x2244aa)
  g.fillRect(x - 4, y + 4, 4, 8)
  g.fillRect(x + 1, y + 4, 4, 8)

  // Forma (gövde)
  g.fillStyle(0x4488ff)
  g.fillRect(x - 5, y - 4, 11, 10)

  // Kol (sağ)
  g.fillStyle(0x4488ff)
  g.fillRect(x + 5, y - 3, 4, 7)
  g.fillRect(x - 8, y - 3, 4, 7)

  // Baş
  g.fillStyle(0xffdab0)   // ten rengi
  g.fillRect(x - 4, y - 12, 9, 9)

  // Saç
  g.fillStyle(0x553311)
  g.fillRect(x - 4, y - 14, 9, 4)

  // Forma numarası (beyaz nokta)
  g.fillStyle(0xffffff)
  g.fillRect(x - 1, y, 3, 3)
}

drawStoper() {
  // Daha büyük, turuncu forma
  // Benzer yapı ama pixelSize büyük
}

drawKaleci() {
  // En büyük, sarı forma + eldiven detayı
}
```

---

## DÜŞMANLAR

### src/data/enemies.js

```javascript
export const ENEMY_DATA = {
  amateur: {
    name: 'Amatör',
    label: 'A',
    color: 0xff6666,
    hp: 60,
    speed: 55,        // px/saniye
    reward: 10,       // öldürünce kazanılan para
    pixelSize: 10,
    description: 'Yavaş, zayıf. Kaleleri doldurmak için.',
  },

  forward: {
    name: 'Forvet',
    label: 'F',
    color: 0xff9900,
    hp: 120,
    speed: 85,
    reward: 18,
    pixelSize: 12,
    description: 'Hızlı koşucu. Çok sayıda gelirse tehlikeli.',
  },

  striker: {
    name: 'Golcü',
    label: 'G',
    color: 0xcc00cc,
    hp: 350,
    speed: 35,
    reward: 40,
    pixelSize: 16,
    description: 'Yavaş ama çok dayanıklı. Uzun süre dayanır.',
  },
}
```

---

## Düşman Karşılaştırma Tablosu

| Düşman | HP | Hız | Ödül | Tehlike Türü |
|--------|----|-----|------|-------------|
| Amatör | 60 | 55 | 10₺ | Kalabalık grubu |
| Forvet | 120 | 85 | 18₺ | Hız avantajı |
| Golcü | 350 | 35 | 40₺ | Dayanıklılık |

---

## Düşman Görsel Tasarımı

```javascript
drawAmateur() {
  const g = this.graphics
  // Küçük, kırmızı formali figür
  // Ayak üstünde top detayı
  g.fillStyle(0xff6666)
  g.fillRect(-4, -8, 9, 9)   // Forma
  g.fillStyle(0xffdab0)
  g.fillRect(-3, -15, 7, 7)  // Baş
  // Top
  g.fillStyle(0xffffff)
  g.fillCircle(6, 4, 3)
  g.fillStyle(0x333333, 0.5)
  g.fillCircle(6, 4, 1.5)
}

drawForward() {
  // Daha hızlı görünen duruş (öne eğik)
  // Turuncu forma, daha uzun bacaklar
}

drawStriker() {
  // Büyük, kalın, mor forma
  // Vizör/kask detayı (agresif görünüm)
}
```

---

## HP Bar Sistemi

```javascript
updateHpBar() {
  const pct = this.hp / this.maxHp
  const barWidth = 20

  // Bar genişliği güncelle
  this.hpBar.width = barWidth * pct

  // Renk değişimi
  if (pct > 0.6) {
    this.hpBar.fillColor = 0x00ff44   // Yeşil
  } else if (pct > 0.3) {
    this.hpBar.fillColor = 0xffaa00   // Turuncu
  } else {
    this.hpBar.fillColor = 0xff2200   // Kırmızı
  }
}
```

---

## Mermi (Bullet) Sistemi

```javascript
// src/objects/Bullet.js

export default class Bullet {
  constructor(scene, fromX, fromY, target, damage) {
    this.scene = scene
    this.target = target
    this.damage = damage
    this.speed = 250   // px/s
    this.alive = true

    this.x = fromX
    this.y = fromY

    // Görsel: küçük beyaz/sarı daire
    this.graphic = scene.add.graphics()
    this.graphic.fillStyle(0xffffff)
    this.graphic.fillCircle(0, 0, 3)
    this.graphic.setPosition(fromX, fromY)

    scene.bullets = scene.bullets || []
    scene.bullets.push(this)
  }

  update(delta) {
    if (!this.alive || !this.target.alive) {
      this.destroy()
      return
    }

    const dx = this.target.x - this.x
    const dy = this.target.y - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 8) {
      // Hedefe ulaştı
      this.target.takeDamage(this.damage)
      this.destroy()
      return
    }

    // Hareket
    this.x += (dx / dist) * this.speed * (delta / 1000)
    this.y += (dy / dist) * this.speed * (delta / 1000)
    this.graphic.setPosition(this.x, this.y)
  }

  destroy() {
    this.alive = false
    this.graphic.destroy()
    if (this.scene.bullets) {
      this.scene.bullets = this.scene.bullets.filter(b => b !== this)
    }
  }
}
```

---

## Balancing Kılavuzu

### Oyun Çok Kolay → Şunları Dene:
- Düşman HP +%20
- Düşman speed +10
- Wave interval -200ms
- Başlangıç parası -50

### Oyun Çok Zor → Şunları Dene:
- Başlangıç parası +50
- Bek cost -10 (40₺ yap)
- Düşman HP -%15
- Wave interval +200ms

### Test Metodolojisi:
1. Her level'ı sadece Bek ile geç — imkânsız olmalı
2. Karışık strateji ile geçilebilmeli ama zor
3. Optimal strateji ile 3 yıldız alınabilmeli
4. Her level playtesti 3 kez yap, ortalama al
