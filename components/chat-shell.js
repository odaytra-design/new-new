'use client';

import { useMemo, useState } from 'react';
import { PagePreview } from './page-preview';

const starterPrompt = 'اعمل صفحة هبوط لعيادة أسنان في عمان هدفها واتساب وتكون راقية ومقنعة';
const quickChips = ['طبي', 'واتساب', 'حجز موعد', 'فاخر', 'Lead Gen', 'منتج مباشر', 'خدمات محلية'];

function uid() {
  return Math.random().toString(36).slice(2);
}

function prettyPrintCopy(copy) {
  if (!copy) return '';
  return [
    '🔥 العنوان:',
    copy.headline,
    '',
    '✨ الوصف:',
    copy.subheadline,
    '',
    '✅ المزايا:',
    ...(copy.benefits || []).map((x) => '- ' + x),
    '',
    '🚀 CTA:',
    copy.cta,
    '',
    '❓ FAQ:',
    ...((copy.faq || []).map((x) => '- ' + x.q + ' / ' + x.a)),
  ].join('\n');
}

export function ChatShell() {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [improving, setImproving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [copy, setCopy] = useState(null);
  const [html, setHtml] = useState('');

  const canBuild = useMemo(() => Boolean(copy), [copy]);
  const canImprove = useMemo(() => Boolean(copy), [copy]);

  function resetAll() {
    setPrompt(starterPrompt);
    setMessages([]);
    setStrategy(null);
    setCopy(null);
    setHtml('');
  }

  async function generateCopy() {
    if (!prompt.trim()) return;
    setLoadingCopy(true);
    setMessages((prev) => [...prev, { id: uid(), role: 'user', content: prompt }]);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate copy');
      setStrategy(data.strategy);
      setCopy(data.copy);
      setHtml('');
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          content:
            `تم توليد النص الأولي بنجاح.\n\n` +
            `الهدف: ${data.strategy.goal}\n` +
            `الجمهور: ${data.strategy.audience}\n` +
            `الزاوية: ${data.strategy.angle}\n` +
            `الآن تقدر تبني الصفحة أو تطلب تحسينات إضافية.`,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', content: `صار خطأ: ${error.message}` }]);
    } finally {
      setLoadingCopy(false);
    }
  }

  async function buildPage() {
    if (!copy || !prompt.trim()) return;
    setLoadingPage(true);
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: prompt, copy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to build page');
      setHtml(data.html);
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'assistant', content: `تم بناء الصفحة داخل الـ preview. تقدر الآن تراجعها أو تعدل النص وتعيد البناء.` },
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', content: `صار خطأ: ${error.message}` }]);
    } finally {
      setLoadingPage(false);
    }
  }

  async function improvePage(instruction) {
    if (!copy) return;
    setImproving(true);
    setMessages((prev) => [...prev, { id: uid(), role: 'user', content: instruction }]);
    try {
      const res = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction, copy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to improve copy');
      setCopy(data.copy);
      setHtml('');
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'assistant', content: 'تم تحديث النص. إذا بدك شوفه أولاً، أو اضغط Build Page لتحديث المعاينة.' },
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', content: `صار خطأ: ${error.message}` }]);
    } finally {
      setImproving(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">LandingRodi AI</div>
        <div className="brand-sub">منصة توليد صفحات هبوط بأسلوب SaaS حقيقي: تحليل، نص، ثم صفحة هبوط فعلية.</div>
        <button className="new-page-btn" onClick={resetAll}>+ New Project</button>

        <div className="nav-group">
          <div className="nav-title">Workspace</div>
          <div className="nav-item active">Generate Copy</div>
          <div className="nav-item">Build Page</div>
          <div className="nav-item">Templates</div>
          <div className="nav-item">Analytics</div>
        </div>

        <div className="nav-group">
          <div className="nav-title">Strategy Snapshot</div>
          <div className="nav-item">Goal: {strategy?.goal || '—'}</div>
          <div className="nav-item">Angle: {strategy?.angle || '—'}</div>
          <div className="nav-item">Audience: {strategy?.audience || '—'}</div>
          <div className="nav-item">CTA: {copy?.cta || '—'}</div>
        </div>
      </aside>

      <main className="main-panel">
        <div className="topbar">
          <div>
            <div className="topbar-title">Build high-converting landing pages</div>
            <div className="topbar-sub">Generate copy first, then turn it into a clean landing-page preview.</div>
          </div>
          <div className="chip">OpenAI Live</div>
        </div>

        <div className="hero-card">
          <div className="hero-grid">
            <div>
              <h3>واجهة أنظف، فلو أوضح، ومشروع ينفع تنشره كمنصة SaaS فعلية.</h3>
              <p>هذا المسار متعمد: أولًا نولد النص بشكل استراتيجي، بعدها نحوله إلى صفحة هبوط فعلية داخل المعاينة. هيك تبني منتج محترم، مش مجرد toy demo.</p>
            </div>
            <div className="metrics">
              <div className="metric"><strong>01</strong><span>Generate Copy</span></div>
              <div className="metric"><strong>02</strong><span>Improve Messaging</span></div>
              <div className="metric"><strong>03</strong><span>Build Landing Page</span></div>
              <div className="metric"><strong>04</strong><span>Preview Instantly</span></div>
            </div>
          </div>
        </div>

        <div className="workspace">
          <section>
            <div className="card">
              <div className="card-head">
                <div>
                  <h3>Describe the page</h3>
                  <p>صف الصفحة التي تريدها، مع الهدف أو الأسلوب أو نوع النشاط.</p>
                </div>
              </div>
              <div className="card-body">
                <label className="field-label">Prompt</label>
                <textarea className="textarea" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="مثال: اعمل صفحة هبوط لمكتب محاماة في الرياض هدفها جمع ليدز وتكون رسمية" />
                <div className="helper-row">
                  {quickChips.map((chip) => (
                    <button key={chip} className="helper-chip" onClick={() => setPrompt((prev) => `${prev} ${chip}`.trim())}>{chip}</button>
                  ))}
                </div>
                <div className="form-actions">
                  <button className="primary-btn" onClick={generateCopy} disabled={loadingCopy}>{loadingCopy ? 'Generating...' : 'Generate Copy'}</button>
                  <button className="secondary-btn" onClick={buildPage} disabled={!canBuild || loadingPage}>{loadingPage ? 'Building...' : 'Build Landing Page'}</button>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 18 }}>
              <div className="card-head">
                <div>
                  <h3>Generated Copy</h3>
                  <p>راجع النص أولًا قبل بناء الصفحة.</p>
                </div>
              </div>
              <div className="card-body">
                {copy ? <div className="copy-output">{prettyPrintCopy(copy)}</div> : <div className="empty-state">هنا سيظهر النص الأولي بعد التوليد.</div>}
                {canImprove ? (
                  <>
                    <div className="status">Quick improvements</div>
                    <div className="inline-actions">
                      <button className="secondary-btn" disabled={improving} onClick={() => improvePage('خليها أفخم وأكثر ثقة')}>أفخم</button>
                      <button className="secondary-btn" disabled={improving} onClick={() => improvePage('قصر النص وخليه أوضح')}>أقصر</button>
                      <button className="secondary-btn" disabled={improving} onClick={() => improvePage('زود الإقناع وخلي ال CTA أقوى')}>أقوى بالإقناع</button>
                      <button className="secondary-btn" disabled={improving} onClick={() => improvePage('خليها مناسبة أكثر لإعلانات فيسبوك')}>Facebook Ads</button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>{message.content}</div>
              ))}
            </div>
          </section>

          <section className="preview-panel">
            <div className="preview-toolbar">
              <div>
                <div className="topbar-title">Live Preview</div>
                <div className="topbar-sub">معاينة مباشرة للصفحة الناتجة</div>
              </div>
              {copy ? <div className="chip">{copy.cta}</div> : null}
            </div>
            <PagePreview html={html} loading={loadingPage} />
          </section>
        </div>
      </main>
    </div>
  );
}
