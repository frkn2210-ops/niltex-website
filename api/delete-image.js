// api/delete-image.js - Nilteks 7/24 Vercel & GitHub Bulut Görsel Silme Servisi
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
    const { imagePath } = req.body;
    if (!imagePath || !imagePath.startsWith('images/categories/')) {
      return res.status(400).json({ success: false, error: 'Geçersiz görsel dosya yolu.' });
    }

    const repo = 'frkn2210-ops/niltex-website';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${imagePath}`;

    // Dosyanın mevcut SHA değerini al
    const getRes = await fetch(apiUrl + '?ref=main', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Nilteks-Cloud-CMS'
      }
    });

    if (!getRes.ok) {
      return res.status(404).json({ success: false, error: 'Silinecek görsel GitHub üzerinde bulunamadı.' });
    }

    const fileInfo = await getRes.json();

    // Dosyayı sil
    const delRes = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Nilteks-Cloud-CMS'
      },
      body: JSON.stringify({
        message: `7/24 Bulut Paneli: Fotoğraf silindi (${imagePath})`,
        sha: fileInfo.sha,
        branch: 'main'
      })
    });

    if (!delRes.ok) {
      const err = await delRes.json();
      return res.status(delRes.status).json({ success: false, error: err.message || 'Görsel silinemedi.' });
    }

    return res.status(200).json({ success: true, message: 'Görsel GitHub ve Vercel deposundan başarıyla silindi.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
