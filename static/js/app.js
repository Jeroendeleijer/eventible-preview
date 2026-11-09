// Small progressive enhancements. The app works without this file.

// Copy-link buttons in the share sheet.
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    const original = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = original; }, 1600);
  } catch (err) {
    window.prompt('Copy this link', btn.dataset.copy);
  }
});

// Native share sheet on mobile, where the browser offers one.
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-share]');
  if (!btn || !navigator.share) return;
  e.preventDefault();
  try {
    await navigator.share({title: btn.dataset.shareTitle || document.title,
                           url: btn.dataset.share});
  } catch (err) { /* user dismissed */ }
});

// Autosave the event editor so a long form is never lost (US-O1).
const form = document.getElementById('eventform');
if (form) {
  let timer = null, saving = false;
  const mark = (text) => {
    let el = document.getElementById('autosave');
    if (!el) {
      el = document.createElement('div');
      el.id = 'autosave';
      el.style.cssText = 'position:fixed;right:16px;bottom:88px;z-index:120;background:var(--ink);' +
                         'color:#fff;padding:7px 14px;border-radius:999px;font-size:.78rem;' +
                         'font-weight:700;opacity:0;transition:opacity .2s';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, 1800);
  };
  const save = async () => {
    if (saving) return;
    saving = true;
    try {
      await fetch(form.action, {method: 'POST', body: new FormData(form)});
      mark('Draft saved');
    } catch (err) {
      mark('Could not save — check your connection');
    }
    saving = false;
  };
  form.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(save, 2500);
  });
}
