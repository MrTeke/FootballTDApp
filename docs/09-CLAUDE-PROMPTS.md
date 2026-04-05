# 09 — VS Code'da Claude ile Geliştirme Promptları

Bu dosyadaki promptları VS Code'da Claude'a kopyala-yapıştır yaparak kullan.
Her prompt bağımsız bir geliştirme görevine karşılık gelir.

---

## 🚀 PROMPT 1: Proje Kurulumu

```
Bir Phaser.js tower defense oyunu geliştiriyorum.

Şu an yapılacak iş: Vite + Phaser.js proje iskeletini kur.

Görev:
1. package.json dosyasını oluştur (Phaser 3.60, Vite bağımlılıklarıyla)
2. vite.config.js dosyasını oluştur (base: './' ayarıyla)
3. index.html dosyasını oluştur (Press Start 2P font, #game-container div)
4. src/main.js dosyasını oluştur (Phaser.Game başlatma)
5. src/config.js dosyasını oluştur (480x640 boyut, GRID ve COLORS sabitleri)

Referans için: Oyun 480x640 px, top-down futbol sahası, pixel art stili.
Tüm dosyaları eksiksiz yaz, placeholder kullanma.
```

---

## 🎨 PROMPT 2: BootScene ve MenuScene

```
Phaser.js tower defense oyunum için iki sahne yaz.

Mevcut yapı:
- src/main.js mevcut
- src/config.js mevcut (GAME_CONFIG, GRID, COLORS export ediliyor)

Görev:
1. src/scenes/BootScene.js yaz:
   - preload(): placeholder asset'ler (gerçek asset olmadığından Graphics ile çizeceğiz)
   - create(): 'MenuScene'e geç
   - Yükleme bar animasyonu ekle

2. src/scenes/MenuScene.js yaz:
   - "FOOTBALL DEFENSE" başlığı (Press Start 2P font, yeşil)
   - Animasyonlu ⚽ ikonu (yukarı aşağı sallanma tweeni)
   - "OYNA" butonu → LevelSelectScene'e geç (henüz yok, konsola yaz)
   - Pixel art stil, koyu arka plan (#0a0a1a)
   - Ses açma/kapama butonu (basit toggle)

Phaser 3.60 kullan. Her dosyayı export default class ile başlat.
```

---

## 🏟️ PROMPT 3: Saha Çizimi (GameScene temel)

```
Phaser.js GameScene için futbol sahası çizim kodu yaz.

Dosya: src/scenes/GameScene.js

Saha özellikleri:
- Ekran: 480x640
- HUD alanı: üstte 60px (saha Y=60'tan başlar)
- Kule paneli: altta 80px (saha Y=500'de biter)
- Saha alanı: 480x440 px (Y: 60-500 arası)
- Grid: 12 sütun × 11 satır, her hücre 40x40

Çizilecekler (Phaser Graphics API ile, sprite yok):
1. Koyu yeşil saha (şeritli desen, alternatif yeşil tonlar)
2. Beyaz çizgiler (kenar, orta çizgi, ceza sahası)
3. Grid hücreleri (çok hafif, hover'da parlayan)
4. 5 adet spawn noktası (kırmızı üçgen, üst kenarda)
5. Kale alanı (beyaz dikdörtgen, alt orta)

Kule ve düşman objesi henüz yok. Sadece saha.
create() ve drawPitch() metodlarını yaz.
```

---

## 🏗️ PROMPT 4: Kule Sistemi

```
Phaser.js tower defense oyunum için Tower sınıfı ve yerleştirme sistemi yaz.

Mevcut dosyalar:
- src/scenes/GameScene.js (saha çizimi mevcut)
- src/config.js (GRID sabiti mevcut)

Yeni dosyalar:
1. src/data/towers.js — Bek (50₺, menzil:90, hasar:15, ateşHızı:1000ms), 
   Stoper (100₺, menzil:75, hasar:35, ateşHızı:1600ms), 
   Kaleci (200₺, menzil:55, hasar:90, ateşHızı:2200ms)

2. src/objects/Tower.js:
   - constructor(scene, gridX, gridY, type)
   - draw() — Phaser Graphics ile pixel art futbolcu (sprite yok)
     Bek: mavi forma, Stoper: turuncu forma, Kaleci: sarı forma
   - showRange() — yarı şeffaf daire (hover'da görünür)
   - findTarget(enemies) — menzildeki en yakın düşman
   - fire(target) — mermi oluştur
   - update(time, enemies)
   - destroy()

3. src/objects/Grid.js:
   - occupy(gridX, gridY) / free(gridX, gridY) / isFree(gridX, gridY)
   - getPixelPos(gridX, gridY) → {x, y}

4. GameScene.js güncelle:
   - grid ve towers dizisi başlat
   - placeTower(gridX, gridY) metodu
   - Tıklama input'u → placeTower çağır
   - Para sistemi (basit: this.money = 150)

Sprite kullanma, sadece Phaser Graphics API.
```

---

## 👾 PROMPT 5: Düşman Sistemi

```
Phaser.js tower defense oyunum için Enemy sınıfı ve hareket sistemi yaz.

Mevcut: Tower.js, Grid.js, temel GameScene mevcut.

Yeni dosyalar:
1. src/data/enemies.js — Amateur (HP:60, hız:55, ödül:10), 
   Forward (HP:120, hız:85, ödül:18), Striker (HP:350, hız:35, ödül:40)

2. src/objects/Enemy.js:
   - constructor(scene, spawnX, spawnY, type)
   - Hedef: kale merkezi (240, 490)
   - draw() — Phaser Graphics + Container
     Amateur: kırmızı, Forward: turuncu, Striker: mor (hepsi pixel art insan figürü)
   - HP bar (renk değişimi: yeşil→turuncu→kırmızı)
   - move(delta) — hedefe doğru steering hareketi
   - calculateSeparation() — diğer düşmanlarla çakışma önleme
   - takeDamage(amount)
   - update(time, delta)
   - destroy()

3. src/objects/Bullet.js:
   - constructor(scene, fromX, fromY, target, damage)
   - Küçük beyaz daire, hedefe doğru hareket
   - Hedefe ulaşınca takeDamage() çağır, kendini yok et

4. GameScene.js'e ekle:
   - this.enemies = [] ve this.bullets = []
   - update() içinde enemies ve bullets güncelleme
   - onEnemyReachedGoal() → can azalt, ekran sarsıntısı
   - onEnemyKilled(enemy) → para ekle

Sprite yok, sadece Phaser Graphics. Enemy ve Bullet birbirini import etmesin (circular dependency önle).
```

---

## 🌊 PROMPT 6: Wave Sistemi

```
Phaser.js tower defense oyunum için WaveManager ve EconomyManager yaz.

Mevcut: Enemy.js, Tower.js, GameScene.js hazır.

Görev:
1. src/utils/EventBus.js — basit emit/on/off singleton

2. src/systems/EconomyManager.js:
   - constructor(scene, startMoney)
   - canAfford(towerType), spend(towerType), add(amount)
   - Her değişimde EventBus.emit('ECONOMY_CHANGED', money)

3. src/systems/WaveManager.js:
   - constructor(scene, levelData)
   - startNextWave() — spawn queue oluştur, zamanlayıcıyla düşman üret
   - spawnEnemy(type) — rastgele spawn noktasından çıkar
   - onWaveComplete() — bonus para ver, sonraki wave'e hazırla
   - EventBus ile iletişim: WAVE_CHANGED, WAVE_COMPLETE, NEXT_WAVE_READY

4. src/data/levels.js — sadece Level 1 ve 2'yi yaz (diğerleri sonra eklenecek):
   Level 1: 3 wave, sadece amateur ve forward
   Level 2: 3 wave, daha fazla düşman

5. GameScene.js güncelle:
   - EconomyManager ve WaveManager entegre et
   - "Wave Başlat" mantığı (klavye: Space tuşu veya tıklama)
   - checkWaveComplete() kontrol et
   - levelComplete() ve gameOver() metotları

EventBus'ı her dosyaya import et. Circular dependency olmamasına dikkat et.
```

---

## 🖥️ PROMPT 7: HUD ve UIScene

```
Phaser.js tower defense için UIScene ve alt kule seçim paneli yaz.

Mevcut: GameScene, WaveManager, EconomyManager, EventBus hazır.

Görev:
1. src/scenes/UIScene.js:
   - GameScene ile paralel çalışır (scene.launch)
   - Üst HUD (60px): Para💰, Can❤️, Wave🌊, Wave Başlat butonu
   - EventBus ile güncelleme: ECONOMY_CHANGED, LIVES_CHANGED, WAVE_CHANGED
   - Para değişince küçük tween animasyonu
   - Can azalınca kalp simgesi solar (alpha: 0.2)

2. Alt Kule Seçim Paneli (UIScene'e dahil, 80px yüksek):
   - 3 kule butonu: [BEK 50₺] [STOPER 100₺] [KALECİ 200₺]
   - Seçili kule parlak border
   - Parası yetmeyince soluk görünüm
   - Seçim değişince EventBus.emit('TOWER_SELECTED', type)

3. Wave Duyuru Overlay:
   - "⚽ WAVE 2 BAŞLIYOR!" — 2 saniye görünür, fade in/out
   - Ortada, yarı şeffaf siyah arka plan

4. Kule Tıklama Popup (GameScene'de):
   - Kuleye tıklanınca: isim, hasar, menzil bilgisi + "SAT: X₺" butonu
   - Başka yere tıklanınca kapanır

Tüm metinler Press Start 2P font. Phaser 3 DOM elementlerini değil, Phaser Text objelerini kullan.
```

---

## 📋 PROMPT 8: Level Seçim ve Game Over Ekranları

```
Phaser.js tower defense için 2 sahne yaz.

1. src/scenes/LevelSelectScene.js:
   - 4 sütun × 5 satır grid (20 level)
   - Her hücre: level numarası + yıldız göstergesi (0-3 ⭐)
   - Storage.isLevelUnlocked() ile kilit kontrolü
   - Kilitli: 🔒 ikonu, gri ve tıklanamaz
   - Açık: renkli, tıklanınca GameScene'e geç (level numarasıyla)
   - Geri butonu → MenuScene

2. src/scenes/GameOverScene.js:
   - init(data): { win, stars, level } alır
   - Kazandıysa: "LEVEL X TAMAMLANDI! ⭐⭐⭐" + yıldız animasyonu
   - Kaybettiyse: "MAÇI KAYBETTİN 😔" + istatistikler
   - Butonlar: [ANA MENÜ] [TEKRAR] [SONRAKİ LEVEL] (win durumunda)
   - "📺 Reklam İzle → Devam Et" butonu (AdManager.showRewarded çağırır)
   - Storage.saveLevelStars() ile kayıt

3. src/utils/Storage.js:
   - save/load/saveLevelStars/getLevelStars/isLevelUnlocked metodları
   - localStorage kullan, hata yakalamayı unutma

Her sahne için Press Start 2P font, koyu tema, pixel art his.
```

---

## 📱 PROMPT 9: Capacitor Mobile Export

```
Phaser.js oyunumu Capacitor ile iOS ve Android'e taşımam gerekiyor.

Mevcut: npm run build çalışıyor, /dist klasörü oluşuyor.

Görev:
1. Capacitor kurulumu için komutları listele (npm install, npx cap init vb.)

2. capacitor.config.json oluştur:
   - appId: com.footballdefense.game
   - appName: Football Defense
   - webDir: dist
   - Keyboard, StatusBar ayarları

3. iOS için Info.plist değişikliklerini listele:
   - AdMob App ID (placeholder ile)
   - NSUserTrackingUsageDescription (ATT için)
   - Orientasyon: Portrait only

4. Android için AndroidManifest.xml değişikliklerini listele:
   - AdMob meta-data (placeholder ile)
   - İzinler: INTERNET, ACCESS_NETWORK_STATE

5. src/systems/AdManager.js yaz:
   - Capacitor AdMob plugin kullanır
   - initialize(), showBanner(), hideBanner(), showInterstitial(), showRewarded(callback)
   - Web'de çalışırken hata vermesin (isMobile kontrolü)
   - Test ID'leri dahil

6. Olası sorunları ve çözümlerini listele (CORS, safe area, vb.)

Tüm komutları çalıştırılabilir şekilde yaz.
```

---

## 🎮 PROMPT 10: Tüm Level Verilerini Doldur

```
src/data/levels.js dosyasına 20 levelin tamamını yaz.

Şema:
{
  levelNumber: {
    name: string,
    startMoney: number,
    lives: 5,
    spawnConfig: '3-points' | '4-points' | '5-points',
    waves: [
      {
        id: number,
        interval: number,  // ms
        enemies: [{ type: 'amateur'|'forward'|'striker', count: number }]
      }
    ]
  }
}

Kurallar:
- Level 1-4: Sadece amateur ve forward, 3 wave, spawnConfig: '3-points'
- Level 5-8: Amateur + forward + az striker, 4 wave, spawnConfig: '4-points'
- Level 9-12: Forward + striker ağırlıklı, 5 wave, spawnConfig: '5-points'
- Level 13-16: Çoğunlukla forward + striker, 5 wave, daha kısa interval
- Level 17-20: Tüm tipler, 5-6 wave, en kısa interval (350-500ms)
- startMoney: Level 1-4: 150, 5-8: 200, 9-12: 250, 13-20: 300
- Her level bir öncekinden belirgin şekilde zor olmalı

SPAWN_CONFIGS sabitini de yaz (koordinatlarla).
Tüm 20 leveli eksiksiz yaz.
```

---

## 🐛 PROMPT 11: Debug ve Balancing

```
Football Defense oyunumda balancing sorunu var. Şu problemi yaşıyorum:
[BURAYA SORUNU YAZ]

Mevcut değerler:
- Bek: cost:50, damage:15, range:90, fireRate:1000
- Stoper: cost:100, damage:35, range:75, fireRate:1600
- Amateur: hp:60, speed:55
- Forward: hp:120, speed:85
- Striker: hp:350, speed:35

[Problemi tarif et: "Level 3'de çok kolay", "Striker'ları öldüremiyorum" vb.]

Hangi değerleri nasıl değiştirmeliyim? Matematiksel olarak hesapla.
```

---

## 🔧 PROMPT 12: Hata Ayıklama

```
Phaser.js oyunumda şu hata var:
[HATA MESAJINI BURAYA YAPISTIR]

İlgili kod:
[HATAYI VEREN KODU BURAYA YAPISTIR]

Hatayı açıkla ve düzeltilmiş kodu yaz.
```

---

## 💡 Genel İpuçları

### Claude'a Bağlam Ver
Her promptta şunu ekle:
```
Bu, Football Defense adlı Phaser.js tower defense oyunudur.
Stack: Phaser 3.60, Vite, Vanilla JavaScript, Capacitor
Görsel: Sadece Phaser Graphics API (sprite/image kullanmıyoruz şimdilik)
```

### Büyük Dosyaları Parçala
Çok büyük bir dosya isteyeceksen:
```
GameScene.js'i yazıyorum. Önce sadece create() metodunu yaz.
Sonra update() metodunu yaz.
Sonra input handling kısmını yaz.
```

### Var Olan Kodu Güncelle
```
Mevcut Tower.js dosyam şu:
[KODU BURAYA YAPISTIR]

Bu dosyaya upgrade sistemi ekle: her kuleye tıklanınca
"Geliştir (X₺)" butonu çıksın. Level 2 maliyeti 2x, hasar 1.5x.
```
