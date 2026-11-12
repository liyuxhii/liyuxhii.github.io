// Accordion (home page)
document.querySelectorAll('.acc-head').forEach(btn => btn.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  document.getElementById(btn.getAttribute('aria-controls')).classList.toggle('open', !open);
}));

// Portfolio filter ("All" shows everything)
const filters = [...document.querySelectorAll('.filters button')];
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  const cat = btn.dataset.cat;
  document.querySelectorAll('.tile').forEach(t => {
    t.hidden = cat !== 'all' && t.dataset.cat !== cat;
  });
}));

// Viewer: clicking a project opens all of its pictures and videos
const tiles = [...document.querySelectorAll('.tile')].filter(t => t.querySelector('.thumb img'));
if (tiles.length) {
  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.innerHTML = '<button class="lb-close" aria-label="Close">✕</button>' +
    '<button class="lb-nav lb-prev" aria-label="Previous">‹</button><div class="lb-media"></div>' +
    '<button class="lb-nav lb-next" aria-label="Next">›</button><p class="lb-info"></p>';
  document.body.append(dlg);
  const media = dlg.querySelector('.lb-media'), info = dlg.querySelector('.lb-info');
  let list = [], i = 0, title = '';

  const show = () => {
    const el = list[i];
    let node;
    if (el.dataset.video) {                       // your own video file
      node = document.createElement('video');
      node.src = el.dataset.video;
      node.controls = true;
      node.autoplay = true;
      node.playsInline = true;
    } else if (el.dataset.youtube) {              // YouTube video
      node = document.createElement('iframe');
      node.src = 'https://www.youtube-nocookie.com/embed/' + el.dataset.youtube + '?autoplay=1';
      node.allow = 'autoplay; fullscreen; picture-in-picture';
      node.allowFullscreen = true;
      node.title = el.alt;
    } else {                                      // normal picture
      node = document.createElement('img');
      node.src = el.src;
      node.alt = el.alt;
    }
    media.replaceChildren(node);
    info.textContent = title + (list.length > 1 ? ` (${i + 1} / ${list.length})` : '');
    dlg.classList.toggle('single', list.length < 2);
  };
  const step = d => { i = (i + d + list.length) % list.length; show(); };

  tiles.forEach(t => {
    t.classList.add('has-images');
    t.tabIndex = 0;
    t.setAttribute('role', 'button');
    const open = () => {
      list = [...t.querySelectorAll('.thumb img')];
      i = 0;
      title = t.querySelector('figcaption').textContent;
      show();
      dlg.showModal();
    };
    t.addEventListener('click', open);
    t.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
  dlg.querySelector('.lb-prev').onclick = () => step(-1);
  dlg.querySelector('.lb-next').onclick = () => step(1);
  dlg.querySelector('.lb-close').onclick = () => dlg.close();
  dlg.addEventListener('close', () => media.replaceChildren());   // stops the video
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
}
