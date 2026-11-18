/* 渐进增强：正文、案例链接与服务导航均已在 HTML 中。 */
(() => {
  const menu = document.querySelector('.service-menu');
  const summary = menu?.querySelector('summary');
  if (menu) {
    let hoverOpened = false;
    menu.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && matchMedia('(min-width:851px)').matches && !menu.open) {
        menu.open = true; hoverOpened = true;
      }
    });
    menu.addEventListener('pointerleave', () => {
      if (hoverOpened && !menu.contains(document.activeElement)) { menu.open = false; hoverOpened = false; }
    });
    summary.addEventListener('click', event => {
      if (hoverOpened) { event.preventDefault(); hoverOpened = false; menu.open = true; }
    });
    document.addEventListener('click', event => { if (!menu.contains(event.target)) {menu.open = false;hoverOpened = false;} });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {menu.open = false;hoverOpened = false;summary.focus();}
    });
    menu.addEventListener('focusout', () => {
      setTimeout(() => {if (!menu.contains(document.activeElement) && !menu.matches(':hover')) {menu.open = false;hoverOpened = false;}}, 0);
    });
  }
  const list = document.getElementById('case-list');
  if (!list) return;
  const form = document.querySelector('.case-filters');
  const category = document.getElementById('category-filter');
  const year = document.getElementById('year-filter');
  const sort = document.getElementById('sort-filter');
  const cards = Array.from(list.children);
  const params = new URLSearchParams(location.search);
  for (const control of [category, year, sort]) {
    const value = params.get(control.name);
    if (value && Array.from(control.options).some(option => option.value === value)) control.value = value;
  }
  function update(replace = true) {
    const ordered = cards.slice().sort((a, b) => {
      const x = Number(a.dataset.year), y = Number(b.dataset.year);
      if (!Number.isFinite(x)) return Number.isFinite(y) ? 1 : 0;
      if (!Number.isFinite(y)) return -1;
      return sort.value === 'asc' ? x-y : y-x;
    });
    let count = 0;
    for (const card of ordered) {
      card.hidden = !((category.value === 'all' || card.dataset.category === category.value) && (year.value === 'all' || card.dataset.year === year.value));
      if (!card.hidden) count++;
      list.append(card);
    }
    document.getElementById('case-count').textContent = '共 ' + count + ' 项';
    document.getElementById('empty-state').hidden = count !== 0;
    if (replace) {
      const next = new URL(location.href);
      for (const control of [category,year,sort]) {
        if (control.value === 'all' || (control === sort && control.value === 'desc')) next.searchParams.delete(control.name);
        else next.searchParams.set(control.name,control.value);
      }
      history.replaceState(null,'',next);
    }
  }
  form.addEventListener('change', () => update());
  form.addEventListener('submit', event => {event.preventDefault();update();});
  form.addEventListener('reset', () => setTimeout(() => update(),0));
  update(false);
})();
