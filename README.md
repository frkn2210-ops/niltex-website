# Nilteks & Nil Home Kurumsal Web Sitesi (niltex.com.tr)

Nilteks Tekstil Sanayi ve Ticaret Ltd. Şti. kurumsal web sitesi ve yönetim paneli.

## 🚀 Proje Yapısı

- `index.html`: Türkçe ana sayfa
- `en.html`: İngilizce ana sayfa
- `css/style.css`: Doğa temalı pastel tasarım ve responsive stiller
- `js/main.js`: Kategori filtreleme, galeri, teklif modalı ve mobil menü
- `data/site-data.json`: Kategoriler, ürünler ve firma iletişim bilgileri
- `images/`: Ürün fotoğrafları (1200x1800 piksel dikey standart), logolar ve üretim görselleri
- `admin/`: Web tabanlı yönetim paneli (fotoğraf yükleme, ürün düzenleme, iletişim bilgileri)
- `admin_server.py`: Sıfır bağımlılıkla çalışan Python 3 yerel yönetim sunucusu
- `vercel.json`: Vercel yapılandırması (temiz URL'ler, önbellekleme ve yönlendirmeler)

## 💻 Masaüstü Kısayolları

- **`Admin_Paneli_Baslat.command`**: Çift tıklayarak yönetim panelini tarayıcınızda açar (`http://localhost:8088/admin/`).
- **`Websitesi_Onizle.command`**: Çift tıklayarak web sitesini doğrudan açar.

## 🌐 Vercel & Domain Dağıtımı

1. Bu projeyi GitHub'da yeni bir depoya (örn. `niltex-website`) yükleyin.
2. [vercel.com](https://vercel.com) üzerinde projeyi import edin.
3. Proje ayarlarından **Domains** sekmesine girip `niltex.com.tr` ve `www.niltex.com.tr` alan adlarını ekleyin.
