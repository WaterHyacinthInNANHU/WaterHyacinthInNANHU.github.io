// Play each complete task comparison before sliding to the next one.
document.querySelectorAll('.bench-carousel').forEach((carousel) => {
  const track = carousel.querySelector('.bench-track');
  const viewport = carousel.querySelector('.bench-viewport');
  const slides = [...carousel.querySelectorAll('.bench-slide')];
  const videos = slides.map(slide => slide.querySelector('video'));
  const dots = [...carousel.querySelectorAll('[data-bench-index]')];
  const pause = carousel.querySelector('.bench-pause');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let running = !reducedMotion.matches;
  let visible = false;
  const updateButton = () => {
    pause.textContent = running ? 'Ⅱ' : '▶';
    pause.setAttribute('aria-label', running ? 'Pause slideshow' : 'Play slideshow');
  };
  const syncPlayback = () => {
    videos.forEach((video, i) => {
      if (i === active && running && visible && !document.hidden) {
        video.play().catch(() => {
          if (i === active && visible && !document.hidden && video.paused) {
            running = false;
            updateButton();
          }
        });
      } else video.pause();
    });
  };
  const select = (index) => {
    active = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${active * 100}%)`;
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== active)));
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === active)));
    videos[active].currentTime = 0;
    syncPlayback();
  };
  videos.forEach((video, i) => {
    video.controls = false;
    video.muted = true;
    video.tabIndex = -1;
    video.addEventListener('ended', () => { if (i === active && running) select(active + 1); });
  });
  dots.forEach((dot, i) => dot.addEventListener('click', () => select(i)));
  carousel.querySelector('.bench-prev').addEventListener('click', () => select(active - 1));
  carousel.querySelector('.bench-next').addEventListener('click', () => select(active + 1));
  pause.addEventListener('click', () => {
    running = !running;
    if (running && videos[active].ended) videos[active].currentTime = 0;
    updateButton();
    syncPlayback();
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchX;
  viewport.addEventListener('pointerdown', (event) => { touchX = event.clientX; });
  viewport.addEventListener('pointerup', (event) => {
    if (touchX !== undefined && Math.abs(event.clientX - touchX) > 40) select(active + (event.clientX < touchX ? 1 : -1));
    touchX = undefined;
  });
  viewport.addEventListener('pointercancel', () => { touchX = undefined; });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0.2 }).observe(viewport);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { running = false; updateButton(); syncPlayback(); }
  });
  carousel.querySelector('.bench-controls').hidden = false;
  updateButton();
  select(0);
});

// Keep native controls as a no-JavaScript fallback; reveal them after play.
document.querySelectorAll('.media-player').forEach((media) => {
  const video = media.querySelector('video');
  const button = media.querySelector('.media-play');
  video.controls = false;
  button.hidden = false;
  button.addEventListener('click', () => {
    video.controls = true;
    button.hidden = true;
    video.play().catch(() => { button.hidden = false; video.controls = false; });
  });
});
(() => {
  const blocks = [...document.querySelectorAll(".work-author-block")];
  const update = (block) => {
    const authors = block.querySelector(".work-authors");
    const button = block.querySelector(".author-toggle");
    const expanded = button.getAttribute("aria-expanded") === "true";
    authors.classList.add("authors-enhanced");
    authors.classList.remove("authors-expanded");
    const overflows = authors.scrollHeight > authors.clientHeight + 1;
    button.hidden = !overflows;
    authors.classList.toggle("authors-expanded", expanded && overflows);
    button.setAttribute("aria-expanded", String(expanded && overflows));
    const label = expanded && overflows ? "Show fewer authors" : "Show all authors";
    button.textContent = label;
    button.setAttribute("aria-label", `${label} for ${button.dataset.work}`);
  };
  blocks.forEach((block) => {
    block.querySelector(".author-toggle").addEventListener("click", (event) => {
      const button = event.currentTarget;
      button.setAttribute("aria-expanded", String(button.getAttribute("aria-expanded") !== "true"));
      update(block);
    });
    update(block);
  });
  let frame;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => blocks.forEach(update));
  });
  if (document.fonts) document.fonts.ready.then(() => blocks.forEach(update));
})();

(() => {
  const carousel = document.querySelector(".featured-carousel");
  if (!carousel) return;
  const viewport = carousel.querySelector(".featured-viewport");
  const slides = [...carousel.querySelectorAll(".featured-slide")];
  const tabs = [...carousel.querySelectorAll(".featured-tab")];
  const branches = [...carousel.querySelectorAll(".featured-branch")];
  const paths = [...carousel.querySelectorAll("[data-feature-path]")];
  const project = carousel.querySelector(".featured-project-link");
  const projects = [
    { name: "AXIS", url: "https://axisaiorg.github.io/AXIS-V1/" },
    { name: "AXIS-Bench", url: "https://axis-bench.github.io/" }
  ];
  let active = -1;
  const select = (index) => {
    if (index === active) return;
    active = index;
    branches.forEach((branch, i) => {
      branch.classList.toggle("is-active", i === index);
      branch.setAttribute("aria-pressed", String(i === index));
    });
    paths.forEach((path, i) => path.classList.toggle("is-active", i === index));
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === index);
      if (i === index) tab.setAttribute("aria-current", "true");
      else tab.removeAttribute("aria-current");
    });
    project.href = projects[index].url;
    project.textContent = `View ${projects[index].name} project ↗`;
    slides.forEach((slide, i) => {
      const video = slide.querySelector("video");
      if (i === index) video.play().catch(() => {});
      else video.pause();
    });
  };
  [...tabs, ...branches].forEach((control) => control.addEventListener("click", () => {
    const index = Number(control.dataset.featureSlide);
    viewport.scrollTo({ left: index * viewport.clientWidth, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }));
  let frame;
  viewport.addEventListener("scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => select(Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)))));
  });
  window.addEventListener("resize", () => viewport.scrollTo({ left: active * viewport.clientWidth, behavior: "instant" }));
  select(0);
})();
