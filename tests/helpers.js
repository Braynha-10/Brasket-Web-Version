// Ambiente mínimo de navegador para rodar o controlador do jogo no Node (sem jsdom).
export function makeEl() {
  return {
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    style: {},
    dataset: {},
    children: [],
    firstElementChild: null,
    value: "",
    innerHTML: "",
    innerText: "",
    textContent: "",
    addEventListener() {},
    appendChild() {},
    remove() {},
    setAttribute() {},
    getContext: () => null,
    querySelector: () => makeEl(),
    querySelectorAll: () => [],
  };
}

export function makeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => void data.set(k, String(v)),
    removeItem: (k) => void data.delete(k),
  };
}

export function installBrowserStubs(storage = makeStorage()) {
  globalThis.localStorage = storage;
  globalThis.confirm = () => true;
  globalThis.document = {
    readyState: "complete",
    body: makeEl(),
    documentElement: { style: { setProperty() {} } },
    getElementById: () => makeEl(),
    querySelector: () => makeEl(),
    querySelectorAll: () => [],
    createElement: () => makeEl(),
    addEventListener() {},
  };
  return storage;
}

export async function waitUntil(fn, { timeout = 15000, step = 5 } = {}) {
  const start = Date.now();
  while (!fn()) {
    if (Date.now() - start > timeout) throw new Error("waitUntil: tempo esgotado");
    await new Promise((r) => setTimeout(r, step));
  }
}
