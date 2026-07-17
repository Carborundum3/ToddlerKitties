// ------- Cat menu: click a cat and it walks off the page, then navigates -------
document.addEventListener('click', function (e) {
  const cat = e.target.closest('a.cat-item');
  if (!cat) return;
  e.preventDefault();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { window.location.href = cat.href; return; }

  // already on this page? give a little hop instead of leaving
  if (cat.classList.contains('here')) {
    const inner = cat.querySelector('.cat-svg-inner');
    if (inner) {
      inner.style.animation = 'hop 0.5s ease';
      setTimeout(function () { inner.style.animation = ''; }, 520);
    }
    return;
  }

  // start the walk: legs + trot via CSS, whole cat slides to the right edge
  cat.classList.add('walking');
  const rect = cat.getBoundingClientRect();
  const distance = window.innerWidth - rect.left + 60; // fully off-screen
  requestAnimationFrame(function () {
    cat.style.transform = 'translateX(' + distance + 'px)';
  });

  // when the stroll ends, turn the page
  setTimeout(function () {
    const book = document.querySelector('.book');
    if (book) book.classList.add('turning');
    setTimeout(function () { window.location.href = cat.href; }, 300);
  }, 1500);
});

// ------- Other page-turn links (Open the Book, prev/next buttons) -------
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[data-turn]');
  if (!link) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  e.preventDefault();
  const book = document.querySelector('.book');
  book.classList.add('turning');
  setTimeout(function () { window.location.href = link.href; }, 320);
});

// ------- Expandable kitty cards -------
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card[data-expand]');
  if (card) card.classList.toggle('open');
});

// ------- Arrow keys flip pages like a real book -------
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    const next = document.querySelector('.page-btn.next:not(.hidden)');
    if (next) next.click();
  } else if (e.key === 'ArrowLeft') {
    const prev = document.querySelector('.page-btn.prev:not(.hidden)');
    if (prev) prev.click();
  }
});
