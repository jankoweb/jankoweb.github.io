(() => {
  async function renderFeed(container) {
    const username = container.dataset.username || 'jankoweb';
    const count = parseInt(container.dataset.count || '6', 10);
    const url = `https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=${count}`;
    container.innerHTML = '<p>Načítám články…</p>';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok');
      const articles = await res.json();
      if (!articles || articles.length === 0) {
        container.innerHTML = '<p>Žádné články k zobrazení.</p>';
        return;
      }
      const ul = document.createElement('ul');
      articles.forEach(a => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.url || (`https://dev.to/${username}/${a.slug}`);
        link.target = '_blank'; link.rel = 'noopener';
        link.textContent = a.title;
        const meta = document.createElement('div');
        meta.className = 'meta';
        const date = a.published_at ? new Date(a.published_at).toLocaleDateString('cs-CZ') : '';
        meta.textContent = `${date} • ${a.reading_time_minutes || '?'} min`;
        li.appendChild(link);
        li.appendChild(meta);
        ul.appendChild(li);
      });
      container.innerHTML = '';
      container.appendChild(ul);
    } catch (err) {
      container.innerHTML = `<p>Nelze načíst články (${err.message}).</p>`;
      console.error(err);
    }
  }

  function init() {
    document.querySelectorAll('.devto-list').forEach(container => renderFeed(container));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
