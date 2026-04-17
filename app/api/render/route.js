export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { headline, subheadline, cta, benefits } = await request.json();

    const safeBenefits = Array.isArray(benefits) ? benefits : [];
    const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headline || "Landing Preview"}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#081120;color:#fff}
    .wrap{max-width:1200px;margin:auto;padding:40px 24px}
    .badge{display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(99,102,241,.16);border:1px solid rgba(129,140,248,.35);color:#c7d2fe;font-weight:700;font-size:13px;margin-bottom:16px}
    .hero{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;align-items:center;min-height:80vh}
    .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:24px}
    h1{font-size:52px;line-height:1.2;margin:0 0 16px}
    p{color:#cbd5e1;line-height:1.9;font-size:18px}
    .btn{display:inline-block;background:linear-gradient(90deg,#4f46e5,#06b6d4);color:#fff;padding:14px 18px;border-radius:14px;text-decoration:none;font-weight:700;margin-top:14px}
    ul{padding:0;list-style:none;display:grid;gap:12px;margin:20px 0 0}
    li{background:rgba(15,23,42,.75);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px}
    @media (max-width:900px){.hero{grid-template-columns:1fr}h1{font-size:38px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <div>
        <div class="badge">Landing Preview</div>
        <h1>${headline || "عنوان الصفحة"}</h1>
        <p>${subheadline || "وصف الصفحة"}</p>
        <a href="#" class="btn">${cta || "ابدأ الآن"}</a>
      </div>
      <div class="card">
        <h3 style="margin-top:0">المزايا</h3>
        <ul>
          ${safeBenefits.map((item) => `<li>✓ ${item}</li>`).join("")}
        </ul>
      </div>
    </div>
  </div>
</body>
</html>`;
    return NextResponse.json({ html });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
