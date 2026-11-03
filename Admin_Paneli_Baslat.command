#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================================="
echo "  🌿 NİLTEKS & NİL HOME YÖNETİM PANELİ (niltex.com.tr)"
echo "=========================================================="
echo ""
echo "  1. Yönetim Paneli ve Yerel Sunucu Başlatılıyor..."
echo ""

# Arka planda python admin sunucusunu başlat
python3 admin_server.py 8088 &
SERVER_PID=$!

sleep 1

echo "  2. Tarayıcınızda Yönetim Paneli Açılıyor..."
open "http://localhost:8088/admin/"

echo ""
echo "  ========================================================"
echo "  ✓ YÖNETİM PANELİ BAŞARIYLA AÇILDI"
echo "  ========================================================"
echo "  👉 Panel Adresi    : http://localhost:8088/admin/"
echo "  👉 Web Sitesi (TR) : http://localhost:8088/"
echo "  👉 Web Sitesi (EN) : http://localhost:8088/en.html"
echo "  ========================================================"
echo "  Paneli kapatmak istediğinizde bu Terminal penceresini kapatabilirsiniz."
echo ""

wait $SERVER_PID
