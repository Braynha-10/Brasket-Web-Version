// Regras da temporada sem nenhuma dependência de tela.

export function createEmptyStandings(teams) {
  const standings = {};
  for (const t of teams) {
    standings[t.id] = {
      id: t.id,
      name: t.name,
      city: t.city,
      conference: t.conference,
      wins: 0,
      losses: 0,
      pct: 0,
      streak: 0,
      homeRecord: [0, 0],
      awayRecord: [0, 0],
      pointsFor: 0,
      pointsAgainst: 0,
    };
  }
  return standings;
}

/** Sorteia os confrontos: em cada rodada todos os times jogam exatamente uma vez. */
export function generateSchedule(teams, rounds, rng = Math.random) {
  const schedule = [];
  for (let round = 1; round <= rounds; round++) {
    const order = teams.map((t) => t.id);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (let i = 0; i + 1 < order.length; i += 2) {
      schedule.push({
        round,
        homeId: order[i],
        awayId: order[i + 1],
        played: false,
        homeScore: null,
        awayScore: null,
      });
    }
  }
  return schedule;
}

export function findUserMatch(state, userTeamId, round = state.gameNumber) {
  return state.schedule.find((m) => m.round === round && (m.homeId === userTeamId || m.awayId === userTeamId)) || null;
}

/**
 * Em que ponto da temporada o jogador está?
 *   pending     -> tem partida para jogar nesta rodada
 *   round_done  -> já jogou; falta avançar para a próxima rodada
 *   season_done -> jogou a última rodada
 * O painel decide o que mostrar só por aqui, então recarregar a página nunca
 * "pula" a temporada nem esconde o botão de jogar.
 */
export function getRoundStatus(state, userTeamId) {
  const match = findUserMatch(state, userTeamId);
  const isLastRound = state.gameNumber >= state.totalRegularGames;
  if (match && !match.played) return { phase: "pending", match, isLastRound };
  return { phase: isLastRound ? "season_done" : "round_done", match, isLastRound };
}

/** Classificação geral: vitórias, depois saldo de pontos. */
export function rankStandings(standings) {
  return Object.values(standings).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.pointsFor - b.pointsAgainst - (a.pointsFor - a.pointsAgainst);
  });
}

export function getTeamRank(standings, teamId) {
  return rankStandings(standings).findIndex((s) => s.id === teamId) + 1;
}
