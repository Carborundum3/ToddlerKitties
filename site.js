// Tap a kitty card to read more
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card[data-expand]');
  if (card) card.classList.toggle('open');
});

// Cat menu: click a cat and it walks off the page, then navigates
document.addEventListener('click', function (e) {
  const cat = e.target.closest('a.cat-item');
  if (!cat) return;
  e.preventDefault();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { window.location.href = cat.href; return; }

  // clicking the cat for the current page = a happy hop, no navigation
  if (cat.classList.contains('here')) {
    const inner = cat.querySelector('.cat-svg-inner');
    if (inner) {
      inner.style.animation = 'hop 0.5s ease';
      setTimeout(function () { inner.style.animation = ''; }, 520);
    }
    return;
  }

  cat.classList.add('walking');
  const rect = cat.getBoundingClientRect();
  const distance = window.innerWidth - rect.left + 60;
  requestAnimationFrame(function () {
    cat.style.transform = 'translateX(' + distance + 'px)';
  });

  setTimeout(function () { window.location.href = cat.href; }, 1550);
});
