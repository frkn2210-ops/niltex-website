#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================================="
echo "  🌿 NİLTEKS & NİL HOME YÖNETİM PANELİ (niltex.com.tr)"
echo "=========================================================="
echo ""
echo "  1. Eski oturumlar kontrol ediliyor..."

# 8088 portunu kullanan eski süreç varsa temizle
OLD_PID=$(lsof -ti:8088 2>/dev/null)
if [ -n "$OLD_PID" ]; then
  kill -9 $OLD_PID 2>/dev/null
  sleep 1
fi

echo "  2. Yönetim Sunucusu başlatılıyor..."
# Terminal penceresi kapansa bile sunucunun arka planda kesintisiz çalışması için nohup kullanılır
nohup python3 admin_server.py 8088 > /tmp/nilteks_admin.log 2>&1 &
SERVER_PID=$!

sleep 1.5

# Sunucunun sağlıklı başladığını doğrula
CHECK_URL="http://localhost:8088/api/data"
if curl -s --head --request GET "$CHECK_URL" | grep "200" > /dev/null; then
  echo "  ✓ Sunucu başarıyla başlatıldı ve yanıt veriyor!"
else
  # curl head kontrolü bazen farklı yanıt verebilir, GET ile dene
  if curl -s "$CHECK_URL" > /dev/null; then
    echo "  ✓ Sunucu başarıyla başlatıldı ve yanıt veriyor!"
  else
    echo "  ⚠️ Sunucu başlatılırken uyarı oluştu, yine de açılıyor..."
  fi
fi

echo ""
echo "  3. Tarayıcınızda Yönetim Paneli Açılıyor..."
open "http://localhost:8088/admin/"

echo ""
echo "  ========================================================"
echo "  ✓ YÖNETİM PANELİ KULLANIMA HAZIR"
echo "  ========================================================"
echo "  👉 Panel Adresi    : http://localhost:8088/admin/"
echo "  👉 Web Sitesi (TR) : http://localhost:8088/"
echo "  👉 Web Sitesi (EN) : http://localhost:8088/en.html"
echo "  ========================================================"
echo "  NOT: Sunucu arka planda çalışmaktadır. Bu Terminal penceresini"
echo "       istediğiniz zaman kapatabilirsiniz, panel çalışmaya devam eder."
echo "  ========================================================"
echo ""

sleep 2
exit 0
