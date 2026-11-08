// api/save.js - Nilteks 7/24 Vercel & GitHub Bulut Kayıt Servisi
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
    const data = req.body;
    const repo = 'frkn2210-ops/niltex-website';
    const filePath = 'data/site-data.json';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // Mevcut dosyanın SHA değerini sorgula
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

    // JSON içeriğini Base64 formatına çevir
    const jsonStr = JSON.stringify(data, null, 2);
    const base64Content = Buffer.from(jsonStr, 'utf-8').toString('base64');

    // GitHub'a doğrudan commit at
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Nilteks-Cloud-CMS'
      },
      body: JSON.stringify({
        message: '7/24 Bulut Paneli: Site verileri güncellendi',
        content: base64Content,
        sha: sha,
        branch: 'main'
      })
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      return res.status(putRes.status).json({ success: false, error: err.message || 'GitHub kaydı başarısız oldu.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Değişiklikler GitHub ve Vercel bulut sistemine başarıyla kaydedildi. Canlı siteniz güncelleniyor!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
