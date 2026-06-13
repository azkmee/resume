/* ============================================================
   Renders the Work page from the single source of truth:
   data/portfolio.json. Update a win there → the page updates.
   Tries multiple paths so it works both locally (served from the
   repo root) and on GitHub Pages (data copied next to the site).
   ============================================================ */
(function () {
  const CANDIDATES = ['data/portfolio.json', '../data/portfolio.json', '../portfolio.json'];

  async function loadPortfolio() {
    // Offline/preview builds inject the data as a global so no server is needed.
    if (window.__PORTFOLIO__) return window.__PORTFOLIO__;
    for (const url of CANDIDATES) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) return await res.json();
      } catch (_) { /* try next */ }
    }
    throw new Error('portfolio.json not reachable from any known path');
  }

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fmtMonth(s) {
    if (!s) return '';
    const [y, m] = String(s).split('-');
    return m ? `${MONTHS[parseInt(m, 10) - 1]} ${y}` : y;
  }
  function roleRange(role) {
    const start = fmtMonth(role.start);
    const end = role.end ? fmtMonth(role.end) : 'Present';
    if (!start && !role.end) return 'dates TBC';
    return `${start || '?'} → ${end}`;
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

  function renderTimeline(container, data) {
    container.innerHTML = '';
    const byRole = {};
    data.achievements.forEach(a => { (byRole[a.role_id] = byRole[a.role_id] || []).push(a); });

    data.roles.forEach((role, i) => {
      const isCurrent = i === 0 && !role.end;
      const entry = el('div', 'entry' + (isCurrent ? ' current' : ''));
      entry.appendChild(el('div', 'when', esc(roleRange(role) + (isCurrent ? ' · current' : ''))));
      entry.appendChild(el('div', 'title', esc(role.title)));
      entry.appendChild(el('div', 'org', esc(role.company + (role.location ? ' · ' + role.location : ''))));

      const ul = el('ul');
      if (role.scope) ul.appendChild(el('li', null, esc(role.scope)));
      (byRole[role.id] || []).forEach(a => {
        const bullet = (a.resume_bullets && a.resume_bullets[0]) || a.title;
        ul.appendChild(el('li', null, esc(bullet)));
      });
      if (!ul.children.length) ul.appendChild(el('li', null, '<span class="muted">—</span>'));
      entry.appendChild(ul);
      container.appendChild(entry);
    });
  }

  function renderCases(container, data) {
    container.innerHTML = '';
    const cases = data.achievements.filter(a => a.showcase);
    cases.forEach((a, i) => {
      const card = el('a', 'proj-card');
      card.href = '#';
      card.addEventListener('click', e => e.preventDefault());
      const pid = 'CS-' + String(i + 1).padStart(2, '0');
      const stack = (a.skills || []).slice(0, 3).map(esc).join(' · ');
      const result = (a.metrics && a.metrics.length) ? a.metrics[0] : '—';
      const tags = (a.tags || []).slice(0, 3).map(esc).join(' · ');
      card.innerHTML =
        `<div class="ph-head"><span class="pid">${esc(pid)}</span><span>${esc(a.date || '')}</span></div>` +
        `<h3>${esc(a.title)}</h3>` +
        `<p>${esc(a.star ? a.star.result : '')}</p>` +
        `<div class="meta">` +
          `<div class="mk">Stack</div><div class="mv">${stack || '<span class="muted">—</span>'}</div>` +
          `<div class="mk">Result</div><div class="mv sage">${esc(result)}</div>` +
          `<div class="mk">Tags</div><div class="mv peach">${tags}</div>` +
        `</div>`;
      container.appendChild(card);
    });
    return cases.length;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const timeline = document.querySelector('[data-roles]');
    const cases = document.querySelector('[data-cases]');
    if (!timeline && !cases) return;

    try {
      const data = await loadPortfolio();
      if (timeline) renderTimeline(timeline, data);
      const caseCount = cases ? renderCases(cases, data) : 0;
      document.querySelectorAll('[data-role-count]').forEach(e => { e.textContent = data.roles.length; });
      document.querySelectorAll('[data-case-count]').forEach(e => { e.textContent = caseCount; });
    } catch (err) {
      console.error(err);
      const msg = 'Serve the site over HTTP (e.g. <code>python -m http.server</code> from the repo root) so the browser can fetch data/portfolio.json.';
      if (timeline) timeline.innerHTML = `<div class="entry"><div class="title">Couldn't load portfolio data</div><ul><li class="muted">${msg}</li></ul></div>`;
      if (cases) cases.innerHTML = `<span class="kicker muted">${msg}</span>`;
    }
  });
})();
