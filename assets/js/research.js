// Every author is rendered by Jekyll. Clamping is a progressive enhancement.
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
  const tasks = [
    "Place blue cup in red cup",
    "Press blue button",
    "Align three blocks",
    "Insert book in stand",
    "Rotate red block",
    "Stack red block on blue",
  ];
  const order = [2, 1, 3, 4, 5, 6];
  document.querySelectorAll(".axis-pairs").forEach((el) => {
    let i = 0;
    const show = (step) => {
      i = (i + step + 6) % 6;
      const src = "/assets/img/publication_preview/axis-pair-" + order[i] + ".gif";
      el.querySelector("img").src = src;
      el.querySelector("img").alt = tasks[i] + ": no AXIS pretraining to AXIS pretraining";
      el.querySelector("a").href = src;
      el.querySelector(".axis-task").textContent = tasks[i] + " (" + (i + 1) + "/6)";
    };
    el.querySelector(".axis-prev").onclick = () => show(-1);
    el.querySelector(".axis-next").onclick = () => show(1);
  });
})();
