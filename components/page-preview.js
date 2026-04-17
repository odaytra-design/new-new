export function PagePreview({ html, loading }) {
  if (loading) {
    return (
      <div className="empty-state">
        <div className="empty-box">
          <h3 style={{ color: 'white', marginTop: 0 }}>جاري تجهيز المعاينة</h3>
          <p>الآن نحول النص إلى صفحة هبوط فعلية مع أقسام وترتيب وCTA واضح.</p>
          <div className="loading-bar"><span /></div>
        </div>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="empty-state">
        <div className="empty-box">
          <h3 style={{ color: 'white', marginTop: 0 }}>الـ Preview رح يظهر هون</h3>
          <p>اكتب وصف الصفحة، ولّد النص، ثم ابنِ الصفحة داخل المعاينة المباشرة.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-shell">
      <iframe className="preview-frame" srcDoc={html} title="Landing Page Preview" />
    </div>
  );
}
