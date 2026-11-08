// api/upload.js - Nilteks 7/24 Vercel & GitHub Bulut Görsel Yükleme Servisi
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Sadece POST istekleri kabul edilir.' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '').trim() || process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'GitHub Erişim Anahtarı (Token) eksik. Lütfen panelden anahtarınızı giriniz.' 
    });
  }

  try {
    const { categoryId, filename, dataUrl } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'Görsel verisi eksik.' });
    }

    const cleanName = (filename || 'image.jpg').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const categorySlug = categoryId || 'genel';
    const filePath = `images/categories/${categorySlug}/${cleanName}`;
    const repo = 'frkn2210-ops/niltex-website';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // Base64 ham verisini ayıkla
    const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;

    // Dosya zaten varsa SHA değerini al (üzerine yazabilmek için)
    let sha = null;
    const getRes = await fetch(apiUrl + '?ref=main', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Nilteks-Cloud-CMS'
      }
    });

    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    // GitHub'a görsel dosyasını yükle
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Nilteks-Cloud-CMS'
      },
      body: JSON.stringify({
        message: `7/24 Bulut Paneli: Yeni ürün fotoğrafı yüklendi (${cleanName})`,
        content: base64Data,
        sha: sha,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      return res.status(putRes.status).json({ success: false, error: err.message || 'Görsel GitHub deposuna yüklenemedi.' });
    }

    return res.status(200).json({
      success: true,
      imagePath: filePath,
      filename: cleanName,
      message: 'Fotoğraf başarıyla GitHub ve Vercel deposuna yüklendi.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
