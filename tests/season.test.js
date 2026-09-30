import test from "node:test";
import assert from "node:assert/strict";
import { getTeamsForEra } from "../src/data/teams-data.js";
import { createEmptyStandings, generateSchedule, getRoundStatus, rankStandings, getTeamRank } from "../src/core/season.js";

const teams = getTeamsForEra("1990s");

test("calendário: em cada rodada todos os times jogam exatamente uma vez", () => {
  const schedule = generateSchedule(teams, 10);
  assert.equal(schedule.length, 10 * (teams.length / 2));
  for (let round = 1; round <= 10; round++) {
    const ids = schedule.filter((m) => m.round === round).flatMap((m) => [m.homeId, m.awayId]);
    assert.equal(new Set(ids).size, teams.length);
    assert.equal(ids.length, teams.length);
  }
  assert.ok(schedule.every((m) => m.homeId !== m.awayId && !m.played));
});

test("estado da rodada: pending -> round_done -> season_done", () => {
  const state = { gameNumber: 1, totalRegularGames: 2, schedule: generateSchedule(teams, 2) };
  const me = teams[0].id;
  assert.equal(getRoundStatus(state, me).phase, "pending");
  state.schedule.filter((m) => m.round === 1).forEach((m) => (m.played = true));
  assert.equal(getRoundStatus(state, me).phase, "round_done");
  state.gameNumber = 2;
  assert.equal(getRoundStatus(state, me).phase, "pending");
  state.schedule.forEach((m) => (m.played = true));
  assert.equal(getRoundStatus(state, me).phase, "season_done");
});

test("classificação ordena por vitórias e desempata pelo saldo", () => {
  const s = createEmptyStandings(teams);
  const [a, b, c] = teams.map((t) => t.id);
  s[a].wins = 5; s[a].pointsFor = 500; s[a].pointsAgainst = 490;
  s[b].wins = 5; s[b].pointsFor = 520; s[b].pointsAgainst = 480;
  s[c].wins = 7;
  assert.deepEqual(rankStandings(s).slice(0, 3).map((x) => x.id), [c, b, a]);
  assert.equal(getTeamRank(s, a), 3);
});
