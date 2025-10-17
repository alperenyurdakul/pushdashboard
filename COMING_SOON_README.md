# 🚀 Çok Yakında Sayfası Kullanım Kılavuzu

## 📌 Özellik

Dashboard için modern ve şık bir "Çok Yakında" sayfası eklenmiştir. Bu sayfa aktif olduğunda, kullanıcılar dashboard'a erişemez ve sadece bu sayfayı görür.

---

## 🎯 Nasıl Açılır/Kapatılır?

### ✅ Çok Yakında Sayfasını AKTİF ETMEK İçin:

Dosya: `dashboard/src/config/features.js`

```javascript
const FEATURES = {
  SHOW_COMING_SOON: true,  // ← true yapın
};
```

### ❌ Çok Yakında Sayfasını KAPATMAK İçin:

```javascript
const FEATURES = {
  SHOW_COMING_SOON: false,  // ← false yapın (varsayılan)
};
```

---

## 🔄 Değişiklikler Ne Zaman Yansır?

1. **Development modunda:** Dosyayı kaydettiğiniz anda otomatik yansır (hot reload)
2. **Production modunda:** `npm run build` komutu ile yeniden build almanız gerekir

---

## 📂 İlgili Dosyalar

- **Sayfa:** `dashboard/src/pages/ComingSoon.js`
- **Config:** `dashboard/src/config/features.js`
- **App:** `dashboard/src/App.js` (entegrasyon)

---

## 🎨 Özelleştirme

`dashboard/src/pages/ComingSoon.js` dosyasını düzenleyerek:
- Başlık ve metinleri değiştirebilirsiniz
- Renkleri özelleştirebilirsiniz
- İkonları değiştirebilirsiniz
- İletişim bilgilerini güncelleyebilirsiniz

---

## 📸 Örnek Görünüm

Sayfa şunları içerir:
- ✨ Modern gradient background
- 🔨 Animasyonlu construction icon
- 📝 Açıklayıcı metin ve özellikler
- 📧 İletişim bilgisi

---

## ⚠️ Önemli Notlar

- `SHOW_COMING_SOON: true` olduğunda **hiç kimse** dashboard'a erişemez
- Login ekranı da gösterilmez
- Geliştirme yaparken **false** bırakın, yayına alırken **true** yapın
- Production'da değişiklik yaptıktan sonra **build almayı unutmayın**

---

## 🚀 Hızlı Test

1. `dashboard/src/config/features.js` dosyasını açın
2. `SHOW_COMING_SOON: true` yapın
3. Dashboard'u yenileyin (http://localhost:3000)
4. "Çok Yakında" sayfasını görmelisiniz!

---

## 📝 Production'a Deploy

```bash
# 1. Çok Yakında sayfasını aktif edin
# features.js dosyasında SHOW_COMING_SOON: true

# 2. Build alın
cd dashboard
npm run build

# 3. Build klasörünü sunucuya yükleyin
# build/ klasörünü production sunucusuna kopyalayın
```

---

**Sorularınız için:** appfaydana@gmail.com

