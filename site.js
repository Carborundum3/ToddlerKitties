// Tap a kitty card to read more
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card[data-expand]');
  if (card) card.classList.toggle('open');
});

// Cat menu: click a cat -> random exit action -> navigate
document.addEventListener('click', function (e) {
  const cat = e.target.closest('a.cat-item');
  if (!cat) return;
  e.preventDefault();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { window.location.href = cat.href; return; }

  // clicking the current page's cat = a happy hop, no navigation
  if (cat.classList.contains('here')) {
    const inner = cat.querySelector('.cat-svg-inner');
    if (inner) {
      inner.style.animation = 'hop 0.5s ease';
      setTimeout(function () { inner.style.animation = ''; }, 520);
    }
    return;
  }

  if (cat.classList.contains('walking') || cat.classList.contains('batting')) return;

  const rect = cat.getBoundingClientRect();
  const actions = ['right', 'left', 'up', 'down', 'bat'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  let wait = 1000;

  function go() {
    setTimeout(function () { window.location.href = cat.href; }, wait);
  }

  if (action === 'bat') {
    // rear up and swat the page, then scamper off to the right
    cat.classList.add('batting');
    document.body.classList.add('swatted');
    setTimeout(function () {
      cat.classList.remove('batting');
      cat.classList.add('walking');
      cat.style.transform = 'translateX(' + (window.innerWidth - rect.left + 60) + 'px)';
    }, 820);
    wait = 1750;
    go();
    return;
  }

  cat.classList.add('walking');
  if (action === 'right') {
    cat.style.transform = 'translateX(' + (window.innerWidth - rect.left + 60) + 'px)';
  } else if (action === 'left') {
    cat.classList.add('face-left');
    cat.style.transform = 'translateX(-' + (rect.right + 60) + 'px)';
  } else if (action === 'up') {
    cat.style.transform = 'translateY(-' + (rect.bottom + 80) + 'px)';
  } else if (action === 'down') {
    cat.style.transform = 'translateY(' + (window.innerHeight - rect.top + 80) + 'px)';
  }
  go();
});
