# 08 — App Store & Google Play Yayın Süreci

## Genel Gereksinimler

### Apple App Store
- **Mac bilgisayar zorunlu** (Xcode sadece Mac'te çalışır)
- Apple Developer hesabı: **$99/yıl** → https://developer.apple.com
- Xcode (ücretsiz, App Store'dan)

### Google Play
- Herhangi bir işletim sistemi (Android Studio Windows'ta çalışır)
- Google Play Developer hesabı: **$25 tek seferlik** → https://play.google.com/console

---

## Adım 1: Uygulama Build Al

### Web Build

```bash
npm run build
# /dist klasörü oluşur
```

### Capacitor Sync

```bash
npx cap sync
```

### iOS Build (Mac gerekli)

```bash
npx cap open ios
# Xcode açılır
```

Xcode'da:
1. Soldaki proje dosyasına tıkla → "Signing & Capabilities"
2. Team seç (Apple Developer hesabın)
3. Bundle ID gir: `com.yourname.footballdefense`
4. Product → Archive
5. Distribute App → App Store Connect

### Android Build

```bash
npx cap open android
# Android Studio açılır
```

Android Studio'da:
1. Build → Generate Signed Bundle/APK
2. Android App Bundle seç (AAB — Play Store için tercih)
3. Keystore oluştur (ilk seferinde) — **bu dosyayı kaybet me!**
4. Release seç → Finish

---

## Adım 2: Store Varlıkları Hazırla

### Uygulama İkonu

Boyutlar gereken minimum set:

| Platform | Boyut |
|----------|-------|
| iOS (App Store) | 1024×1024 px |
| iOS (cihaz) | 180×180, 120×120, 87×87, ... |
| Android | 512×512 px (Play Store) |
| Android (launcher) | 192×192, 144×144, 96×96, 72×72, 48×48 |

**Araç:** https://appicon.co — 1024×1024 yükle, tüm boyutları indir

**İkon Tasarımı Önerileri:**
- Yeşil saha arka planı
- Büyük ⚽ topu
- "FOOTBALL DEFENSE" veya sadece "FD" yazısı
- Pixel art stili koru

### Ekran Görüntüleri (Screenshots)

App Store için minimum:
- iPhone 6.7" (1290×2796): 3-10 screenshot
- iPad 12.9" (2048×2732): eğer evrensel uygulama ise

Google Play için:
- Telefon: 1080×1920 minimum, en az 2 screenshot

**Hangi ekranları çek:**
1. Oyun içi (kule yerleştirilmiş, düşmanlar görünür)
2. Level seçim ekranı (yıldızlarla)
3. Game over / level tamamlama ekranı
4. Ana menü

**Araç:** Simulator'da oyunu oyna, screenshot al (Cmd+S veya Xcode'dan)

### Öne Çıkan Görsel (Feature Graphic)
Sadece Google Play gerektirir: 1024×500 px banner

---

## Adım 3: Store Sayfası Metin İçeriği

### Uygulama Adı (30 karakter max — App Store)

```
Football Defense
```

### Alt Başlık (App Store, 30 karakter)

```
Protect Your Goal!
```

### Açıklama (4000 karakter max)

```
Saha senin kaleni korumak için savaş alanına döndü!

Football Defense, geleneksel kule savunma oyununu futbol 
tutkusuyla birleştiren nefes kesen bir strateji oyunudur.

⚽ NASIL OYNANIR?
Rakip oyuncular kaleni ele geçirmek için sahaya iniyor. 
Senin görevin: doğru savunmacıları doğru yerlere 
yerleştirerek kaleyi korumak!

🏃 3 FARKLI SAVUNMACI
• Bek — Hızlı ve çok yönlü, temel savunma hattın
• Stoper — Güçlü engelleyici, rakipleri durdurmada uzman  
• Kaleci — Kale önünün koruyucusu, son savunma hattı

🌊 20 HEYECAN DOLU LEVEL
Antrenman maçlarından Dünya Kupası Finali'ne kadar 
giderek zorlaşan 20 benzersiz level seni bekliyor.

⭐ YILDIZ TOPLA
Her leveli 3 yıldızla tamamla. Kaleyi gol yemeden 
geçirerek mükemmel performans göster!

🎮 ÖZELLİKLER
• Gerçek zamanlı strateji — hızlı düşün, hızlı yerleştir
• Top-down futbol sahası görünümü
• Retro pixel art grafikleri
• Ücretsiz oyna

Football fanı mısın ve strateji oyunlarını seviyorsan, 
Football Defense tam sana göre!
```

### Anahtar Kelimeler (App Store — 100 karakter, virgülle)

```
tower defense,football,soccer,strategy,pixel art,sport game,defense game,kule savunma
```

### Kategori

- Ana: **Games → Strategy**
- İkinci: **Games → Sports**

### Yaş Derecelendirmesi

- **4+** (siddet yok, gerçek para harcaması yok)
- AdMob varsa: "Sık Sık/Yoğun Reklam İçeriği" işaretle

---

## Adım 4: App Store Connect Ayarları

1. https://appstoreconnect.apple.com gir
2. "My Apps" → "+" → "New App"
3. Bilgileri doldur:
   - Platform: iOS
   - Name: Football Defense
   - Bundle ID (Xcode'dakiyle aynı)
   - SKU: footballdefense001
4. App Information → versiyon, kategori, gizlilik linki
5. Pricing → Free
6. App Review Information → test hesabı gerekmiyorsa "Not Required"

---

## Adım 5: Review Süreci

### Apple
- Ortalama **1-3 iş günü** (bazen 7 güne kadar uzar)
- Reddedilme sebepleri (sık görülenler):
  - Gizlilik politikası eksik
  - Reklam politikasına uymama
  - Crash eden build
  - Eksik screenshot

### Google Play
- **Birkaç saatten 3 güne kadar**
- Genellikle Apple'dan daha hızlı

---

## Adım 6: Yayın Sonrası

### Versiyon Güncelleme Süreci

```bash
# Kod değişikliği yap
npm run build
npx cap sync
# Xcode/Android Studio'da versiyonu artır (1.0.0 → 1.0.1)
# Yeniden build + submit
```

### Takip Edilmesi Gereken Metrikler

| Metrik | Araç |
|--------|------|
| İndirme sayısı | App Store Connect / Play Console |
| Reklam geliri | AdMob Dashboard |
| Crash raporları | Xcode Organizer / Firebase Crashlytics |
| Kullanıcı yorumları | Store sayfaları |

### ASO (App Store Optimization)

İlk hafta sonrası:
- Yorumlara cevap ver (hepsi, özellikle negatifler)
- Screenshot'ları conversion oranına göre test et
- Anahtar kelime performansını takip et

---

## Checklist — Yayın Öncesi

```
[ ] Tüm 20 level test edildi ve geçilebilir
[ ] Reklam test modundan çıkıldı (IS_PROD = true)
[ ] Privacy Policy URL hazır
[ ] Uygulama ikonu tüm boyutlarda hazır
[ ] Screenshot'lar hazır
[ ] Store açıklaması yazıldı
[ ] Bundle ID belirlendi (değişmez!)
[ ] Keystore kaydedildi (Android)
[ ] AdMob App ID'leri konfigürasyona girdi
[ ] iOS Info.plist'te AdMob ID var
[ ] Build crash etmiyor (gerçek cihazda test)
[ ] Ses açma/kapama çalışıyor
[ ] Her ekranda back/home butonu sorunsuz
```
