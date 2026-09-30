// Persistência do Brassket.
//
// O save tem duas partes:
//   league  -> os times, elencos, caixa e arenas (tudo o que muda quando você joga)
//   career  -> calendário, tabela, técnico, notícias, histórico...
//
// Antes (v1) só a carreira era salva, e os elencos voltavam ao original ao recarregar.
// Este módulo não usa window/document: recebe o "storage" por parâmetro, então dá para testar.

export const SAVE_VERSION = 2;
export const SAVE_KEY = "brassket_save_v2";
export const LEGACY_KEYS = ["brassket_save_v1", "hoopsfoot_save_v1"];
export const BACKUP_KEY = "brassket_save_backup";

// Nunca vão para o disco: a partida em andamento recomeça se a página for recarregada.
const TRANSIENT_KEYS = ["matchState", "isSimulating"];
const MAX_NEWS = 40;
const MAX_INBOX = 40;

export const CAREER_DEFAULTS = {
  selectedEra: "modern",
  currentTeamId: null,
  currentYear: 2025,
  gameNumber: 1,
  totalRegularGames: 10,
  currentTactic: "balanced",
  coachLevel: 1,
  coachXp: 0,
  coachTitles: 0,
  trainingUsedThisRound: false,
  lastTrainingResult: null,
  standings: {},
  schedule: [],
  news: [],
  inbox: [],
  seasonHistory: [],
  latestNewspaper: null,
  matchState: null,
  simSpeed: 500,
  isSimulating: false,
  prospects: [],
};

/** Completa campos que faltam (saves antigos) sem sobrescrever o que já existe. */
export function normalizeCareer(raw) {
  const career = { ...structuredCloneSafe(CAREER_DEFAULTS), ...raw };
  career.matchState = null;
  career.isSimulating = false;
  for (const key of ["news", "inbox", "seasonHistory", "schedule", "prospects"]) {
    if (!Array.isArray(career[key])) career[key] = [];
  }
  if (!career.standings || typeof career.standings !== "object") career.standings = {};
  return career;
}

export function isValidCareer(c) {
  return (
    !!c &&
    typeof c === "object" &&
    typeof c.selectedEra === "string" &&
    Number.isFinite(c.gameNumber) &&
    Number.isFinite(c.totalRegularGames) &&
    Number.isFinite(c.currentYear) &&
    Array.isArray(c.schedule) &&
    !!c.standings &&
    typeof c.standings === "object"
  );
}

export function isValidLeague(l) {
  return (
    !!l &&
    Array.isArray(l.teams) &&
    l.teams.length >= 2 &&
    l.teams.every((t) => t && typeof t.id === "string" && Array.isArray(t.roster) && t.roster.length > 0)
  );
}

/** Gera a string que vai para o localStorage. */
export function serialize(league, career) {
  const clean = { ...career };
  for (const key of TRANSIENT_KEYS) delete clean[key];
  clean.news = (clean.news || []).slice(0, MAX_NEWS);
  clean.inbox = (clean.inbox || []).slice(0, MAX_INBOX);
  return JSON.stringify({ version: SAVE_VERSION, savedAt: Date.now(), league, career: clean });
}

/**
 * Converte qualquer save conhecido para { league, career }.
 * `buildLeague(eraKey)` devolve uma liga nova (times originais da era).
 * Retorna null se o conteúdo não for um save utilizável.
 */
export function migrate(parsed, buildLeague) {
  if (!parsed || typeof parsed !== "object") return null;

  // v2 (atual)
  if (parsed.version === SAVE_VERSION) {
    if (!isValidLeague(parsed.league) || !isValidCareer(parsed.career)) return null;
    const career = normalizeCareer(parsed.career);
    if (career.currentTeamId && !parsed.league.teams.some((t) => t.id === career.currentTeamId)) return null;
    return { league: parsed.league, career, migratedFrom: null };
  }

  // v1: o próprio estado da carreira, sem times. Os elencos voltam ao original.
  if (!parsed.version && isValidCareer(parsed)) {
    const career = normalizeCareer(parsed);
    const league = buildLeague(career.selectedEra);
    if (career.currentTeamId && !league.teams.some((t) => t.id === career.currentTeamId)) {
      career.currentTeamId = null;
    }
    return { league, career, migratedFrom: 1 };
  }

  return null;
}

/** Lê o save. Se estiver corrompido, guarda uma cópia de segurança e devolve null. */
export function loadFromStorage(storage, buildLeague) {
  const keys = [SAVE_KEY, ...LEGACY_KEYS];
  for (const key of keys) {
    let raw = null;
    try {
      raw = storage.getItem(key);
    } catch (e) {
      return null;
    }
    if (!raw) continue;
    try {
      const result = migrate(JSON.parse(raw), buildLeague);
      if (result) return result;
    } catch (e) {
      // cai no backup abaixo
    }
    try {
      storage.setItem(BACKUP_KEY, raw);
    } catch (e) {
      /* sem espaço: segue sem backup */
    }
    return { league: null, career: null, corrupted: true };
  }
  return null;
}

export function saveToStorage(storage, league, career) {
  try {
    storage.setItem(SAVE_KEY, serialize(league, career));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

export function clearAllSaves(storage) {
  for (const key of [SAVE_KEY, ...LEGACY_KEYS]) {
    try {
      storage.removeItem(key);
    } catch (e) {
      /* ignora */
    }
  }
}

function structuredCloneSafe(v) {
  return JSON.parse(JSON.stringify(v));
}
