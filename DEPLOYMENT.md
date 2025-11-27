# Dashboard Deployment Notları

## Build Alma

```bash
cd dashboard
npm install
npm run build
```

Build klasörü `dashboard/build` içinde oluşturulacak.

## Server Konfigürasyonu

### Apache (.htaccess)
`.htaccess` dosyası build klasörüne otomatik kopyalanır. Apache mod_rewrite modülünün aktif olduğundan emin olun.

### Nginx
`nginx.conf.example` dosyasını referans alarak nginx konfigürasyonunuzu yapın. Önemli kısım:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Netlify / Vercel
`_redirects` dosyası build klasörüne otomatik kopyalanır. Ekstra bir ayar gerekmez.

## Önemli Notlar

1. **Homepage Ayarı**: `package.json`'da `homepage: "."` olarak ayarlanmıştır. Bu, root path'te deploy için uygundur.

2. **React Router**: Tüm route'lar server tarafında `index.html`'e yönlendirilmelidir. Aksi takdirde beyaz sayfa görünür.

3. **Build Sonrası**: Build klasörünü server'a yüklerken tüm dosyaları (`.htaccess` ve `_redirects` dahil) yüklediğinizden emin olun.

## Sorun Giderme

### Beyaz Sayfa Sorunu
- Server'ın tüm route'ları `index.html`'e yönlendirdiğinden emin olun
- Browser console'da JavaScript hatalarını kontrol edin
- Network tab'da asset'lerin doğru yüklendiğini kontrol edin

### 404 Hatası
- Server konfigürasyonunun doğru olduğundan emin olun
- `.htaccess` veya nginx config'in aktif olduğunu kontrol edin

