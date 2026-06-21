/* ============================================================
   Renders the showcase from the single source of truth:
   data/portfolio.json.

   - projects.html  → grid of type:project records (surface≠resume),
                      filterable by work / personal.
   - project.html   → one project's detail: structured header from the
                      JSON + long-form narrative from its content_ref
                      markdown (rendered by markdown.js).

   Tries multiple paths so it works locally (served from the repo root)
   and on GitHub Pages (data + content copied next to the site).
   ============================================================ */
(function () {
  const DATA_CANDIDATES = ['data/portfolio.json', '../data/portfolio.json', '../portfolio.json'];

  async function loadPortfolio() {
    if (window.__PORTFOLIO__) return window.__PORTFOLIO__;
    for (const url of DATA_CANDIDATES) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) return await res.json();
      } catch (_) { /* try next */ }
    }
    throw new Error('portfolio.json not reachable from any known path');
  }

  async function loadContent(ref) {
    // Offline/preview builds inject markdown bodies as a global, keyed by content_ref.
    if (window.__CONTENT__ && window.__CONTENT__[ref] != null) return window.__CONTENT__[ref];
    for (const url of [ref, '../' + ref]) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) return await res.text();
      } catch (_) { /* try next */ }
    }
    throw new Error('content not reachable: ' + ref);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function statusChip(status) {
    const map = { shipped: 'sage', 'in-progress': 'peach', archived: 'outline' };
    return `<span class="chip ${map[status] || 'outline'}">${esc(status || '—')}</span>`;
  }

  function siteProjects(data) {
    return data.achievements.filter(a => a.type === 'project' && a.surface !== 'resume');
  }

  /* ---------- projects.html ---------- */
  function renderProjects(container, data) {
    const projects = siteProjects(data);
    function paint(filter) {
      container.innerHTML = '';
      const shown = projects.filter(p => filter === 'all' || p.category === filter);
      shown.forEach((p, i) => {
        const proj = p.project || {};
        const card = el('a', 'proj-card');
        card.href = 'project.html?id=' + encodeURIComponent(p.id);
        const pid = (p.category === 'personal' ? 'PR-' : 'WK-') + String(i + 1).padStart(2, '0');
        const stack = (proj.stack || []).slice(0, 4).map(s => `<span class="chip">${esc(s)}</span>`).join('');
        card.innerHTML =
          `<div class="ph-head"><span class="pid">${esc(pid)}</span><span>${esc(p.category)} · ${esc(p.date || '')}</span></div>` +
          `<h3>${esc(p.title)}</h3>` +
          `<p>${esc(proj.summary || (p.star ? p.star.result : ''))}</p>` +
          `<div style="margin:10px 0 12px;">${stack}</div>` +
          `<div class="proj-foot">${statusChip(proj.status)}<span class="arr">Open →</span></div>`;
        container.appendChild(card);
      });
      if (!shown.length) container.appendChild(el('p', 'muted', 'Nothing here yet.'));
    }

    const filterRow = document.querySelector('[data-filter]');
    if (filterRow) {
      const counts = {
        all: projects.length,
        work: projects.filter(p => p.category === 'work').length,
        personal: projects.filter(p => p.category === 'personal').length,
      };
      filterRow.querySelectorAll('.filter-chip').forEach(chip => {
        const f = chip.dataset.f;
        chip.textContent = chip.textContent.replace(/\s*\(\d+\)$/, '') + ` (${counts[f] ?? 0})`;
        chip.addEventListener('click', () => {
          filterRow.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('on'));
          chip.classList.add('on');
          paint(f);
        });
      });
    }
    paint('all');
    document.querySelectorAll('[data-project-count]').forEach(e => { e.textContent = projects.length; });
  }

  /* ---------- project.html ---------- */
  async function renderDetail(root, data) {
    const id = new URLSearchParams(location.search).get('id');
    const p = data.achievements.find(a => a.id === id && a.type === 'project');
    if (!p) {
      root.innerHTML = `<div class="panel"><h3>Project not found</h3><p class="muted">No project with id <code>${esc(id || '')}</code>. <a href="projects.html">Back to projects →</a></p></div>`;
      return;
    }
    const proj = p.project || {};
    document.title = p.title + ' — portfolio';

    const head = document.querySelector('[data-detail-head]');
    if (head) {
      const stack = (proj.stack || []).map(s => `<span class="chip">${esc(s)}</span>`).join('');
      const links = (proj.links || []).filter(l => l.url)
        .map(l => `<a class="btn ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || 'Link')} →</a>`).join('');
      head.innerHTML =
        `<span class="kicker">${esc(p.category)} · ${esc(proj.status || '')} · ${esc(p.date || '')}</span>` +
        `<h1>${esc(p.title)}</h1>` +
        `<p class="sub">${esc(proj.summary || '')}</p>` +
        (proj.my_role ? `<p class="muted" style="margin:-10px 0 18px;max-width:620px;"><b>My role:</b> ${esc(proj.my_role)}</p>` : '') +
        `<div style="margin-bottom:16px;">${stack}</div>` +
        (links ? `<div class="actions">${links}<a class="btn ghost" href="projects.html">← All projects</a></div>`
                : `<div class="actions"><a class="btn ghost" href="projects.html">← All projects</a></div>`);
    }

    const body = document.querySelector('[data-detail-body]');
    if (body) {
      try {
        const md = await loadContent(proj.content_ref);
        body.innerHTML = window.renderMarkdown(md);
        if (window.initDiagrams) window.initDiagrams(body);
      } catch (err) {
        console.error(err);
        body.innerHTML = `<p class="muted">Couldn't load the write-up (<code>${esc(proj.content_ref || '')}</code>). Serve the site over HTTP or run the offline build.</p>`;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const projects = document.querySelector('[data-projects]');
    const detail = document.querySelector('[data-detail]');
    if (!projects && !detail) return;
    try {
      const data = await loadPortfolio();
      if (projects) renderProjects(projects, data);
      if (detail) await renderDetail(detail, data);
    } catch (err) {
      console.error(err);
      const msg = 'Serve the site over HTTP (e.g. <code>python -m http.server</code> from the repo root) so the browser can fetch data/portfolio.json.';
      if (projects) projects.innerHTML = `<p class="muted">${msg}</p>`;
      if (detail) detail.innerHTML = `<div class="panel"><p class="muted">${msg}</p></div>`;
    }
  });
})();
