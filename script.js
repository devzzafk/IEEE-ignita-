/* ============================================================
   IEEE IGNITE — interactions
   Vanilla JS only: nav toggle + active link tracking, header
   scroll state, event filter + search, FAQ accordion, and a
   light reveal-on-scroll effect.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------- Mobile nav */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after choosing a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------- Header scroll shadow */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------- Active nav link on scroll */
  const sections = Array.from(document.querySelectorAll('main .section'));
  const navLinkMap = new Map(
    Array.from(document.querySelectorAll('.nav-link')).map(a => [a.getAttribute('href').slice(1), a])
  );

  const setActiveLink = (id) => {
    navLinkMap.forEach(link => link.classList.remove('is-active'));
    const active = navLinkMap.get(id);
    if (active) active.classList.add('is-active');
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ---------------------------------------------------------- Reveal on scroll */
  const revealTargets = document.querySelectorAll('.about-card, .event-card, .timeline-item, .accordion-item');
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------- Events: filter + search */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const eventCards     = Array.from(document.querySelectorAll('.event-card'));
  const searchInput    = document.getElementById('eventSearch');
  const resultsStatus  = document.getElementById('resultsStatus');
  const noResults      = document.getElementById('noResults');

  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    eventCards.forEach(card => {
      const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = !query || card.dataset.name.includes(query) || card.querySelector('h3').textContent.toLowerCase().includes(query);
      const show = matchesCategory && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;

    if (query) {
      resultsStatus.textContent = `${visibleCount} event${visibleCount === 1 ? '' : 's'} matching “${searchInput.value.trim()}”`;
    } else if (activeFilter !== 'all') {
      resultsStatus.textContent = `${visibleCount} ${activeFilter} event${visibleCount === 1 ? '' : 's'}`;
    } else {
      resultsStatus.textContent = `Showing all ${visibleCount} events`;
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  applyFilters(); // initial status line

  /* ---------------------------------------------------------- FAQ accordion */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel   = item.querySelector('.accordion-panel');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // close any other open item (single-open accordion)
      accordionItems.forEach(other => {
        if (other === item) return;
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

});
