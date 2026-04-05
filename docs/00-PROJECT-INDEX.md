# ⚽ Football Defense — Proje Dokümantasyonu

## Bu Klasör Hakkında

Bu klasördeki MD dosyaları, **Football Defense** oyununun baştan sona geliştirilmesi için
gereken tüm teknik ve tasarım belgelerini içerir. VS Code içinde Claude ile çalışırken
bu dosyaları referans alarak geliştirme yapabilirsin.

---

## Dosya Listesi

| Dosya | İçerik |
|-------|--------|
| `00-PROJECT-INDEX.md` | Bu dosya — genel bakış ve navigasyon |
| `01-TECHNICAL-SETUP.md` | Kurulum, araçlar, klasör yapısı |
| `02-GAME-DESIGN.md` | Oyun mekaniği, level tasarımı, düşman/kule sistemleri |
| `03-ARCHITECTURE.md` | Kod mimarisi, Phaser scene yapısı, state yönetimi |
| `04-UI-DESIGN.md` | UI bileşenleri, ekranlar, HUD tasarımı |
| `05-LEVEL-DATA.md` | 20 level için veri şeması ve level tanımları |
| `06-ENEMY-TOWER-SPECS.md` | Kule ve düşman istatistikleri, balancing |
| `07-MONETIZATION.md` | AdMob entegrasyonu, reklam stratejisi |
| `08-APPSTORE.md` | App Store / Google Play yayın süreci |
| `09-CLAUDE-PROMPTS.md` | VS Code'da Claude'a verilecek hazır promptlar |

---

## Teknoloji Stack

```
Oyun Motoru  : Phaser.js 3.60
Geliştirme   : VS Code + Vite (hot reload)
Mobile       : Capacitor (iOS + Android)
Reklamlar    : AdMob (Capacitor plugin)
Dil          : JavaScript (ES6+)
Görsel Stil  : Pixel art (Canvas 2D)
```

---

## Geliştirme Sırası

```
Hafta 1
  ├── Gün 1-2 : Kurulum + Temel Phaser sahnesi
  ├── Gün 3-4 : Düşman hareketi (serbest pathfinding)
  └── Gün 5-7 : Kule sistemi + ateş mekaniği

Hafta 2
  ├── Gün 8-9  : UI / HUD / Menüler
  ├── Gün 10-11: Level sistemi (20 level verisi)
  └── Gün 12-14: Balancing + polishing

Hafta 3
  ├── Gün 15-16: Capacitor mobile export
  ├── Gün 17-18: AdMob entegrasyonu
  └── Gün 19-21: App Store hazırlığı + submission
```

---

## Kural: Claude ile Çalışma

Her geliştirme oturumunda Claude'a şunu söyle:
> "09-CLAUDE-PROMPTS.md dosyasındaki [ilgili prompt adı] promptunu kullan"

Bu, tutarlı ve kaliteli kod üretimini sağlar.
