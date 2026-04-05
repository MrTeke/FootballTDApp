# 02 — Oyun Tasarımı (Game Design Document)

## Konsept

**Tür:** Tower Defense  
**Tema:** Futbol — Top-down (kuşbakışı) saha görünümü  
**Görsel:** Pixel art  
**Platform:** iOS + Android  
**Hedef Kitle:** 13-35 yaş, futbol severleri  
**Oturum Süresi:** 3-8 dakika (hypercasual-mid arası)

---

## Temel Mekanik

```
Sen → Defans direktörüsün
Görev → Kaleyi rakip oyunculardan koru
Araç → Saha üzerine defans oyuncusu yerleştir
Kayıp → Her gol = 1 can kaybı (5 can → game over)
Kazanç → Tüm wave'leri geçince level tamamlandı
```

---

## Oyun Döngüsü

```
[Level Başlar]
      ↓
[Para ile Kule Yerleştir]
      ↓
[Wave Başlat]
      ↓
[Rakipler Kalene Doğru İlerler]
      ↓
[Kuleler Otomatik Ateşler]
      ↓
[Wave Biter → Bonus Para]
      ↓
[Sonraki Wave veya Level Bitti?]
      ↓
[Level Bitti → Yıldız Puanı → Sonraki Level]
```

---

## Saha Tasarımı

Ekran boyutu: **480 × 640 px**  
Saha alanı: **480 × 560 px** (üstte HUD için 80px)

```
┌─────────────────────────────┐  ← Ekran üstü (HUD)
│  💰 Para | ❤️ Can | 🌊 Wave  │
├─────────────────────────────┤
│  ▼ ▼ ▼   Rakipler Giriyor  │  ← Spawn noktaları (üst)
│                             │
│   [  G R E E N   P I T C H ]│
│                             │
│    [BEK]      [STOPER]      │  ← Yerleştirilen kuleler
│                             │
│        [KALECİ]             │
│                             │
│  ════════════════════════   │  ← Kale çizgisi
│          [ KALE ]           │
└─────────────────────────────┘
```

---

## Kule Sistemi

### Kule Yerleştirme Kuralları
- Grid üzerine tıklayarak yerleştir (40×40 px hücreler)
- Kale çizgisinin altına yerleştirilemez
- Spawn noktalarına yerleştirilemez
- Üst üste konulamaz
- Para yeterli değilse uyarı göster

### Kule Satma
- Kuleler satılabilir → %60 para iadesi
- Kuleye tıkla → "Sat" butonu çıkar

### Kule Geliştirme (Upgrade) — Sonraki Sürüm
- Level 2: +%50 hasar, +%20 menzil → 2x maliyet
- Level 3: +%100 hasar, +%40 menzil → 4x maliyet

---

## Düşman Sistemi

### Hareket Mekaniği: Serbest Navigasyon
Rakipler sabit yol izlemez. Kalaya en kısa yolu arar:
- Basit hedef odaklı hareket (düşmanlar birbirini iter)
- Kuleler engel değil, sadece hasar verir
- Her düşman kendi hızında ilerler
- Separation: Birbirinin üstüne yığılmaz

### Düşman Hedefleme
Kuleler en yakın düşmanı hedef alır (First targeting).  
İleride eklenecek: Strongest, Last, Weakest seçenekleri.

---

## Ekonomi Sistemi

### Başlangıç Parası
| Level | Başlangıç Parası |
|-------|-----------------|
| 1-5   | 150             |
| 6-10  | 200             |
| 11-15 | 250             |
| 16-20 | 300             |

### Para Kazanma
- Düşman öldürme: düşmanın `reward` değeri
- Wave tamamlama bonusu: Wave numarası × 25
- Level tamamlama: 100 sabit bonus

### Para Harcama
| Kule | Maliyet |
|------|---------|
| Bek | 50 |
| Stoper | 100 |
| Kaleci | 200 |

---

## Can Sistemi

- Başlangıç: **5 can**
- Gol yenince: -1 can + ekran sarsıntısı + ses efekti
- 0 can → Game Over ekranı
- Can artırma yok (basit tutalım)

---

## Yıldız Puanlama

Her level 0-3 yıldız ile değerlendirilir:

| Yıldız | Koşul |
|--------|-------|
| ⭐⭐⭐ | 5 can ile bitir |
| ⭐⭐ | 3-4 can ile bitir |
| ⭐ | 1-2 can ile bitir |
| — | Kaybedildi |

---

## Wave Yapısı

Her level'da 3-5 wave vardır.  
Wave sayısı ve yoğunluğu level'a göre artar.

### Wave Örneği (Level 1)
```
Wave 1: 5× Amatör (yavaş, zayıf)
Wave 2: 8× Amatör + 2× Forvet
Wave 3: 5× Forvet + 1× Golcü (mini boss)
```

### Spawn Mantığı
- Rakipler 0.8-1.5 saniye aralıklarla gelir
- Üst kenardan rastgele 5 noktadan çıkar
- Belli nokta yoğunlaşması level tasarımıyla kontrol edilir

---

## Level Progressionu (20 Level)

| Grup | Levellar | Tema | Yeni Özellik |
|------|----------|------|--------------|
| Başlangıç | 1-4 | Antrenman | Temel mekanik öğretimi |
| Amatör | 5-8 | İlk Sezon | Hızlı düşmanlar |
| Profesyonel | 9-12 | Lig Maçı | Dayanıklı düşmanlar |
| Elit | 13-16 | Avrupa | Çok yönlü saldırı |
| Şampiyonluk | 17-20 | Dünya Kupası | Karışık, yoğun |

---

## Özel Mekanikler (Sonraki Sürüme Bırak)

Bunları ilk versiyona koyma, süreci uzatır:
- ❌ Çok oyunculu
- ❌ Günlük görev
- ❌ Online leaderboard
- ❌ Özel yetenek (skill) sistemi
- ❌ Animasyonlu cut-scene'ler

Bunları yap:
- ✅ 20 level
- ✅ 3 kule tipi
- ✅ 3 düşman tipi
- ✅ Yıldız sistemi
- ✅ Reklam entegrasyonu
- ✅ Level seçim ekranı

---

## Ses Tasarımı

Ücretsiz ses kaynağı: https://freesound.org  
Arama terimleri: "crowd cheer", "whistle", "kick", "tackle"

| Olay | Ses |
|------|-----|
| Kule yerleştirme | Düdük sesi |
| Düşman öldürme | Tezahürat |
| Gol yeme | Hayal kırıklığı sesi |
| Level tamamlama | Galibiyet müziği |
| Wave başlangıcı | Düdük + tezahürat |
| Game Over | Islık + hayal kırıklığı |
