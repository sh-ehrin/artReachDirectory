/* ==========================================================
   ArtReach — script.js
   Shared across all pages. Each function only runs if the
   relevant elements exist on the current page, so it's safe
   to include on every page without errors.
   ========================================================== */

/* ── CAROUSEL (index.html) ──────────────────────────────── */

const carouselState = {};

function slide(id, dir) {
  const track = document.getElementById("track-" + id);
  if (!track) return;
  const cards = track.children;
  if (!cards.length) return;
  if (!carouselState[id]) carouselState[id] = 0;
  const max = Math.max(0, cards.length - 3);
  carouselState[id] = Math.max(0, Math.min(carouselState[id] + dir, max));
  const cardW = cards[0].offsetWidth + 20; // 20px = gap
  track.style.transform = `translateX(-${carouselState[id] * cardW}px)`;
}

// Auto-advance — uncomment the block below if you add more than 3 cards
// to any borough row on the home page.
/*
['manhattan','brooklyn','queens','bronx','staten'].forEach((id, i) => {
  setInterval(() => {
    const track = document.getElementById('track-' + id);
    if (!track) return;
    const max = track.children.length - 3;
    if (carouselState[id] >= max) carouselState[id] = -1;
    slide(id, 1);
  }, 4500 + i * 600);
});
*/

/* ── EXPAND CARDS (about.html) ──────────────────────────── */

function toggleExpand(id) {
  const card = document.getElementById(id);
  if (card) card.classList.toggle("open");
}

/* ── FAQ ACCORDION (faq.html) ───────────────────────────── */

function toggleFaq(el) {
  const item = el.closest(".faq-item");
  if (item) item.classList.toggle("open");
}

/* ── CONTACT FORM (contact.html) ────────────────────────── */

function handleSubmit(e) {
  e.preventDefault();
  const confirm = document.getElementById("form-confirm");
  if (confirm) confirm.style.display = "block";
  e.target.reset();
}

/* ── BOROUGH FILTER TABS (boroughs/*.html) ──────────────── */

function getUrlType() {
  const params = new URLSearchParams(window.location.search);
  const t = params.get("type");
  if (t === "museums") return "museum";
  if (t === "theatres") return "theatre";
  if (t === "music") return "music";
  return "all";
}

function filterType(type, btn) {
  document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('.venue-card');
  let visible = 0;
  cards.forEach(card => {
    const match = type === 'all' || card.dataset.type === type;
    if (match) {
      card.style.display = 'block';
      card.style.visibility = 'visible';
      card.style.height = '';
      card.style.overflow = '';
      card.style.pointerEvents = 'auto';
      visible++;
    } else {
      card.style.display = 'none';
      card.style.visibility = '';
      card.style.height = '';
      card.style.overflow = '';
      card.style.pointerEvents = '';
    }
  });

  const empty = document.getElementById('empty-state');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

/* ── SCROLL REVEAL (about.html) ─────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal observer
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 },
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // Borough filter: apply ?type= param on page load
  const tabs = document.querySelectorAll(".type-tab");
  if (tabs.length) {
    const type = getUrlType();
    if (type !== "all") {
      const tabMap = { museum: 1, theatre: 2, music: 3 };
      filterType(type, tabs[tabMap[type]]);
    }
  }
});
