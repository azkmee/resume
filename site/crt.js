/* ========== Shared site behaviors (Tactile theme) ========== */
// Suppress the harmless "ResizeObserver loop" warning that Chrome surfaces
// when an observer callback queues a layout change on the same frame.
window.addEventListener('error', (e) => {
  if (e && e.message && /ResizeObserver loop/.test(e.message)) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

(function () {
  const PREF_KEY = 'site_prefs_v2';
  const DEFAULTS = {
    accent: 'peach',     // peach | sage | clay | butter
    density: 'comfy',    // cozy | comfy | roomy
    width: 90,           // bricolage wdth axis: 75 | 90 | 100 | 110
    shadows: 'soft',     // soft | flat
  };

  const accentMap = {
    peach:  { main: '#e8a87c', soft: '#f5d6b9', deep: '#a05f30' },
    sage:   { main: '#8aa68a', soft: '#c8dbc8', deep: '#3b5a3b' },
    clay:   { main: '#c08274', soft: '#e5c6bd', deep: '#7a3d2e' },
    butter: { main: '#e9c46a', soft: '#f6e3a8', deep: '#7a5a14' },
  };

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch { return { ...DEFAULTS }; }
  }
  function savePrefs(p) {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch {}
  }

  function applyPrefs(p) {
    const root = document.documentElement;
    const a = accentMap[p.accent] || accentMap.peach;
    root.style.setProperty('--accent', a.main);
    root.style.setProperty('--accent-soft', a.soft);
    root.style.setProperty('--peach', a.main);
    root.style.setProperty('--peach-soft', a.soft);

    // density → vertical rhythm
    const dens = p.density === 'cozy' ? 0.85 : p.density === 'roomy' ? 1.18 : 1;
    root.style.setProperty('--rhythm', dens);

    // headline width — set CSS variable; CSS rules consume it via var()
    root.style.setProperty('--wdth', String(p.width));

    // shadows
    if (p.shadows === 'flat') {
      root.style.setProperty('--shadow-sm', '0 0 0 1px rgba(44,36,33,0.08)');
      root.style.setProperty('--shadow-md', '0 0 0 1px rgba(44,36,33,0.12)');
      root.style.setProperty('--shadow-lg', '0 0 0 1px rgba(44,36,33,0.18)');
    } else {
      root.style.setProperty('--shadow-sm', '0 1px 0 rgba(44,36,33,0.05), 0 4px 12px rgba(44,36,33,0.05)');
      root.style.setProperty('--shadow-md', '0 2px 0 rgba(44,36,33,0.06), 0 10px 26px rgba(44,36,33,0.07)');
      root.style.setProperty('--shadow-lg', '0 3px 0 rgba(44,36,33,0.08), 0 20px 40px rgba(44,36,33,0.08)');
    }
  }

  let prefs = loadPrefs();
  if (document.body) applyPrefs(prefs);
  else document.addEventListener('DOMContentLoaded', () => applyPrefs(prefs));

  window.Site = {
    get prefs() { return prefs; },
    setPref(key, val) {
      prefs = { ...prefs, [key]: val };
      savePrefs(prefs);
      applyPrefs(prefs);
      renderTweaks();
    },
  };

  /* ---------- TWEAKS panel ---------- */
  function ensureTweaksMounted() {
    if (document.getElementById('tweaks-panel')) return;
    const el = document.createElement('div');
    el.id = 'tweaks-panel';
    el.className = 'tweaks';
    el.innerHTML = `
      <div class="head">
        <span>✦ Tweaks</span>
        <span class="x" data-x>close</span>
      </div>
      <div class="body">
        <label>Accent</label>
        <div class="swatches" data-group="accent">
          <div class="swatch" data-val="peach" style="background: radial-gradient(circle at 30% 30%, #f5d6b9, #e8a87c);"></div>
          <div class="swatch" data-val="sage"  style="background: radial-gradient(circle at 30% 30%, #c8dbc8, #8aa68a);"></div>
          <div class="swatch" data-val="clay"  style="background: radial-gradient(circle at 30% 30%, #e5c6bd, #c08274);"></div>
          <div class="swatch" data-val="butter" style="background: radial-gradient(circle at 30% 30%, #f6e3a8, #e9c46a);"></div>
        </div>

        <label>Headline width</label>
        <div class="seg" data-group="width">
          <button data-val="75">Narrow</button>
          <button data-val="90">Mid</button>
          <button data-val="110">Wide</button>
        </div>

        <label>Density</label>
        <div class="seg" data-group="density">
          <button data-val="cozy">Cozy</button>
          <button data-val="comfy">Comfy</button>
          <button data-val="roomy">Roomy</button>
        </div>

        <label>Shadows</label>
        <div class="seg" data-group="shadows">
          <button data-val="soft">Soft</button>
          <button data-val="flat">Flat</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    el.addEventListener('click', (e) => {
      const x = e.target.closest('[data-x]');
      if (x) {
        el.classList.remove('open');
        try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
        return;
      }
      const swatch = e.target.closest('.swatch[data-val]');
      if (swatch) {
        window.Site.setPref('accent', swatch.dataset.val);
        return;
      }
      const btn = e.target.closest('button[data-val]');
      if (!btn) return;
      const group = btn.parentElement.dataset.group;
      let v = btn.dataset.val;
      if (group === 'width') v = parseInt(v, 10);
      window.Site.setPref(group, v);
    });
  }

  function renderTweaks() {
    const el = document.getElementById('tweaks-panel');
    if (!el) return;
    el.querySelectorAll('[data-group]').forEach(grp => {
      const key = grp.dataset.group;
      const cur = String(prefs[key]);
      grp.querySelectorAll('button, .swatch').forEach(b => {
        b.classList.toggle('on', b.dataset.val === cur);
      });
    });
  }

  function openTweaks() {
    ensureTweaksMounted();
    renderTweaks();
    document.getElementById('tweaks-panel').classList.add('open');
  }
  function closeTweaks() {
    const el = document.getElementById('tweaks-panel');
    if (el) el.classList.remove('open');
  }

  window.addEventListener('message', (e) => {
    const d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === '__activate_edit_mode') openTweaks();
    if (d.type === '__deactivate_edit_mode') closeTweaks();
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}

  /* ---------- UPTIME (career counter, Jul 2021) ---------- */
  function tickUptime() {
    const els = document.querySelectorAll('[data-uptime]');
    if (!els.length) return;
    const start = new Date('2021-07-01T00:00:00Z').getTime();
    const update = () => {
      const now = Date.now();
      let diff = Math.max(0, now - start);
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hrs = Math.floor(diff / 3600000);
      diff -= hrs * 3600000;
      const min = Math.floor(diff / 60000);
      diff -= min * 60000;
      const sec = Math.floor(diff / 1000);
      const s = `${days}d ${String(hrs).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
      els.forEach(el => el.textContent = s);
    };
    update();
    setInterval(update, 1000);
  }

  /* ---------- LOCAL CLOCK ---------- */
  function tickClock() {
    const els = document.querySelectorAll('[data-clock]');
    if (!els.length) return;
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      els.forEach(el => el.textContent = `${hh}:${mm}`);
    };
    update();
    setInterval(update, 30000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyPrefs(prefs);
    tickUptime();
    tickClock();
  });
})();
