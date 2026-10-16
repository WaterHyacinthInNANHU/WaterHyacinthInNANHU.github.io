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
