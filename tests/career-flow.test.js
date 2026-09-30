// Percorre uma temporada inteira pelo controlador real (BrassketApp) com um navegador falso.
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { installBrowserStubs, makeStorage, waitUntil } from "./helpers.js";
import { getRoundStatus } from "../src/core/season.js";

const storage = installBrowserStubs(makeStorage());
const { soundEngine } = await import("../src/audio/sound.js");
for (const k of Object.getOwnPropertyNames(Object.getPrototypeOf(soundEngine))) {
  if (k.startsWith("play")) soundEngine[k] = () => {};
}
const { BrassketApp } = await import("../src/app.js");

beforeEach(() => storage.data.clear());

const notices = [];
BrassketApp.prototype.notify = function (msg) { notices.push(msg); };

const sumWins = (app) => Object.values(app.state.standings).reduce((n, s) => n + s.wins, 0);
const sumLosses = (app) => Object.values(app.state.standings).reduce((n, s) => n + s.losses, 0);

async function playRound(app) {
  app.state.simSpeed = 1;
  app.startMatchSimulation();
  await waitUntil(() => app.state.matchState?.isFinished);
}

test("temporada completa: 10 rodadas, tabela consistente e virada de ano", async () => {
  const app = new BrassketApp();
  app.selectTeam("LAL");
  const teamCount = app.getActiveTeams().length;

  for (let round = 1; round <= 10; round++) {
    assert.equal(getRoundStatus(app.state, "LAL").phase, "pending", `rodada ${round} deveria ter partida`);
    await playRound(app);
    // cada rodada joga uma vez por time: vitórias == derrotas == jogos da liga
    assert.equal(sumWins(app), round * (teamCount / 2));
    assert.equal(sumLosses(app), round * (teamCount / 2));
    assert.notEqual(getRoundStatus(app.state, "LAL").phase, "pending");
    if (round < 10) {
      // recarregar a página aqui não pode perder rodada nem mostrar "temporada concluída"
      const reloaded = new BrassketApp();
      assert.equal(reloaded.state.gameNumber, round);
      assert.equal(getRoundStatus(reloaded.state, "LAL").phase, "round_done");
      assert.equal(reloaded.league.teams.find((t) => t.id === "LAL").budget, app.league.teams.find((t) => t.id === "LAL").budget);
      app.advanceRound();
      assert.equal(app.state.gameNumber, round + 1);
    }
  }

  assert.equal(getRoundStatus(app.state, "LAL").phase, "season_done");
  app.advanceToNextYear();
  assert.equal(app.state.currentYear, 2026);
  assert.equal(app.state.gameNumber, 1);
  assert.equal(sumWins(app), 0);
  assert.equal(app.state.seasonHistory.length, 1);
  assert.match(app.state.seasonHistory[0].title, /CAMPEÃO|colocado/);
});

test("cliques repetidos não duplicam a partida nem a tabela", async () => {
  const app = new BrassketApp();
  app.selectTeam("BOS");
  app.state.simSpeed = 1;
  app.startMatchSimulation();
  app.startMatchSimulation();
  app.quickFinishMatch();
  app.quickFinishMatch();
  await waitUntil(() => app.state.matchState?.isFinished);
  await new Promise((r) => setTimeout(r, 100));
  assert.equal(app.state.matchState.possession, 24);
  assert.equal(sumWins(app), 5);
  assert.equal(app.state.simSpeed, 1, "finalizar rápido não pode alterar a velocidade salva");
});

test("não deixa avançar de rodada sem jogar nem virar o ano antes do fim", () => {
  const app = new BrassketApp();
  app.selectTeam("DEN");
  notices.length = 0;
  app.advanceRound();
  app.advanceToNextYear();
  assert.equal(app.state.gameNumber, 1);
  assert.equal(app.state.currentYear, 2025);
  assert.equal(notices.length, 2);
});

test("trocar de era e voltar não traz elencos alterados", () => {
  const app = new BrassketApp();
  app.selectTeam("LAL");
  app.league.teams.find((t) => t.id === "LAL").budget = 1;
  app.selectEra("1990s");
  app.selectEra("modern");
  assert.notEqual(app.league.teams.find((t) => t.id === "LAL").budget, 1);
});
