import test from "node:test";
import assert from "node:assert/strict";
import { getTeamsForEra } from "../src/data/teams-data.js";
import {
  SAVE_KEY, BACKUP_KEY, serialize, migrate, loadFromStorage, saveToStorage, clearAllSaves, normalizeCareer,
} from "../src/core/save.js";
import { makeStorage } from "./helpers.js";

const buildLeague = (era) => ({ teams: getTeamsForEra(era) });
const career = (extra = {}) => normalizeCareer({ selectedEra: "modern", currentTeamId: "LAL", ...extra });

test("getTeamsForEra devolve cópias independentes", () => {
  const a = getTeamsForEra("modern");
  a[0].budget = 1;
  a[0].roster[0].ovr = 1;
  const b = getTeamsForEra("modern");
  assert.notEqual(b[0].budget, 1);
  assert.notEqual(b[0].roster[0].ovr, 1);
});

test("serialize não grava a partida em andamento e limita notícias", () => {
  const c = career({ matchState: { homeTeam: {} }, isSimulating: true, news: Array.from({ length: 100 }, (_, i) => ({ i })) });
  const saved = JSON.parse(serialize(buildLeague("modern"), c));
  assert.equal(saved.version, 2);
  assert.ok(!("matchState" in saved.career));
  assert.ok(!("isSimulating" in saved.career));
  assert.equal(saved.career.news.length, 40);
});

test("salvar e carregar preserva elencos e caixa (bug do save v1)", () => {
  const storage = makeStorage();
  const league = buildLeague("modern");
  league.teams[0].budget = 12345;
  league.teams[0].roster[0].sta = 42;
  assert.ok(saveToStorage(storage, league, career()).ok);
  const loaded = loadFromStorage(storage, buildLeague);
  assert.equal(loaded.league.teams[0].budget, 12345);
  assert.equal(loaded.league.teams[0].roster[0].sta, 42);
  assert.equal(loaded.career.currentTeamId, "LAL");
});

test("migra save v1 (sem times) para a estrutura nova", () => {
  const v1 = { ...career({ gameNumber: 4 }) };
  delete v1.matchState;
  const storage = makeStorage({ brassket_save_v1: JSON.stringify(v1) });
  const loaded = loadFromStorage(storage, buildLeague);
  assert.equal(loaded.migratedFrom, 1);
  assert.equal(loaded.career.gameNumber, 4);
  assert.equal(loaded.league.teams.length, 10);
});

test("save v1 com time inexistente volta para a seleção de time", () => {
  const out = migrate({ ...career({ currentTeamId: "XXX" }) }, buildLeague);
  assert.equal(out.career.currentTeamId, null);
});

test("save corrompido gera backup e não quebra", () => {
  const storage = makeStorage({ [SAVE_KEY]: "{isso não é json" });
  const loaded = loadFromStorage(storage, buildLeague);
  assert.equal(loaded.corrupted, true);
  assert.equal(storage.getItem(BACKUP_KEY), "{isso não é json");
});

test("v2 inválido (liga vazia) é rejeitado", () => {
  assert.equal(migrate({ version: 2, league: { teams: [] }, career: career() }, buildLeague), null);
});

test("falha ao gravar (armazenamento cheio) é reportada, não lançada", () => {
  const storage = { setItem() { throw new Error("QuotaExceededError"); } };
  const res = saveToStorage(storage, buildLeague("modern"), career());
  assert.equal(res.ok, false);
});

test("clearAllSaves remove também as chaves antigas", () => {
  const storage = makeStorage({ [SAVE_KEY]: "x", brassket_save_v1: "x", hoopsfoot_save_v1: "x" });
  clearAllSaves(storage);
  assert.equal(storage.data.size, 0);
});
