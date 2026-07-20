// Tap a kitty card to read more
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card[data-expand]');
  if (card) card.classList.toggle('open');
});

// ---- Cat menu: fast random catlike exits + mini events ----
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
  cat.classList.add('moving');            // hide the label bubble instantly

  const rect = cat.getBoundingClientRect();
  const rand = function (min, max) { return min + Math.random() * (max - min); };
  const coin = function () { return Math.random() < 0.5; };

  function setMove(x, y, secs, ease) {
    cat.style.transitionDuration = secs + 's';
    if (ease) cat.style.transitionTimingFunction = ease;
    requestAnimationFrame(function () {
      cat.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
  }

  function dashOff(delayMs) {
    setTimeout(function () {
      cat.classList.add('walking');
      cat.classList.remove('zoomies');
      const t = rand(0.28, 0.4);
      setMove(window.innerWidth - rect.left + 80, 0, t.toFixed(2), 'linear');
      setTimeout(function () { window.location.href = cat.href; }, t * 1000 + 90);
    }, delayMs || 0);
  }

  function happyHop(then) {
    const inner = cat.querySelector('.cat-svg-inner');
    inner.style.animation = 'hop 0.3s ease';
    setTimeout(then, 320);
  }

  function fx(cls, x, y) {
    const el = document.createElement('div');
    el.className = 'fx ' + cls;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (cls === 'fx-bird') el.textContent = '\uD83D\uDC26';
    document.body.appendChild(el);
    return el;
  }

  // ---------- events ----------
  function evLaser() {
    const success = coin();
    const dotY = rect.bottom - 20;
    const dot = fx('fx-laser', rect.left - 90, dotY);
    const chase = success ? window.innerWidth * 0.45 - rect.left : window.innerWidth * 0.5;
    // dot darts ahead
    requestAnimationFrame(function () {
      dot.style.transform = 'translateX(' + (success ? chase + 90 : window.innerWidth + 150) + 'px)';
    });
    // cat sprints after it
    cat.classList.add('walking');
    setMove(chase, 0, '0.45', 'ease-in-out');
    setTimeout(function () {
      if (success) {
        dot.style.opacity = '0';               // GOTCHA
        cat.classList.remove('walking');
        happyHop(function () { dashOff(0); });
      } else {
        cat.classList.remove('walking');       // it got away
        cat.classList.add('skid');
        dashOff(300);
      }
    }, 470);
  }

  function evFly() {
    const success = coin();
    const flyEl = fx('fx-fly', rect.left + rect.width / 2, rect.top - 46);
    setTimeout(function () {
      // cat leaps straight up
      cat.classList.add('leaping');
      setMove(0, -64, '0.22', 'ease-out');
      setTimeout(function () {
        if (success) flyEl.style.opacity = '0';           // snapped out of the air
        else flyEl.style.transform = 'translate(140px, -180px)';  // buzzed off
        setMove(0, 0, '0.2', 'ease-in');                  // land
        setTimeout(function () {
          if (success) happyHop(function () { dashOff(0); });
          else { cat.classList.add('skid'); dashOff(280); }
        }, 220);
      }, 240);
    }, 300);
  }

  function evBird() {
    const success = coin();
    const birdY = rect.top - 40;
    const bird = fx('fx-bird', rect.left - 140, birdY);
    // bird glides across
    requestAnimationFrame(function () {
      bird.style.transform = 'translateX(' + (window.innerWidth * 0.5) + 'px)';
    });
    // cat gives chase and leaps in an arc
    cat.classList.add('walking');
    setMove(window.innerWidth * 0.3 - rect.left, 0, '0.4', 'ease-in');
    setTimeout(function () {
      cat.classList.add('leaping');
      setMove(window.innerWidth * 0.42 - rect.left, -70, '0.24', 'ease-out');
      setTimeout(function () {
        if (success) bird.style.opacity = '0';                       // caught!
        else bird.style.transform = 'translate(' + window.innerWidth + 'px, -220px)'; // flew away
        setMove(window.innerWidth * 0.48 - rect.left, 0, '0.2', 'ease-in');
        setTimeout(function () { dashOff(success ? 120 : 220); }, 210);
      }, 260);
    }, 420);
  }

  function evScratch() {
    cat.classList.add('scratching');
    setTimeout(function () { cat.classList.remove('scratching'); dashOff(60); }, 820);
  }

  function evLick() {
    cat.classList.add('licking');
    setTimeout(function () { cat.classList.remove('licking'); dashOff(60); }, 820);
  }

  // ---------- plain exits ----------
  function exitRun(exit) {
    const runTime = rand(0.3, 0.5);
    cat.classList.add('walking');
    if (exit === 'zoomies') cat.classList.add('zoomies');
    cat.style.transitionDuration = runTime.toFixed(2) + 's';

    if (exit === 'left') {
      cat.classList.add('face-left');
      cat.style.transform = 'translateX(-' + (rect.right + 60) + 'px)';
    } else if (exit === 'up') {
      const drift = rand(-80, 80).toFixed(0);
      cat.style.transform = 'translate(' + drift + 'px, -' + (rect.bottom + 80) + 'px)';
    } else if (exit === 'down') {
      cat.style.transform = 'translateY(' + (window.innerHeight - rect.top + 80) + 'px)';
    } else {
      cat.style.transform = 'translateX(' + (window.innerWidth - rect.left + 60) + 'px)';
    }
    setTimeout(function () { window.location.href = cat.href; }, runTime * 1000 + 100);
  }

  function evBat() {
    cat.classList.add('batting');
    document.body.classList.add('swatted');
    setTimeout(function () {
      cat.classList.remove('batting');
      dashOff(0);
    }, 520);
  }

  const pool = ['right', 'left', 'up', 'down', 'zoomies', 'bat', 'laser', 'fly', 'bird', 'scratch', 'lick'];
  const pick = pool[Math.floor(Math.random() * pool.length)];

  const runIt = function () {
    if (pick === 'bat') return evBat();
    if (pick === 'laser') return evLaser();
    if (pick === 'fly') return evFly();
    if (pick === 'bird') return evBird();
    if (pick === 'scratch') return evScratch();
    if (pick === 'lick') return evLick();
    exitRun(pick);
  };

  // occasional butt-wiggle prep before dashes and chases
  const preppable = ['right', 'left', 'up', 'down', 'zoomies', 'laser', 'bird'];
  if (preppable.indexOf(pick) !== -1 && Math.random() < 0.4) {
    cat.classList.add('prepping');
    setTimeout(function () { cat.classList.remove('prepping'); runIt(); }, 360);
  } else {
    runIt();
  }
});
