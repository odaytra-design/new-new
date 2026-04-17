export function renderLandingPageHtml({ idea, copy }) {
  const benefits = (copy?.benefits || []).map((item) => `
    <div class="benefit-card">
      <div class="benefit-icon">✓</div>
      <div class="benefit-text">${escapeHtml(item)}</div>
    </div>
  `).join('');

  const faq = (copy?.faq || []).map((item) => `
    <div class="faq-item">
      <div class="faq-q">${escapeHtml(item.q)}</div>
      <div class="faq-a">${escapeHtml(item.a)}</div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(copy.headline)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, Arial, sans-serif; background: #08111c; color: #f7fbff; line-height: 1.7; }
    .hero { min-height: 72vh; display: flex; align-items: center; justify-content: center; padding: 48px 22px; text-align: center; background:
      radial-gradient(circle at top right, rgba(86,169,255,.18), transparent 24%),
      radial-gradient(circle at top left, rgba(40,241,154,.14), transparent 22%),
      linear-gradient(180deg, #0a1320, #050a12); }
    .hero-inner { max-width: 920px; }
    .badge { display: inline-block; margin-bottom: 18px; padding: 8px 14px; border-radius: 999px; color: #0d1117; background: #28f19a; font-weight: 800; font-size: 13px; }
    h1 { font-size: 54px; line-height: 1.12; margin: 0 0 16px; }
    .subheadline { max-width: 760px; margin: 0 auto 28px; color: #d6e2f2; font-size: 22px; }
    .cta-btn { display: inline-block; padding: 16px 30px; border-radius: 14px; background: linear-gradient(135deg, #28f19a, #1cd789); color: #08111c; font-weight: 800; text-decoration: none; font-size: 18px; }
    .section { padding: 72px 22px; }
    .container { max-width: 1100px; margin: 0 auto; }
    .section-title { text-align: center; font-size: 38px; margin: 0 0 16px; }
    .section-sub { max-width: 760px; margin: 0 auto 34px; text-align: center; color: #c8d5e7; font-size: 18px; }
    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; }
    .benefit-card, .faq-item, .proof { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 24px; }
    .benefit-card { padding: 22px; }
    .benefit-icon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: #28f19a; color: #08111c; font-weight: 800; margin-bottom: 14px; }
    .benefit-text { color: #ecf4ff; font-size: 17px; }
    .proof { max-width: 860px; margin: 0 auto; padding: 28px; text-align: center; color: #dce8f8; font-size: 21px; }
    .faq-wrap { max-width: 900px; margin: 0 auto; }
    .faq-item { padding: 18px 20px; margin-bottom: 14px; }
    .faq-q { font-weight: 800; margin-bottom: 8px; }
    .faq-a { color: #d2def1; }
    .final-cta { padding: 84px 22px 104px; text-align: center; }
    .final-cta h2 { font-size: 42px; margin: 0 0 14px; }
    .final-cta p { color: #cbd8ea; max-width: 760px; margin: 0 auto 26px; font-size: 20px; }
    @media (max-width: 760px) { h1 { font-size: 36px; } .subheadline { font-size: 18px; } .section-title { font-size: 30px; } .final-cta h2 { font-size: 32px; } .final-cta p { font-size: 18px; } }
  </style>
</head>
<body>
  <section class="hero">
    <div class="hero-inner">
      <div class="badge">LandingRodi AI</div>
      <h1>${escapeHtml(copy.headline)}</h1>
      <div class="subheadline">${escapeHtml(copy.subheadline)}</div>
      <a class="cta-btn" href="#final-cta">${escapeHtml(copy.cta)}</a>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">ليش هذا العرض أقوى؟</h2>
      <p class="section-sub">تم توليد هذه الصفحة للفكرة: ${escapeHtml(idea)} مع ترتيب المقاطع بشكل يركز على الوضوح والإقناع والتحويل.</p>
      <div class="benefits-grid">${benefits}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">نتيجة أوضح، قرار أسرع</h2>
      <div class="proof">بدل التخمين، هذه الصفحة تعرض ${escapeHtml(idea)} بشكل مباشر ومنظم حتى يتحول الاهتمام إلى إجراء.</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">الأسئلة الشائعة</h2>
      <p class="section-sub">كسر الاعتراضات جزء أساسي من أي صفحة هبوط ناجحة.</p>
      <div class="faq-wrap">${faq}</div>
    </div>
  </section>

  <section class="final-cta" id="final-cta">
    <h2>جاهز تبدأ الآن؟</h2>
    <p>إذا كانت هذه الفكرة مناسبة لك، فهذه أفضل لحظة لتحويلها من فكرة إلى خطوة فعلية.</p>
    <a class="cta-btn" href="#">${escapeHtml(copy.cta)}</a>
  </section>
</body>
</html>`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
