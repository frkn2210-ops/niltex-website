// api/sync.js - Nilteks 7/24 Vercel & GitHub Bulut Durum & Senkronizasyon Servisi
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers.authorization?.replace('Bearer ', '').trim() || process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'GitHub Erişim Anahtarı (Token) eksik.' 
    });
  }

  try {
    const repo = 'frkn2210-ops/niltex-website';
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/commits/main`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Nilteks-Cloud-CMS'
      }
    });

    if (!commitRes.ok) {
      return res.status(commitRes.status).json({ success: false, error: 'GitHub deposuna bağlanılamadı. Token izinlerini kontrol edin.' });
    }

    const commitData = await commitRes.json();
    return res.status(200).json({
      success: true,
      message: 'GitHub ve Vercel 7/24 Bulut Bağlantısı Aktif!',
      latestCommit: {
        sha: commitData.sha.substring(0, 7),
        message: commitData.commit.message,
        date: commitData.commit.author.date
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
