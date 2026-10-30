// Language switch: English lives in the HTML, Turkish in each element's data-tr attribute.
// Images swap between /en/ and /tr/ folders through data-lang-src="assets/game/{lang}/1.jpg".
(function () {
  const buttons = document.querySelectorAll('.lang button');

  function savedLang() {
    try { return localStorage.getItem('mk-lang'); } catch (e) { return null; }
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-tr]').forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === 'tr' ? el.dataset.tr : el.dataset.en;
    });
    document.querySelectorAll('[data-tr-alt]').forEach((el) => {
      if (el.dataset.enAlt === undefined) el.dataset.enAlt = el.alt;
      el.alt = lang === 'tr' ? el.dataset.trAlt : el.dataset.enAlt;
    });
    document.querySelectorAll('[data-tr-label]').forEach((el) => {
      if (el.dataset.enLabel === undefined) el.dataset.enLabel = el.getAttribute('aria-label');
      el.setAttribute('aria-label', lang === 'tr' ? el.dataset.trLabel : el.dataset.enLabel);
    });
    document.querySelectorAll('[data-lang-src]').forEach((img) => {
      img.src = img.dataset.langSrc.replace('{lang}', lang);
    });
    if (document.body.dataset.titleTr) {
      document.body.dataset.titleEn = document.body.dataset.titleEn || document.title;
      document.title = lang === 'tr' ? document.body.dataset.titleTr : document.body.dataset.titleEn;
    }
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  buttons.forEach((b) => b.addEventListener('click', () => {
    apply(b.dataset.lang);
    try { localStorage.setItem('mk-lang', b.dataset.lang); } catch (e) { /* the choice just isn't remembered */ }
  }));

  apply(savedLang() || ((navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en'));

  // Screenshot viewer: opens a tapped screenshot full size, arrows move within the same game.
  const viewer = document.querySelector('dialog.viewer');
  if (!viewer) return;
  const big = viewer.querySelector('img');
  let group = [];
  let index = 0;

  function show(i) {
    index = (i + group.length) % group.length;
    const img = group[index].querySelector('img');
    big.src = img.src;
    big.alt = img.alt;
  }

  document.querySelectorAll('.shots').forEach((shots) => {
    const items = [...shots.querySelectorAll('.shot')];
    items.forEach((item, i) => item.addEventListener('click', () => {
      group = items;
      show(i);
      viewer.showModal();
    }));
  });

  viewer.querySelector('.v-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.v-prev').addEventListener('click', () => show(index - 1));
  viewer.querySelector('.v-next').addEventListener('click', () => show(index + 1));
  viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
