const TOAST_DURATION = 3000;

type ToastType = "success" | "error" | "info";

export function toast(message: string, type: ToastType = "success") {
  if (typeof document === "undefined") return;

  const existing = document.getElementById("eat-toast-container");
  let container: HTMLElement;
  if (existing) {
    container = existing;
  } else {
    container = document.createElement("div");
    container.id = "eat-toast-container";
    container.style.cssText = [
      "position: fixed",
      "bottom: 6rem",
      "left: 50%",
      "transform: translateX(-50%)",
      "z-index: 9999",
      "display: flex",
      "flex-direction: column",
      "align-items: center",
      "gap: 0.5rem",
      "pointer-events: none",
    ].join(";");
    document.body.appendChild(container);
  }

  const el = document.createElement("div");
  el.textContent = message;
  el.style.cssText = [
    "padding: 0.75rem 1.5rem",
    "border-radius: 9999px",
    "font-size: 0.875rem",
    "font-weight: 700",
    "white-space: nowrap",
    "box-shadow: 0 8px 32px rgba(0,0,0,0.15)",
    "pointer-events: auto",
    "transition: opacity 300ms ease, transform 300ms ease",
    "opacity: 0",
    "transform: translateY(12px) scale(0.95)",
  ].join(";");

  if (type === "success") {
    el.style.background = "#065f46";
    el.style.color = "#fff";
  } else if (type === "error") {
    el.style.background = "#991b1b";
    el.style.color = "#fff";
  } else {
    el.style.background = "#1e293b";
    el.style.color = "#fff";
  }

  container.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0) scale(1)";
  });

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(-8px) scale(0.95)";
    setTimeout(() => el.remove(), 300);
  }, TOAST_DURATION);
}
