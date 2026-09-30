// Avisos não bloqueantes. Substituem os alert(), que interrompiam a partida.

const MAX_VISIBLE = 4;
const STYLES = {
  info: "border-slate-600 bg-slate-900/95 text-slate-100",
  success: "border-emerald-500/60 bg-emerald-950/95 text-emerald-100",
  warning: "border-amber-500/60 bg-amber-950/95 text-amber-100",
  error: "border-red-500/60 bg-red-950/95 text-red-100",
};

function getRoot() {
  let root = document.getElementById("toast-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "toast-root";
    root.setAttribute("role", "status");
    root.setAttribute("aria-live", "polite");
    root.className = "fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-[100] flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(root);
  }
  return root;
}

/** Mostra um aviso. `type`: info | success | warning | error. */
export function notify(message, { type = "info", duration = 5000 } = {}) {
  const root = getRoot();
  while (root.children.length >= MAX_VISIBLE) root.firstElementChild.remove();

  const el = document.createElement("div");
  el.className = `pointer-events-auto border rounded-xl px-4 py-3 text-sm shadow-2xl whitespace-pre-line cursor-pointer ${STYLES[type] || STYLES.info}`;
  el.textContent = message;
  el.addEventListener("click", () => el.remove());
  root.appendChild(el);
  setTimeout(() => el.remove(), duration);
}
