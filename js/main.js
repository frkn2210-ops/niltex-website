/**
 * NİLTEKS & NİL HOME - İNTERAKTİF WEBSİTE JAVASCRIPT DOSYASI
 * Kategori Filtreleme, Teklif Modalı, WhatsApp Entegrasyonu ve Dinamik Veri Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
  const isEnglish = document.documentElement.lang === 'en';

  // 1. Mobil Menü Aç/Kapa
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-active');
      mobileToggle.classList.toggle('active');
    });

    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('mobile-active');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // 2. Sticky Header Kaydırma Efekti
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // 3. Modal Aç/Kapa İşlemleri
  const quoteModal = document.getElementById('quoteModal');
  const modalClose = document.getElementById('modalClose');
  const modalCategorySelect = document.getElementById('modalCategorySelect');

  function bindInquireButtons() {
    const inquireButtons = document.querySelectorAll('.card-btn-inquire, .btn-inquire-direct');
    inquireButtons.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const targetCategory = btn.getAttribute('data-category-name');
        if (modalCategorySelect && targetCategory) {
          // Select içinde varsa seç
          let matched = false;
          for (let opt of modalCategorySelect.options) {
            if (opt.value.toLowerCase().includes(targetCategory.toLowerCase()) || targetCategory.toLowerCase().includes(opt.value.toLowerCase())) {
              modalCategorySelect.value = opt.value;
              matched = true;
              break;
            }
          }
        }
        if (quoteModal) {
          quoteModal.classList.add('active');
        }
      };
    });
  }

  if (modalClose && quoteModal) {
    modalClose.addEventListener('click', () => {
      quoteModal.classList.remove('active');
    });

    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
      }
    });
  }

  // 4. Modal Formu Gönderimi & WhatsApp Entegrasyonu
  const modalForm = document.getElementById('modalQuoteForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const company = document.getElementById('modalCompany').value.trim();
      const category = document.getElementById('modalCategorySelect').value;
      const note = document.getElementById('modalNote').value.trim();

      const msgTitle = isEnglish ? '*NILTEKS Website - Quotation Request*' : '*NİLTEKS Web Sitesi - Teklif Talebi*';
      const labelName = isEnglish ? '*Name:*' : '*İsim:*';
      const labelPhone = isEnglish ? '*Phone:*' : '*Telefon:*';
      const labelCompany = isEnglish ? '*Company:*' : '*Firma:*';
      const labelCategory = isEnglish ? '*Category:*' : '*Kategori:*';
      const labelNote = isEnglish ? '*Notes/Requirements:*' : '*Not/Talepler:*';

      const message = `${msgTitle}%0A%0A${labelName} ${encodeURIComponent(name)}%0A${labelPhone} ${encodeURIComponent(phone)}%0A${labelCompany} ${encodeURIComponent(company)}%0A${labelCategory} ${encodeURIComponent(category)}%0A${labelNote} ${encodeURIComponent(note)}`;
      
      const whatsappUrl = `https://wa.me/905514102451?text=${message}`;
      
      const alertMsg = isEnglish 
        ? `Thank you ${name}. Your quote request has been received! You are now being redirected to our WhatsApp line.` 
        : `Teşekkürler Sayın ${name}. Teklif talebiniz alındı! Şimdi doğrudan WhatsApp hattımıza aktarılıyorsunuz.`;
      
      alert(alertMsg);
      quoteModal.classList.remove('active');
      modalForm.reset();
      window.open(whatsappUrl, '_blank');
    });
  }

  // 5. Ana İletişim Formu Gönderimi
  const mainContactForm = document.getElementById('mainContactForm');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const category = document.getElementById('contactCategory').value;
      const messageText = document.getElementById('contactMessage').value.trim();

      const msgTitle = isEnglish ? '*NILTEKS Website - Inquiry / Quote Request*' : '*NİLTEKS Web Sitesi - İletişim / Teklif Talebi*';
      const labelName = isEnglish ? '*Name:*' : '*İsim:*';
      const labelEmail = isEnglish ? '*Email:*' : '*E-Posta:*';
      const labelPhone = isEnglish ? '*Phone:*' : '*Telefon:*';
      const labelCategory = isEnglish ? '*Product Group:*' : '*İlgilenilen Ürün Grubu:*';
      const labelMsg = isEnglish ? '*Message:*' : '*Mesaj:*';

      const message = `${msgTitle}%0A%0A${labelName} ${encodeURIComponent(name)}%0A${labelEmail} ${encodeURIComponent(email)}%0A${labelPhone} ${encodeURIComponent(phone)}%0A${labelCategory} ${encodeURIComponent(category)}%0A${labelMsg} ${encodeURIComponent(messageText)}`;

      const whatsappUrl = `https://wa.me/905514102451?text=${message}`;
      
      const alertMsg = isEnglish
        ? `Thank you for your message ${name}. Forwarding directly to Furkan Aydın and Nilteks team via WhatsApp.`
        : `Mesajınız için teşekkürler ${name}. Furkan Aydın ve Nilteks yetkilisine WhatsApp üzerinden hızlıca iletmek için onayınızla yönlendiriliyorsunuz.`;

      alert(alertMsg);
      mainContactForm.reset();
      window.open(whatsappUrl, '_blank');
    });
  }

  // 6. Yumuşak Kaydırma (Smooth Scroll)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Kategori Filtreleme Fonksiyonu
  function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
      btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.35s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      };
    });
  }

  // 8. Panelden Yüklenen Dinamik Verileri (site-data.json) Sayfaya Bağla
  async function hydrateFromSiteData() {
    try {
      const res = await fetch('data/site-data.json?t=' + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.products || data.products.length === 0) return;

      const grid = document.getElementById('productGrid');
      if (!grid) return;

      // Kategoriler sözlüğü
      const catMap = {};
      (data.categories || []).forEach(c => { catMap[c.id] = c; });

      grid.innerHTML = '';

      data.products.forEach(p => {
        const cat = catMap[p.categoryId] || { nameTr: 'Tekstil', nameEn: 'Textiles', icon: '🌿', groupTr: 'Ev Tekstili', groupEn: 'Home Textiles' };
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', p.categoryId);

        const title = isEnglish ? (p.titleEn || p.titleTr) : p.titleTr;
        const desc = isEnglish ? (p.descEn || p.descTr) : p.descTr;
        const group = isEnglish ? cat.groupEn : cat.groupTr;
        const specs = isEnglish ? (p.specsEn || p.specsTr || []) : (p.specsTr || []);
        const badge = isEnglish ? (p.badgeEn || 'New Collection') : (p.badgeTr || 'Yeni Koleksiyon');
        const quoteBtnText = isEnglish ? 'Request a Quote &rarr;' : 'Teklif İste &rarr;';
        const hasImg = p.image && p.image.trim() !== '';

        card.innerHTML = `
          <div class="product-card-image">
            ${hasImg 
              ? `<img src="${p.image}" alt="${title}" loading="lazy" onerror="if (!this.dataset.triedGh) { this.dataset.triedGh='1'; this.src='https://raw.githubusercontent.com/frkn2210-ops/niltex-website/main/' + this.getAttribute('src'); }">`
              : `<div class="placeholder-visual">
                   <div class="placeholder-pattern"></div>
                   <div class="placeholder-icon">${cat.icon}</div>
                   <span class="placeholder-badge">${badge}</span>
                   <p class="placeholder-hint">${isEnglish ? 'Photography in progress' : 'Görseller hazırlanıyor'}</p>
                 </div>`
            }
          </div>
          <div class="product-card-body">
            <span class="product-card-category">${group}</span>
            <h3 class="product-card-title">${title}</h3>
            <p class="product-card-desc">${desc}</p>
            <div class="product-specs">
              ${specs.map(s => `<span class="spec-pill">${s}</span>`).join('')}
            </div>
            <div class="product-card-action">
              <a href="#" class="card-btn-inquire" data-category-name="${isEnglish ? cat.nameEn : cat.nameTr}">
                ${quoteBtnText}
              </a>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });

      // Butonları ve filtreleri yeniden bağla
      initCategoryFilters();
      bindInquireButtons();

    } catch (e) {
      console.log('Static fallback used, data file not fetched.');
    }
  }

  // İlk Başlatma
  initCategoryFilters();
  bindInquireButtons();
  hydrateFromSiteData();
});
