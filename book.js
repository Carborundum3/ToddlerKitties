// Page-turn transition: animate the book closing, then go to the next page
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[data-turn]');
  if (!link) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // navigate normally
  e.preventDefault();
  const book = document.querySelector('.book');
  book.classList.add('turning');
  setTimeout(function () { window.location.href = link.href; }, 320);
});

// Expandable cards: tap a kitty to read more
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card[data-expand]');
  if (card) card.classList.toggle('open');
});

// Arrow keys flip pages like a real book
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    const next = document.querySelector('.page-btn.next:not(.hidden)');
    if (next) next.click();
  } else if (e.key === 'ArrowLeft') {
    const prev = document.querySelector('.page-btn.prev:not(.hidden)');
    if (prev) prev.click();
  }
});
