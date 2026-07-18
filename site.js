// Tap a kitty card to read more
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card[data-expand]');
  if (card) card.classList.toggle('open');
});

// ---- Cat menu: fast, random, catlike exits ----
document.addEventListener('click', function (e) {
  const cat = e.target.closest('a.cat-item');
  if (!cat) return;
  e.preventDefault();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { window.location.href = cat.href; return; }

  // current page's cat: happy hop, stay put
  if (cat.classList.contains('here')) {
    const inner = cat.querySelector('.cat-svg-inner');
    if (inner) {
      inner.style.animation = 'hop 0.4s ease';
      setTimeout(function () { inner.style.animation = ''; }, 420);
    }
    return;
  }

  if (cat.dataset.busy) return;
  cat.dataset.busy = '1';
  cat.classList.add('moving');   // label bubble disappears instantly

  const rect = cat.getBoundingClientRect();
  const rand = function (min, max) { return min + Math.random() * (max - min); };

  const runTime = rand(0.3, 0.5);   // seconds, different every click
  cat.style.transitionDuration = runTime.toFixed(2) + 's';

  const exits = ['right', 'right', 'left', 'up', 'down', 'bat', 'zoomies'];
  const exit = exits[Math.floor(Math.random() * exits.length)];
  const doPrep = exit !== 'bat' && Math.random() < 0.5;

  function leave() {
    setTimeout(function () { window.location.href = cat.href; }, runTime * 1000 + 100);
  }

  function run() {
    if (exit === 'bat') {
      cat.classList.add('batting');
      document.body.classList.add('swatted');
      setTimeout(function () {
        cat.classList.remove('batting');
        cat.classList.add('walking');
        cat.style.transform = 'translateX(' + (window.innerWidth - rect.left + 60) + 'px)';
        leave();
      }, 520);
      return;
    }

    cat.classList.add('walking');
    if (exit === 'zoomies') cat.classList.add('zoomies');

    if (exit === 'left') {
      cat.classList.add('face-left');
      cat.style.transform = 'translateX(-' + (rect.right + 60) + 'px)';
    } else if (exit === 'up') {
      const drift = rand(-80, 80).toFixed(0);   // sideways drift looks feline
      cat.style.transform = 'translate(' + drift + 'px, -' + (rect.bottom + 80) + 'px)';
    } else if (exit === 'down') {
      cat.style.transform = 'translateY(' + (window.innerHeight - rect.top + 80) + 'px)';
    } else {
      cat.style.transform = 'translateX(' + (window.innerWidth - rect.left + 60) + 'px)';
    }
    leave();
  }

  if (doPrep) {
    cat.classList.add('prepping');
    setTimeout(function () { cat.classList.remove('prepping'); run(); }, 360);
  } else {
    run();
  }
});
