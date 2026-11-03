#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NİLTEKS & NİL HOME - YÖNETİM PANELİ & YEREL SUNUCU (ADMIN SERVER)
Python 3 Dahili Kütüphaneleriyle Çalışır - Sıfır Bağımlılık
"""

import http.server
import socketserver
import os
import sys
import json
import base64
import re
import urllib.parse
from pathlib import Path

# Çalışma dizini: website klasörü
SCRIPT_DIR = Path(__file__).resolve().parent
DATA_FILE = SCRIPT_DIR / "data" / "site-data.json"
IMAGES_DIR = SCRIPT_DIR / "images"

PORT = 8088

class NilteksAdminHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SCRIPT_DIR), **kwargs)

    def log_message(self, format, *args):
        # Temiz konsol çıktısı
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]} -> {args[2]}\n")

    def end_headers(self):
        # CORS & Önbellek engelleme (canlı panel güncellemeleri için)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        url_parts = urllib.parse.urlparse(self.path)
        path = url_parts.path

        # /admin veya /admin/ yönlendirmesi
        if path == "/admin" or path == "/admin/":
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            admin_file = SCRIPT_DIR / "admin" / "index.html"
            if admin_file.exists():
                with open(admin_file, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b"<h1>Yonetim Paneli Bulunamadi</h1>")
            return

        # /api/data -> JSON verisini oku
        if path == "/api/data":
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            if DATA_FILE.exists():
                with open(DATA_FILE, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'{"error": "Veri dosyasi bulunamadi"}')
            return

        # Normal dosya sunumu (index.html, en.html, css, js, images vb.)
        return super().do_GET()

    def do_POST(self):
        url_parts = urllib.parse.urlparse(self.path)
        path = url_parts.path

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        # 1. API: /api/save -> site-data.json dosyasını güncelle
        if path == "/api/save":
            try:
                data = json.loads(post_data.decode('utf-8'))
                DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
                with open(DATA_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Veriler başarıyla kaydedildi."}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        # 2. API: /api/upload -> Görsel yükleme (Base64)
        if path == "/api/upload":
            try:
                payload = json.loads(post_data.decode('utf-8'))
                category_slug = payload.get("categoryId", "genel")
                raw_filename = payload.get("filename", "image.jpg")
                data_url = payload.get("dataUrl", "")

                # Güvenli dosya adı oluştur
                clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', raw_filename)
                target_dir = IMAGES_DIR / "categories" / category_slug
                target_dir.mkdir(parents=True, exist_ok=True)

                # Base64 başlığını temizle
                if "," in data_url:
                    base64_data = data_url.split(",", 1)[1]
                else:
                    base64_data = data_url

                file_bytes = base64.b64decode(base64_data)
                target_file = target_dir / clean_name

                with open(target_file, "wb") as f:
                    f.write(file_bytes)

                # Web yolunu döndür
                rel_path = f"images/categories/{category_slug}/{clean_name}"

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True, 
                    "imagePath": rel_path,
                    "filename": clean_name
                }).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        # 3. API: /api/delete-image -> Görsel silme
        if path == "/api/delete-image":
            try:
                payload = json.loads(post_data.decode('utf-8'))
                img_path = payload.get("imagePath", "")
                
                # Güvenlik kontrolü: Sadece images/categories altındaki dosyalar silinebilir
                if img_path.startswith("images/categories/"):
                    safe_file = SCRIPT_DIR / img_path
                    if safe_file.exists() and safe_file.is_file():
                        os.remove(safe_file)
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json; charset=utf-8')
                        self.end_headers()
                        self.wfile.write(json.dumps({"success": True, "message": "Görsel silindi."}).encode('utf-8'))
                        return

                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": "Geçersiz dosya yolu veya dosya bulunamadı."}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

def run_server(port=PORT):
    # Port meşgulse bir sonrakini dene
    for p in range(port, port + 10):
        try:
            with socketserver.TCPServer(("", p), NilteksAdminHandler) as httpd:
                print("==================================================================")
                print(f"  🌿 NİLTEKS & NİL HOME YÖNETİM PANELİ ÇALIŞIYOR")
                print("==================================================================")
                print(f"  👉 Web Sitesi (Türkçe)  : http://localhost:{p}/")
                print(f"  👉 Web Sitesi (İngilizce): http://localhost:{p}/en.html")
                print(f"  👉 Yönetim Paneli (Admin): http://localhost:{p}/admin/")
                print("==================================================================")
                print("  Durdurmak için pencereyi kapatın veya Ctrl+C tuşlarına basın.")
                httpd.serve_forever()
        except OSError as e:
            if "Address already in use" in str(e):
                continue
            else:
                raise e

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port)
