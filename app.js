(() => {
  const form = document.querySelector("#searchForm");
  const input = document.querySelector("#query");
  const chips = [...document.querySelectorAll(".type-chip")];
  const recentSection = document.querySelector("#recentSection");
  const recentList = document.querySelector("#recentList");
  const HISTORY_KEY = "pawsearch-history-v1";
  let searchType = "web";
  const destinations = {
    web: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    images: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`,
    videos: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=videos&ia=videos`,
    news: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}&iar=news&ia=news`
  };
  function getHistory() {
    try { const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); return Array.isArray(value) ? value : []; }
    catch { return []; }
  }
  function renderHistory() {
    const history = getHistory();
    recentSection.hidden = history.length === 0;
    recentList.replaceChildren();
    history.forEach(term => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "recent-item"; button.textContent = `↻ ${term}`;
      button.addEventListener("click", () => { input.value = term; doSearch(term); });
      recentList.append(button);
    });
  }
  function doSearch(raw) {
    const query = raw.trim();
    if (!query) { input.focus(); return; }
    try {
      const history = getHistory().filter(item => item.toLowerCase() !== query.toLowerCase());
      history.unshift(query);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 8)));
    } catch { /* Search still works if storage is unavailable. */ }
    window.location.href = destinations[searchType](query);
  }
  form.addEventListener("submit", event => { event.preventDefault(); doSearch(input.value); });
  chips.forEach(chip => chip.addEventListener("click", () => {
    searchType = chip.dataset.type;
    chips.forEach(item => { const active = item === chip; item.classList.toggle("active", active); item.setAttribute("aria-pressed", String(active)); });
    input.placeholder = `Search ${searchType === "web" ? "anything" : searchType}...`;
    input.focus();
  }));
  document.querySelector("#clearRecent").addEventListener("click", () => {
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
    renderHistory();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
      event.preventDefault(); input.focus();
    }
    if (event.key === "Escape" && document.activeElement === input) input.blur();
  });
  renderHistory();
  input.focus({ preventScroll: true });
})();