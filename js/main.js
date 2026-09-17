/* =============================================================
   Bidan Sahabat Ibu — interaksi halaman
   Ditulis tanpa dependensi. Semua bagian bersifat progressive
   enhancement: halaman tetap berfungsi bila JavaScript gagal dimuat.
   ============================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------- Tahun berjalan di footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Menu navigasi (mobile) ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Tutup menu setelah memilih tautan.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    // Tutup dengan tombol Escape.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    // Tutup bila kembali ke tampilan desktop.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* ---------- Bayangan header saat halaman digulir ---------- */
  var header = document.getElementById('header');
  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ---------- Tautan navigasi aktif ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__link')
  );

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var linkFor = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id.charAt(0) === '#') linkFor[id.slice(1)] = link;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linkFor[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (other) {
              other.classList.remove('is-active');
            });
            link.classList.add('is-active');
          }
        });
      },
      // Pita sempit di sepertiga atas viewport menandai bagian "sedang dibaca".
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Animasi muncul saat digulir ---------- */
  var revealables = Array.prototype.slice.call(
    document.querySelectorAll('.reveal')
  );

  function revealAll() {
    revealables.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var revealer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry, index) {
          if (!entry.isIntersecting) return;
          // Jeda bertahap agar kartu muncul berurutan, bukan serentak.
          var delay = Math.min(index, 5) * 70;
          setTimeout(function () {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0 }
    );

    revealables.forEach(function (el) {
      revealer.observe(el);
    });

    // Jaring pengaman: apa pun sebabnya, konten tidak boleh tetap tak terlihat.
    setTimeout(revealAll, 4000);
  }

  /* ---------- FAQ: hanya satu jawaban terbuka ---------- */
  var faqItems = Array.prototype.slice.call(
    document.querySelectorAll('.faq__item')
  );
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Formulir janji temu -> WhatsApp ---------- */
  var form = document.getElementById('bookingForm');
  var waNumber = document.body.getAttribute('data-wa-number');

  if (form && waNumber) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Pakai validasi bawaan peramban sebelum menyusun pesan.
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var nama = form.elements.nama.value.trim();
      var layanan = form.elements.layanan.value;
      var waktu = form.elements.waktu.value.trim();
      var pesan = form.elements.pesan.value.trim();

      var lines = [
        'Halo Bidan Sahabat Ibu, saya ingin membuat janji.',
        '',
        'Nama: ' + nama,
        'Layanan: ' + layanan
      ];

      if (waktu) lines.push('Perkiraan waktu: ' + waktu);
      if (pesan) lines.push('Keterangan: ' + pesan);

      lines.push('', 'Terima kasih.');

      var url =
        'https://wa.me/' +
        waNumber +
        '?text=' +
        encodeURIComponent(lines.join('\n'));

      window.open(url, '_blank', 'noopener');
    });
  }
})();
