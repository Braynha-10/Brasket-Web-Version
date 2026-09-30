import { soundEngine } from "./audio/sound.js";
import { simEngine } from "./engine/engine.js";
import { BRASSKET_ERAS, getTeamsForEra, getDraftClassForEra } from "./data/teams-data.js";
import { createEmptyStandings, generateSchedule, getRoundStatus, getTeamRank } from "./core/season.js";
import { loadFromStorage, saveToStorage, clearAllSaves, normalizeCareer } from "./core/save.js";
import { notify } from "./ui/toast.js";

// Brassket: NBA Arcade GM - Controlador com Nível de Técnico, Sessões de Treino com Dados e Multitemporadas
export class BrassketApp {
    constructor() {
        // state = carreira (calendário, tabela, técnico...). league = times e elencos.
        this.state = normalizeCareer({});
        this.league = { teams: [] };
        this._simTimer = null;
        this._turbo = false;
        this._saveErrorShown = false;
        this.pendingNotice = null;

        this.init();
    }

    init() {
        this.loadSave();
        this.bindEvents();
        this.render();
        if (this.pendingNotice) {
            this.notify(this.pendingNotice, "warning");
            this.pendingNotice = null;
        }
    }

    buildLeague(eraKey) {
        return { teams: getTeamsForEra(eraKey) };
    }

    loadSave() {
        const result = loadFromStorage(localStorage, (era) => this.buildLeague(era));
        if (result && result.career && result.league) {
            this.state = result.career;
            this.league = result.league;
            if (result.migratedFrom) this.saveGame();
            return;
        }
        if (result && result.corrupted) {
            this.pendingNotice = "⚠️ Não foi possível ler o save anterior. Uma cópia de segurança foi guardada e uma nova carreira foi iniciada.";
        }
        this.initNewGameState();
    }

    saveGame() {
        const res = saveToStorage(localStorage, this.league, this.state);
        if (!res.ok && !this._saveErrorShown) {
            this._saveErrorShown = true;
            this.notify("⚠️ Não foi possível salvar o progresso (armazenamento cheio ou bloqueado).", "warning");
        }
    }

    getActiveTeams() {
        return this.league.teams;
    }

    initNewGameState() {
        const eraYears = { modern: 2025, "2000s": 2005, "1990s": 1995, "1980s": 1985, "1970s": 1975 };
        this.league = this.buildLeague(this.state.selectedEra);
        this.state.currentYear = eraYears[this.state.selectedEra] || 2025;
        this.state.gameNumber = 1;
        this.state.matchState = null;
        this.state.isSimulating = false;
        this.state.latestNewspaper = null;
        this.state.trainingUsedThisRound = false;
        this.state.lastTrainingResult = null;
        this.state.standings = createEmptyStandings(this.getActiveTeams());

        this.generateSchedule();
        this.loadDraftClassForCurrentEra();
        this.generateInitialEmails();

        this.state.news = [
            { date: `Temporada ${this.state.currentYear}`, title: "Nova Temporada Inaugurada!", body: `A liga está aberta na ${BRASSKET_ERAS[this.state.selectedEra]?.name || 'Era Atual'}. Monte seu plano tático e vença!` }
        ];
    }

    getUserTeam() {
        const teams = this.getActiveTeams();
        return teams.find(t => t.id === this.state.currentTeamId);
    }

    selectEra(eraKey) {
        soundEngine.playClick();
        this.state.selectedEra = eraKey;
        this.state.currentTeamId = null;
        this.initNewGameState();
        this.saveGame();
        this.render();
    }

    selectTeam(teamId) {
        soundEngine.playSwish();
        this.state.currentTeamId = teamId;
        this.applyDynamicTeamTheme();
        this.saveGame();
        this.render();
    }

    applyDynamicTeamTheme() {
        const team = this.getUserTeam();
        if (!team) return;

        const root = document.documentElement;
        root.style.setProperty("--team-primary", team.color);
        root.style.setProperty("--team-secondary", team.secondaryColor);
        root.style.setProperty("--team-glow", `${team.color}44`);

        const mainScreen = document.getElementById("main-game-screen");
        if (mainScreen) {
            mainScreen.style.background = `radial-gradient(ellipse 90% 50% at 50% 0%, ${team.color}25 0%, #0b0f19 55%, #05070c 100%)`;
        }
    }

    generateSchedule() {
        this.state.schedule = generateSchedule(this.getActiveTeams(), this.state.totalRegularGames);
    }

    loadDraftClassForCurrentEra() {
        const rawClass = getDraftClassForEra(this.state.selectedEra);
        this.state.prospects = rawClass.map((p, i) => ({
            id: 2000 + i,
            ...p,
            age: 19,
            sta: 95,
            salary: 4,
            morale: 95,
            clutch: Math.floor(Math.random() * 25) + 75,
            injured: 0
        }));
    }

    // === SISTEMA DE NÍVEL E XP DO TREINADOR ===
    getXpNeededForLevel(level) {
        return level * 100;
    }

    addCoachXp(amount, reason = "Partida") {
        this.state.coachXp += amount;
        const needed = this.getXpNeededForLevel(this.state.coachLevel);

        if (this.state.coachXp >= needed) {
            this.state.coachLevel++;
            this.state.coachXp -= needed;
            soundEngine.playCheer();

            // Notifica nova tática desbloqueada
            const tacticNames = {
                2: "Triângulo de Phil Jackson (Ofensivo e Meia-Distância)",
                3: "Zona 2-3 Sufocante (Defesa Pesada e Tocos)",
                4: "Showtime Fastbreak (Contra-ataques Relâmpago)",
                5: "Clutch Masterclass (Precisão Máxima nos Minutos Finais)"
            };
            const unlocked = tacticNames[this.state.coachLevel];
            this.notify(`🎖️ PARABÉNS! SEU TÉCNICO SUBIU PARA O NÍVEL ${this.state.coachLevel}!\n\n${unlocked ? `🔓 Nova Filosofia Tática Desbloqueada: ${unlocked}!` : 'Sua reputação e influência no vestiário aumentaram!'}`);
        }

        this.renderHeader();
        this.renderTacticsTab();
    }

    // === SISTEMA DE TREINAMENTO DO TIME COM ROLAGEM DE DADOS ===
    rollTraining(playerId, attrKey) {
        if (this.state.trainingUsedThisRound) {
            return this.notify("Você já realizou a sessão de treino desta rodada! Jogue a partida para liberar a próxima sessão.");
        }

        const team = this.getUserTeam();
        const player = team.roster.find(p => p.id === playerId);
        if (!player) return this.notify("Selecione um jogador válido!");

        // Probabilidade de sucesso baseada na idade (jovens evoluem muito mais rápido)
        let successChance = 0.50;
        if (player.age <= 21) successChance = 0.75; // Calouro / Super Prospecto
        else if (player.age <= 26) successChance = 0.60;
        else if (player.age <= 31) successChance = 0.40;
        else successChance = 0.25; // Veterano

        // Bônus se tiver Centro de Treinamento ou Fisioterapia
        if (team.hasMedical) successChance += 0.10;

        // Rola o dado (1 a 6)
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const attrLabels = { o3pt: "Arremesso de 3", ins: "Infiltração", def: "Defesa", ply: "Playmaking", sta: "Energia/Stamina" };
        const attrName = attrLabels[attrKey] || attrKey;

        let resultMsg = "";
        let pointsGained = 0;

        if (Math.random() <= successChance) {
            if (diceRoll === 6) {
                // Sucesso Crítico
                pointsGained = 2;
                resultMsg = `🎲 Dado [${diceRoll}] • CRÍTICO! TREINO ESPETACULAR! 🌟 ${player.name} brilhou intensamente no treino de ${attrName} e evoluiu +${pointsGained} pontos!`;
                soundEngine.playCheer();
            } else {
                pointsGained = 1;
                resultMsg = `🎲 Dado [${diceRoll}] • SUCESSO! ✅ ${player.name} assimilou o treinamento de ${attrName} com foco e ganhou +${pointsGained} ponto!`;
                soundEngine.playSwish();
            }

            player[attrKey] = Math.min(99, player[attrKey] + pointsGained);
            // Recalcula OVR dinamicamente
            player.ovr = Math.min(99, Math.round((player.o3pt * 0.25) + (player.ins * 0.25) + (player.def * 0.25) + (player.ply * 0.25)));
        } else {
            resultMsg = `🎲 Dado [${diceRoll}] • SEM EVOLUÇÃO: O atleta ${player.name} demonstrou cansaço nas repetições de ${attrName} e não obteve ganho nesta sessão.`;
            soundEngine.playClick();
        }

        this.state.trainingUsedThisRound = true;
        this.state.lastTrainingResult = {
            playerName: player.name,
            attrName,
            diceRoll,
            pointsGained,
            message: resultMsg
        };

        this.saveGame();
        this.renderTrainingTab();
        this.renderRosterTab();
    }

    generateInitialEmails() {
        this.state.inbox = [
            {
                id: 1,
                read: false,
                sender: "Assistente Técnico",
                subject: "Relatório de Abertura da Pré-Temporada",
                body: "Bem-vindo ao comando da equipe, Senhor GM. Nossos titulares estão bem fisicamente, mas recomendo cautela com o desgaste dos veteranos nos minutos finais das partidas.",
                choices: [
                    { text: "Entendido. Focaremos no condicionamento físico.", reply: "Ótima decisão, GM. Vou monitorar os treinos de perto.", moraleEffect: 5 },
                    { text: "Prioridade é vencer jogos agora, sem poupar ninguém.", reply: "Entendido, vamos com força máxima para a quadra.", moraleEffect: 0 }
                ]
            }
        ];
    }

    triggerRandomEmail() {
        const team = this.getUserTeam();
        if (!team) return;

        const starters = team.roster.slice(0, 5);
        const randomPlayer = starters[Math.floor(Math.random() * starters.length)];

        const dilemmas = [
            {
                sender: randomPlayer.name,
                subject: "Conversa sobre Meus Minutos em Quadra",
                body: `Olá GM, estou me sentindo em grande fase física e gostaria de pedir mais minutos e liberdade para arremessar no 4º período dos jogos.`,
                choices: [
                    { text: "Você é nosso craque, terá a bola nas mãos.", reply: `Obrigado pela confiança, GM! Não vou decepcionar. (+10 Moral)`, moraleEffect: 10, player: randomPlayer },
                    { text: "Nosso foco é o jogo coletivo, sem privilégios.", reply: `Entendido... mas espero ver resultados. (-10 Moral)`, moraleEffect: -10, player: randomPlayer },
                    { text: "Vamos avaliar jogo a jogo com o treinador.", reply: `Certo, continuarei trabalhando duro. (+0 Moral)`, moraleEffect: 0, player: randomPlayer }
                ]
            },
            {
                sender: "Departamento de Olheiros",
                subject: "Alerta de Prospecto no Draft",
                body: `Nossos olheiros identificaram movimentações interessantes nas universidades. Algumas promessas parecem superestimadas pela mídia.`,
                choices: [
                    { text: "Mantenham o foco nos relatórios confidenciais.", reply: "Excelente, enviaremos relatórios atualizados antes do draft.", moraleEffect: 0 }
                ]
            }
        ];

        const pick = dilemmas[Math.floor(Math.random() * dilemmas.length)];
        this.state.inbox.unshift({
            id: Date.now(),
            read: false,
            sender: pick.sender,
            subject: pick.subject,
            body: pick.body,
            choices: pick.choices
        });
    }

    resolveEmailChoice(emailId, choiceIndex) {
        const mail = this.state.inbox.find(m => m.id === emailId);
        if (!mail || !mail.choices || !mail.choices[choiceIndex]) return;

        const choice = mail.choices[choiceIndex];
        mail.read = true;
        mail.resolved = true;
        mail.selectedReply = choice.reply;

        if (choice.player && choice.moraleEffect) {
            choice.player.morale = Math.max(40, Math.min(100, choice.player.morale + choice.moraleEffect));
        }

        soundEngine.playClick();
        this.saveGame();
        this.renderInboxTab();
        this.renderHeader();
    }

    executeTrade(myPlayerId, oppTeamId, oppPlayerId, cashOffer) {
        const userTeam = this.getUserTeam();
        const allTeams = this.getActiveTeams();
        const oppTeam = allTeams.find(t => t.id === oppTeamId);

        if (!oppTeam) return this.notify("Time adversário não encontrado!");
        const myPlayer = userTeam.roster.find(p => p.id === myPlayerId);
        const oppPlayer = oppTeam.roster.find(p => p.id === oppPlayerId);

        if (!myPlayer || !oppPlayer) return this.notify("Selecione os atletas para a troca.");
        if (cashOffer > userTeam.budget) return this.notify("Você não possui esse montante de caixa disponível!");

        const evaluation = simEngine.evaluateTrade(myPlayer, oppPlayer, cashOffer);

        if (evaluation.accepted) {
            soundEngine.playCheer();
            userTeam.budget -= cashOffer;
            oppTeam.budget += cashOffer;

            userTeam.roster = userTeam.roster.filter(p => p.id !== myPlayerId);
            oppTeam.roster = oppTeam.roster.filter(p => p.id !== oppPlayerId);

            userTeam.roster.push(oppPlayer);
            oppTeam.roster.push(myPlayer);

            this.notify(`🎉 TROCA OFICIALIZADA!\n\n${userTeam.name} recebe: ${oppPlayer.name} (${oppPlayer.pos} • OVR ${oppPlayer.ovr})\n${oppTeam.name} recebe: ${myPlayer.name} (${myPlayer.pos} • OVR ${myPlayer.ovr}) + $${(cashOffer / 1000000).toFixed(1)}M.`);

            this.state.news.unshift({
                date: `Rodada ${this.state.gameNumber}`,
                title: `BOMBA NO MERCADO: ${userTeam.name} e ${oppTeam.name} fecham troca!`,
                body: `${oppPlayer.name} agora veste a camisa do ${userTeam.name}, enquanto ${myPlayer.name} vai para ${oppTeam.name}.`
            });

            this.saveGame();
            this.renderTradesTab();
            this.renderRosterTab();
            this.renderHeader();
        } else {
            this.notify(evaluation.message);
        }
    }

    // === AVISOS, ESTADO DA RODADA E TIMER DA PARTIDA ===
    notify(message, type) {
        if (!type) {
            if (/^(⚠️|❌|🔒)/u.test(message)) type = "warning";
            else if (/^(✅|🎉|🏆|🎆|🎖️|⭐)/u.test(message)) type = "success";
            else type = "info";
        }
        notify(message, { type, duration: message.length > 120 ? 8000 : 5000 });
    }

    scheduleNextPossession() {
        clearTimeout(this._simTimer);
        const delay = this._turbo ? 10 : this.state.simSpeed;
        this._simTimer = setTimeout(() => this.runNextPossession(), delay);
    }

    renderRoundDone(status) {
        const team = this.getUserTeam();
        const m = status.match;
        let line = "Seu time não tinha jogo nesta rodada.";
        if (m && m.played) {
            const isHome = m.homeId === team.id;
            const opp = this.getActiveTeams().find(t => t.id === (isHome ? m.awayId : m.homeId));
            const mine = isHome ? m.homeScore : m.awayScore;
            const theirs = isHome ? m.awayScore : m.homeScore;
            line = `${team.name} ${mine} x ${theirs} ${opp ? opp.name : ""}`;
        }
        return `
            <div class="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-3" style="border-left: 4px solid ${team.color}">
                <p class="text-amber-400 font-bold text-lg">Rodada ${this.state.gameNumber} concluída</p>
                <p class="text-slate-300 text-sm">${line}</p>
                <button data-action="next-round" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition shadow-lg">
                    Ir para a rodada ${this.state.gameNumber + 1} ➔
                </button>
            </div>
        `;
    }

    bindEvents() {
        document.addEventListener("click", (e) => {
            const target = e.target.closest("[data-action]");
            if (!target) return;
            const action = target.dataset.action;
            const value = target.dataset.value;

            soundEngine.playClick();

            if (action === "select-era") {
                this.selectEra(value);
            } else if (action === "select-team") {
                this.selectTeam(value);
            } else if (action === "nav-tab") {
                this.switchTab(value);
            } else if (action === "set-tactic") {
                this.setTactic(value);
            } else if (action === "upgrade-arena") {
                this.upgradeArena(value);
            } else if (action === "update-ticket") {
                this.updateTicketPrice(parseInt(value));
            } else if (action === "start-match") {
                this.startMatchSimulation();
            } else if (action === "sim-speed") {
                this.setSimSpeed(parseInt(value));
            } else if (action === "quick-finish") {
                this.quickFinishMatch();
            } else if (action === "draft-player") {
                this.draftPlayer(parseInt(value));
            } else if (action === "next-round") {
                this.advanceRound();
            } else if (action === "advance-next-year") {
                this.advanceToNextYear();
            } else if (action === "roll-training-btn") {
                const pId = parseInt(document.getElementById("training-player-select")?.value);
                const attr = document.getElementById("training-attr-select")?.value;
                this.rollTraining(pId, attr);
            } else if (action === "change-era-btn") {
                if (!confirm("Trocar de era abandona a carreira atual. Deseja continuar?")) return;
                this.state.currentTeamId = null;
                this.initNewGameState();
                this.saveGame();
                this.render();
            } else if (action === "resolve-email") {
                const parts = value.split(":");
                this.resolveEmailChoice(parseInt(parts[0]), parseInt(parts[1]));
            } else if (action === "submit-trade") {
                const myP = parseInt(document.getElementById("trade-my-player")?.value);
                const oppT = document.getElementById("trade-opp-team")?.value;
                const oppP = parseInt(document.getElementById("trade-opp-player")?.value);
                const cash = parseInt(document.getElementById("trade-cash-amount")?.value || 0) * 1000000;
                this.executeTrade(myP, oppT, oppP, cash);
            } else if (action === "reset-game") {
                if (confirm("Deseja reiniciar sua carreira no Brassket?")) {
                    clearAllSaves(localStorage);
                    location.reload();
                }
            } else if (action === "swap-player") {
                this.swapPlayerWithBench(parseInt(value));
            }
        });

        document.addEventListener("change", (e) => {
            if (e.target && e.target.id === "trade-opp-team") {
                this.updateOpponentTradeRoster(e.target.value);
            } else if (e.target && e.target.id === "training-player-select") {
                this.updateTrainingOdds();
            }
        });
    }

    updateOpponentTradeRoster(teamId) {
        const allTeams = this.getActiveTeams();
        const oppTeam = allTeams.find(t => t.id === teamId);
        const selectEl = document.getElementById("trade-opp-player");
        if (!oppTeam || !selectEl) return;

        selectEl.innerHTML = oppTeam.roster.map(p => `
            <option value="${p.id}">${p.name} (${p.pos} • OVR ${p.ovr} • ${p.age} anos)</option>
        `).join("");
    }

    updateTrainingOdds() {
        const team = this.getUserTeam();
        const pId = parseInt(document.getElementById("training-player-select")?.value);
        const player = team.roster.find(p => p.id === pId);
        const oddsEl = document.getElementById("training-odds-display");
        if (!player || !oddsEl) return;

        let pct = "50%";
        let tag = "Evolução Normal";
        if (player.age <= 21) { pct = "75%"; tag = "🔥 Jovem Promessa (Alta Chance de Sucesso)"; }
        else if (player.age <= 26) { pct = "60%"; tag = "⚡ Atleta em Desenvolvimento"; }
        else if (player.age <= 31) { pct = "40%"; tag = "Veterano (Ganho Mais Lento)"; }
        else { pct = "25%"; tag = "Veterano Sênior (Foco em Preservação)"; }

        oddsEl.innerHTML = `
            <span class="text-amber-400 font-bold">${pct} de chance de sucesso</span> • <span class="text-slate-400">${tag}</span>
        `;
    }

    switchTab(tabName) {
        document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll("[data-nav-tab]").forEach(el => {
            el.classList.remove("tab-active");
            el.classList.add("text-slate-400", "border-transparent");
        });

        const activeTabEl = document.getElementById(`tab-${tabName}`);
        if (activeTabEl) activeTabEl.classList.remove("hidden");

        const btn = document.querySelector(`[data-nav-tab="${tabName}"]`);
        if (btn) {
            btn.classList.add("tab-active");
            btn.classList.remove("text-slate-400", "border-transparent");
        }

        if (tabName === "dashboard") this.renderDashboardTab();
        if (tabName === "roster") this.renderRosterTab();
        if (tabName === "standings") this.renderStandingsTab();
        if (tabName === "trades") this.renderTradesTab();
        if (tabName === "inbox") this.renderInboxTab();
        if (tabName === "history") this.renderHistoryTab();
        if (tabName === "training") this.renderTrainingTab();
    }

    setTactic(key) {
        const tactic = simEngine.tactics[key];
        if (tactic && tactic.minLevel > this.state.coachLevel) {
            return this.notify(`🔒 Esta tática está bloqueada! Ela exige Nível ${tactic.minLevel} de Treinador (Seu nível atual: ${this.state.coachLevel}). Vença jogos para ganhar XP!`);
        }
        this.state.currentTactic = key;
        this.saveGame();
        this.renderTacticsTab();
    }

    swapPlayerWithBench(playerId) {
        const team = this.getUserTeam();
        const index = team.roster.findIndex(p => p.id === playerId);
        if (index < 0) return;

        if (index < 5) {
            if (team.roster.length > 5) {
                const temp = team.roster[index];
                team.roster[index] = team.roster[5];
                team.roster[5] = temp;
            }
        } else {
            const temp = team.roster[0];
            team.roster[0] = team.roster[index];
            team.roster[index] = temp;
        }

        this.saveGame();
        this.renderRosterTab();
        soundEngine.playSwish();
    }

    upgradeArena(type) {
        const team = this.getUserTeam();
        if (type === "capacity") {
            const cost = 8000000;
            if (team.budget < cost) return this.notify("Orçamento insuficiente ($8M)!");
            team.budget -= cost;
            team.arenaCapacity += 2500;
            team.arenaLevel = (team.arenaLevel || 1) + 1;
            this.notify(`🎉 Ginásio reformado! Nova capacidade: ${team.arenaCapacity.toLocaleString()} assentos.`);
        } else if (type === "acoustics") {
            const cost = 5000000;
            if (team.budget < cost) return this.notify("Orçamento insuficiente ($5M)!");
            if (team.hasAcoustics) return this.notify("Sua arena já possui a acústica calibrada!");
            team.budget -= cost;
            team.hasAcoustics = true;
            this.notify("🔊 Caldeirão da Torcida instalado! Bônus de mando de quadra ampliado!");
        } else if (type === "suites") {
            const cost = 6000000;
            if (team.budget < cost) return this.notify("Orçamento insuficiente ($6M)!");
            if (team.hasSuites) return this.notify("Camarotes já construídos!");
            team.budget -= cost;
            team.hasSuites = true;
            this.notify("🍸 Camarotes VIP inaugurados! Receita extra garantida a cada jogo.");
        } else if (type === "medical") {
            const cost = 4500000;
            if (team.budget < cost) return this.notify("Orçamento insuficiente ($4.5M)!");
            if (team.hasMedical) return this.notify("Departamento médico já atua no nível máximo!");
            team.budget -= cost;
            team.hasMedical = true;
            team.roster.forEach(p => {
                p.sta = 100;
                p.injured = 0;
            });
            this.notify("🏥 Centro Médico inaugurado! Lesões curadas e energia em 100%.");
        }

        this.saveGame();
        this.renderArenaTab();
        this.renderHeader();
    }

    updateTicketPrice(delta) {
        const team = this.getUserTeam();
        team.ticketPrice = Math.max(25, Math.min(150, team.ticketPrice + delta));
        this.saveGame();
        this.renderArenaTab();
    }

    startMatchSimulation() {
        const current = this.state.matchState;
        if (current && !current.isFinished) {
            this.switchTab("match");
            return;
        }
        const userTeam = this.getUserTeam();
        const nextMatch = this.state.schedule.find(m => m.round === this.state.gameNumber && !m.played && (m.homeId === userTeam.id || m.awayId === userTeam.id));
        if (!nextMatch) return this.notify("Nenhuma partida pendente nesta rodada!");

        const isHome = nextMatch.homeId === userTeam.id;
        const allTeams = this.getActiveTeams();
        const opponentTeam = allTeams.find(t => t.id === (isHome ? nextMatch.awayId : nextMatch.homeId));

        const homeTeam = isHome ? userTeam : opponentTeam;
        const awayTeam = isHome ? opponentTeam : userTeam;

        this._turbo = false;
        this.state.isSimulating = true;
        this.switchTab("match");

        const homeCP = simEngine.getTeamCombatPower(homeTeam, isHome ? this.state.currentTactic : "balanced", true);
        const awayCP = simEngine.getTeamCombatPower(awayTeam, !isHome ? this.state.currentTactic : "balanced", false);

        this.state.matchState = {
            homeTeam,
            awayTeam,
            homeScore: 0,
            awayScore: 0,
            quarter: 1,
            possession: 0,
            totalPossessions: 24,
            homeCP,
            awayCP,
            events: [],
            homeStats: {},
            awayStats: {},
            isFinished: false
        };

        [...homeTeam.roster, ...awayTeam.roster].forEach(p => {
            this.state.matchState.homeStats[p.id] = { pts: 0, ast: 0, reb: 0 };
            this.state.matchState.awayStats[p.id] = { pts: 0, ast: 0, reb: 0 };
        });

        this.renderMatchView();
        this.runNextPossession();
    }

    runNextPossession() {
        if (!this.state.matchState || this.state.matchState.isFinished) return;

        const m = this.state.matchState;
        m.possession++;
        m.quarter = Math.min(4, Math.floor((m.possession - 1) / 6) + 1);
        const timeLeft = Math.round(720 - (((m.possession - 1) % 6) * 120));

        const isHomeAttack = m.possession % 2 !== 0;
        const offTeam = isHomeAttack ? m.homeTeam : m.awayTeam;
        const defTeam = isHomeAttack ? m.awayTeam : m.homeTeam;
        const offCP = isHomeAttack ? m.homeCP : m.awayCP;
        const defCP = isHomeAttack ? m.awayCP : m.homeCP;

        const event = simEngine.simulatePossession(offTeam, defTeam, offCP, defCP, m.quarter, timeLeft);

        if (event.success) {
            if (isHomeAttack) {
                m.homeScore += event.points;
                m.homeStats[event.shooter.id].pts += event.points;
                if (event.passer) m.homeStats[event.passer.id].ast += 1;
            } else {
                m.awayScore += event.points;
                m.awayStats[event.shooter.id].pts += event.points;
                if (event.passer) m.awayStats[event.passer.id].ast += 1;
            }

            if (event.points === 3) soundEngine.playSwish();
            else if (event.type === "DUNK") soundEngine.playDunk();
            else soundEngine.playSwish();
        }

        m.events.unshift({
            quarter: m.quarter,
            time: `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`,
            text: event.text,
            isScore: event.success,
            team: offTeam.name
        });

        this.updateMatchDisplay();

        if (m.possession >= m.totalPossessions) {
            this.finishMatch();
        } else {
            this.scheduleNextPossession();
        }
    }

    quickFinishMatch() {
        if (!this.state.matchState || this.state.matchState.isFinished) return;
        this._turbo = true;
        clearTimeout(this._simTimer);
        this.runNextPossession();
    }

    setSimSpeed(speedMs) {
        this._turbo = false;
        this.state.simSpeed = speedMs;
        document.querySelectorAll("[data-speed-btn]").forEach(b => {
            b.classList.remove("bg-amber-500", "text-black");
            b.classList.add("bg-slate-800", "text-slate-300");
        });
        const activeBtn = document.querySelector(`[data-speed-btn="${speedMs}"]`);
        if (activeBtn) {
            activeBtn.classList.remove("bg-slate-800", "text-slate-300");
            activeBtn.classList.add("bg-amber-500", "text-black");
        }
    }

    finishMatch() {
        const m = this.state.matchState;
        if (!m || m.isFinished) return;
        m.isFinished = true;
        this.state.isSimulating = false;
        soundEngine.playBuzzer();

        if (m.homeScore === m.awayScore) {
            if (Math.random() < 0.52) m.homeScore += 5;
            else m.awayScore += 5;
        }

        const userTeam = this.getUserTeam();
        const isUserHome = m.homeTeam.id === userTeam.id;
        const oppTeam = isUserHome ? m.awayTeam : m.homeTeam;
        const userScore = isUserHome ? m.homeScore : m.awayScore;
        const oppScore = isUserHome ? m.awayScore : m.homeScore;
        const userWon = userScore > oppScore;

        if (userWon) {
            soundEngine.playCheer();
            this.addCoachXp(40, "Vitória na partida");
        } else {
            this.addCoachXp(12, "Experiência de jogo");
        }

        const finances = simEngine.calculatePostGameFinances(userTeam, isUserHome, userWon);
        userTeam.budget += finances.revenue;

        userTeam.roster.slice(0, 5).forEach(p => {
            p.sta = Math.max(45, p.sta - (userTeam.hasMedical ? 6 : 12));
        });

        const newInjuries = simEngine.checkPlayerInjuries(userTeam);
        if (newInjuries.length > 0) {
            newInjuries.forEach(inj => {
                this.notify(`⚠️ ALERTA MÉDICO: ${inj.player.name} sofreu ${inj.reason} e ficará fora por ${inj.games} jogo(s)!`);
            });
        }

        this.state.latestNewspaper = simEngine.generateNewspaperHeadline(userTeam, oppTeam, userScore, oppScore, isUserHome, userTeam.roster[0]);

        const scheduleItem = this.state.schedule.find(s => s.round === this.state.gameNumber && (s.homeId === userTeam.id || s.awayId === userTeam.id));
        if (scheduleItem) {
            scheduleItem.played = true;
            scheduleItem.homeScore = m.homeScore;
            scheduleItem.awayScore = m.awayScore;
        }

        const allTeams = this.getActiveTeams();
        this.state.schedule.filter(s => s.round === this.state.gameNumber && !s.played).forEach(s => {
            const hTeam = allTeams.find(t => t.id === s.homeId);
            const aTeam = allTeams.find(t => t.id === s.awayId);
            if (hTeam && aTeam) {
                const result = simEngine.simulateMatchFast(hTeam, aTeam);
                s.played = true;
                s.homeScore = result.homeScore;
                s.awayScore = result.awayScore;
            }
        });

        this.updateStandingsAfterRound();

        if (Math.random() < 0.40) {
            this.triggerRandomEmail();
        }

        this.updateMatchDisplay();
        this.saveGame();
        this.render();
    }

    updateStandingsAfterRound() {
        this.state.schedule.filter(s => s.round === this.state.gameNumber).forEach(s => {
            const home = this.state.standings[s.homeId];
            const away = this.state.standings[s.awayId];
            if (!home || !away) return;

            home.pointsFor += s.homeScore;
            home.pointsAgainst += s.awayScore;
            away.pointsFor += s.awayScore;
            away.pointsAgainst += s.homeScore;

            if (s.homeScore > s.awayScore) {
                home.wins++;
                home.homeRecord[0]++;
                home.streak = home.streak >= 0 ? home.streak + 1 : 1;
                away.losses++;
                away.awayRecord[1]++;
                away.streak = away.streak <= 0 ? away.streak - 1 : -1;
            } else {
                away.wins++;
                away.awayRecord[0]++;
                away.streak = away.streak >= 0 ? away.streak + 1 : 1;
                home.losses++;
                home.homeRecord[1]++;
                home.streak = home.streak <= 0 ? home.streak - 1 : -1;
            }

            home.pct = home.wins / (home.wins + home.losses);
            away.pct = away.wins / (away.wins + away.losses);
        });
    }

    advanceRound() {
        if (getRoundStatus(this.state, this.getUserTeam().id).phase === "pending") {
            return this.notify("⚠️ Jogue a partida desta rodada antes de avançar.", "warning");
        }
        if (this.state.gameNumber < this.state.totalRegularGames) {
            this.state.gameNumber++;
            this.state.trainingUsedThisRound = false; // Libera novo treino para a próxima rodada!
            this.state.lastTrainingResult = null;

            const userTeam = this.getUserTeam();
            userTeam.roster.forEach(p => {
                p.sta = Math.min(100, p.sta + (userTeam.hasMedical ? 15 : 10));
            });
            this.state.matchState = null;
            this.state.isSimulating = false;
            this.saveGame();
            this.render();
            this.switchTab("dashboard");
        } else {
            this.notify("🏆 Fim da Temporada Regular! Abrindo a tela do NBA Draft para renovar o elenco.");
            this.switchTab("draft");
        }
    }

    advanceToNextYear() {
        const userTeam = this.getUserTeam();
        if (getRoundStatus(this.state, userTeam.id).phase !== "season_done") {
            return this.notify("⚠️ A temporada regular ainda não terminou.", "warning");
        }
        const standing = this.state.standings[userTeam.id];
        const rank = getTeamRank(this.state.standings, userTeam.id);

        // Premiação de título caso esteja em 1º
        const isChamp = rank === 1; // provisório: os playoffs entram na Fase 3
        if (isChamp) {
            this.state.coachTitles++;
            this.addCoachXp(200, "Título de Campeão da Temporada!");
        }

        this.state.seasonHistory.unshift({
            year: this.state.currentYear,
            teamName: userTeam.name,
            record: `${standing.wins}V - ${standing.losses}D`,
            pct: (standing.pct * 100).toFixed(0) + "%",
            budget: `$${(userTeam.budget / 1000000).toFixed(1)}M`,
            title: isChamp ? "🏆 CAMPEÃO" : `${rank}º colocado`
        });

        this.state.currentYear++;
        this.state.gameNumber = 1;
        this.state.trainingUsedThisRound = false;
        this.state.lastTrainingResult = null;

        const allTeams = this.getActiveTeams();
        allTeams.forEach(t => {
            t.roster.forEach(p => {
                p.age += 1;
                p.sta = 100;
                p.injured = 0;
                p.morale = 95;
            });
        });

        this.state.matchState = null;
        this.state.isSimulating = false;
        this.state.latestNewspaper = null;
        this.state.standings = createEmptyStandings(allTeams);

        this.generateSchedule();
        this.loadDraftClassForCurrentEra();

        this.state.news.unshift({
            date: `Temporada ${this.state.currentYear}`,
            title: `Ano Novo Iniciado: Temporada ${this.state.currentYear}!`,
            body: `Os novatos foram integrados aos elencos. A nova tabela de jogos foi sorteada!`
        });

        this.notify(`🎆 BEM-VINDO À TEMPORADA ${this.state.currentYear}!\n\nSeu elenco foi preservado, novatos foram integrados e o novo treinamento foi liberado!`);
        this.saveGame();
        this.render();
        this.switchTab("dashboard");
    }

    draftPlayer(prospectId) {
        const prospect = this.state.prospects.find(p => p.id === prospectId);
        if (!prospect) return;

        const userTeam = this.getUserTeam();
        this.notify(`⭐ ESCOLHA DO DRAFT: ${prospect.name}!\nOVR Inicial: ${prospect.ovr}\nPotencial Real: ${prospect.truePot} ${prospect.isGem ? '💎 [JOIA RARA!]' : (prospect.isBust ? '⚠️ [DECEPÇÃO]' : '✅ [SÓLIDO]')}`);

        userTeam.roster.push({
            id: Date.now(),
            name: prospect.name,
            pos: prospect.pos,
            ovr: prospect.ovr,
            o3pt: prospect.o3pt,
            ins: prospect.ins,
            def: prospect.def,
            ply: prospect.ply,
            sta: 95,
            clutch: prospect.clutch,
            age: 19,
            salary: 4,
            morale: 95,
            injured: 0
        });

        this.state.prospects = this.state.prospects.filter(p => p.id !== prospectId);
        this.saveGame();
        this.renderDraftTab();
        this.renderRosterTab();
    }

    // === RENDERIZAÇÃO ===
    render() {
        if (!this.state.currentTeamId) {
            document.getElementById("team-select-screen").classList.remove("hidden");
            document.getElementById("main-game-screen").classList.add("hidden");
            this.renderEraSelection();
            this.renderTeamSelect();
            return;
        }

        document.getElementById("team-select-screen").classList.add("hidden");
        document.getElementById("main-game-screen").classList.remove("hidden");

        this.applyDynamicTeamTheme();
        this.renderHeader();
        this.renderDashboardTab();
        this.renderRosterTab();
        this.renderTacticsTab();
        this.renderArenaTab();
        this.renderTrainingTab();
        this.renderTradesTab();
        this.renderInboxTab();
        this.renderStandingsTab();
        this.renderDraftTab();
        this.renderHistoryTab();
    }

    renderEraSelection() {
        const container = document.getElementById("eras-selector-container");
        if (!container) return;

        container.innerHTML = Object.values(BRASSKET_ERAS).map(era => {
            const isSelected = this.state.selectedEra === era.id;
            return `
                <div data-action="select-era" data-value="${era.id}" class="p-4 rounded-xl cursor-pointer transition border text-left flex items-start space-x-3 ${isSelected ? 'bg-amber-500/20 border-amber-400 shadow-amber-500/20 shadow-lg' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'}">
                    <span class="text-2xl">${era.icon}</span>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2">
                            <h4 class="font-bold text-white text-sm ${isSelected ? 'text-amber-400' : ''}">${era.name}</h4>
                            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${isSelected ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400'}">${era.badge}</span>
                        </div>
                        <p class="text-xs text-slate-400 mt-1">${era.tagline}</p>
                    </div>
                </div>
            `;
        }).join("");
    }

    renderTeamSelect() {
        const container = document.getElementById("teams-grid");
        if (!container) return;

        const currentEra = BRASSKET_ERAS[this.state.selectedEra] || BRASSKET_ERAS.modern;
        document.getElementById("current-era-title-badge").innerText = `${currentEra.name} (${currentEra.teams.length} Franquias)`;

        const teams = this.getActiveTeams();
        container.innerHTML = teams.map(t => `
            <div data-action="select-team" data-value="${t.id}" class="bg-slate-900 border border-slate-800 hover:border-amber-400 p-4 rounded-xl cursor-pointer transition transform hover:-translate-y-1 shadow-lg group">
                <div class="flex items-center space-x-3 mb-2">
                    <div class="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white shadow" style="background-color: ${t.color}; border: 2px solid ${t.secondaryColor}">
                        ${t.id.split('_')[0]}
                    </div>
                    <div>
                        <h3 class="font-bold text-white group-hover:text-amber-400 transition">${t.name}</h3>
                        <p class="text-xs text-slate-400">${t.conference === 'East' ? 'Conferência Leste' : 'Conferência Oeste'} • ${t.arena}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800">
                    <span>Craque: <strong class="text-slate-200">${t.roster[0].name} (${t.roster[0].ovr})</strong></span>
                    <span class="text-emerald-400 font-mono">$${(t.budget / 1000000).toFixed(0)}M</span>
                </div>
            </div>
        `).join("");
    }

    renderHeader() {
        const team = this.getUserTeam();
        if (!team) return;

        document.getElementById("header-team-badge").style.backgroundColor = team.color;
        document.getElementById("header-team-badge").style.borderColor = team.secondaryColor;
        document.getElementById("header-team-id").innerText = team.id.split('_')[0];
        document.getElementById("header-team-name").innerText = team.name;
        document.getElementById("header-era-badge").innerText = `${BRASSKET_ERAS[this.state.selectedEra]?.badge || 'ERA'} • ${this.state.currentYear}`;
        document.getElementById("header-round-info").innerText = `Rodada ${this.state.gameNumber} / ${this.state.totalRegularGames}`;

        const standing = this.state.standings[team.id] || { wins: 0, losses: 0, pct: 0 };
        document.getElementById("header-record").innerText = `${standing.wins}V - ${standing.losses}D (${(standing.pct * 100).toFixed(0)}%)`;
        document.getElementById("header-budget").innerText = `$${(team.budget / 1000000).toFixed(1)}M`;

        // Indicador de Nível do Técnico
        const coachBadge = document.getElementById("header-coach-level");
        if (coachBadge) {
            const needed = this.getXpNeededForLevel(this.state.coachLevel);
            coachBadge.innerHTML = `
                <div class="flex items-center space-x-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
                    <span class="text-[10px] text-amber-400 font-bold uppercase font-mono">Técnico Nvl ${this.state.coachLevel}</span>
                    <div class="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-amber-400 h-full" style="width: ${(this.state.coachXp / needed) * 100}%"></div>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400">${this.state.coachXp}/${needed} XP</span>
                </div>
            `;
        }

        const unreadCount = this.state.inbox.filter(m => !m.read).length;
        const unreadBadge = document.getElementById("inbox-unread-badge");
        if (unreadBadge) {
            unreadBadge.innerText = unreadCount;
            unreadBadge.classList.toggle("hidden", unreadCount === 0);
        }

        const trainingBadge = document.getElementById("training-avail-badge");
        if (trainingBadge) {
            trainingBadge.classList.toggle("hidden", this.state.trainingUsedThisRound);
        }
    }

    renderDashboardTab() {
        const team = this.getUserTeam();
        const status = getRoundStatus(this.state, team.id);
        const nextMatch = status.phase === "pending" ? status.match : null;

        const newspaperBox = document.getElementById("dash-newspaper-box");
        if (newspaperBox && this.state.latestNewspaper) {
            const np = this.state.latestNewspaper;
            newspaperBox.innerHTML = `
                <div class="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <div class="flex justify-between items-center border-b border-amber-500/30 pb-2 mb-3">
                        <span class="font-mono text-xs text-amber-400 font-bold uppercase tracking-widest">📰 ${np.paper}</span>
                        <span class="text-[10px] text-slate-400 font-mono">${np.date}</span>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-black text-white font-arcade uppercase tracking-wide leading-tight">${np.headline}</h3>
                    <p class="text-xs text-slate-300 mt-2 leading-relaxed">${np.sub}</p>
                    <div class="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-amber-300 font-bold">
                        PLACAR FINAL: ${np.scoreSummary}
                    </div>
                </div>
            `;
            newspaperBox.classList.remove("hidden");
        } else if (newspaperBox) {
            newspaperBox.classList.add("hidden");
        }

        const matchBox = document.getElementById("dash-next-match-box");
        if (status.phase === "round_done") {
            matchBox.innerHTML = this.renderRoundDone(status);
        } else if (!nextMatch) {
            matchBox.innerHTML = `
                <div class="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-3">
                    <p class="text-amber-400 font-bold text-lg">🎉 Temporada Regular ${this.state.currentYear} Concluída!</p>
                    <div class="flex justify-center space-x-3">
                        <button data-action="nav-tab" data-value="draft" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition shadow-lg">
                            Recrutar no Draft
                        </button>
                        <button data-action="advance-next-year" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition shadow-lg">
                            Iniciar Ano Seguinte (${this.state.currentYear + 1}) ➔
                        </button>
                    </div>
                </div>
            `;
        } else {
            const isHome = nextMatch.homeId === team.id;
            const allTeams = this.getActiveTeams();
            const oppTeam = allTeams.find(t => t.id === (isHome ? nextMatch.awayId : nextMatch.homeId));

            matchBox.innerHTML = `
                <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden" style="border-left: 4px solid ${team.color}">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-xs uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                            Próximo Confronto • ${isHome ? 'EM CASA (Fator Torcida Ativo)' : 'FORA DE CASA'}
                        </span>
                        <span class="text-xs text-slate-400">${isHome ? team.arena : oppTeam.arena}</span>
                    </div>

                    <div class="flex items-center justify-between my-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg" style="background-color: ${nextMatch.homeId === team.id ? team.color : oppTeam.color}">
                                ${nextMatch.homeId.split('_')[0]}
                            </div>
                            <div>
                                <h3 class="font-extrabold text-white text-lg">${nextMatch.homeId === team.id ? team.name : oppTeam.name}</h3>
                                <p class="text-xs text-slate-400">Mandante</p>
                            </div>
                        </div>

                        <div class="text-2xl font-black text-slate-500 px-4">VS</div>

                        <div class="flex items-center space-x-4 flex-row-reverse text-right">
                            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg" style="background-color: ${nextMatch.awayId === team.id ? team.color : oppTeam.color}">
                                ${nextMatch.awayId.split('_')[0]}
                            </div>
                            <div>
                                <h3 class="font-extrabold text-white text-lg">${nextMatch.awayId === team.id ? team.name : oppTeam.name}</h3>
                                <p class="text-xs text-slate-400">Visitante</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button data-action="start-match" class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-wide rounded-xl shadow-lg transition transform hover:scale-105 flex items-center space-x-2" style="background-color: var(--team-secondary, #f59e0b)">
                            <span>JOGAR PARTIDA</span>
                            <span class="text-lg">🏀</span>
                        </button>
                    </div>
                </div>
            `;
        }

        const newsContainer = document.getElementById("dash-news-feed");
        newsContainer.innerHTML = this.state.news.map(n => `
            <div class="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                <span class="text-[10px] text-amber-400 font-bold uppercase">${n.date}</span>
                <h4 class="font-bold text-white text-sm mt-0.5">${n.title}</h4>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">${n.body}</p>
            </div>
        `).join("");
    }

    renderRosterTab() {
        const team = this.getUserTeam();
        const container = document.getElementById("roster-table-body");
        if (!container) return;

        container.innerHTML = team.roster.map((p, idx) => {
            const isStarter = idx < 5;
            const isInjured = p.injured && p.injured > 0;
            const staColor = p.sta > 80 ? 'bg-emerald-500' : (p.sta > 65 ? 'bg-amber-500' : 'bg-rose-500');

            return `
                <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition ${isInjured ? 'opacity-70 bg-rose-950/20' : ''}">
                    <td class="py-3 px-4">
                        ${isInjured ? `
                            <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                                🏥 ${p.injured} JOGOS
                            </span>
                        ` : `
                            <span class="px-2 py-0.5 text-xs font-bold rounded ${isStarter ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400'}">
                                ${isStarter ? `TITULAR (${idx + 1})` : 'BANCO'}
                            </span>
                        `}
                    </td>
                    <td class="py-3 px-4 font-bold text-white flex items-center space-x-2">
                        <span class="text-amber-400 font-mono text-xs w-6">${p.pos}</span>
                        <span>${p.name}</span>
                        ${p.age ? `<span class="text-[10px] text-slate-500">(${p.age} anos)</span>` : ''}
                    </td>
                    <td class="py-3 px-4 text-center font-extrabold text-amber-400">${p.ovr}</td>
                    <td class="py-3 px-4 text-center font-mono text-xs text-slate-300">${p.o3pt}</td>
                    <td class="py-3 px-4 text-center font-mono text-xs text-slate-300">${p.ins}</td>
                    <td class="py-3 px-4 text-center font-mono text-xs text-slate-300">${p.def}</td>
                    <td class="py-3 px-4 text-center font-mono text-xs text-slate-300">${p.ply}</td>
                    <td class="py-3 px-4 text-center font-mono text-xs text-amber-300">${p.clutch}</td>
                    <td class="py-3 px-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div class="${staColor} h-full" style="width: ${p.sta}%"></div>
                            </div>
                            <span class="text-[11px] font-mono text-slate-400">${p.sta}%</span>
                        </div>
                    </td>
                    <td class="py-3 px-4 text-right">
                        <button data-action="swap-player" data-value="${p.id}" class="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition">
                            ${isStarter ? 'Banco' : 'Escalar'}
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    renderTacticsTab() {
        const container = document.getElementById("tactics-cards");
        if (!container) return;

        container.innerHTML = Object.entries(simEngine.tactics).map(([key, t]) => {
            const isCurrent = this.state.currentTactic === key;
            const isLocked = t.minLevel > this.state.coachLevel;

            return `
                <div data-action="${isLocked ? '' : 'set-tactic'}" data-value="${key}" class="p-5 rounded-2xl transition border ${isCurrent ? 'bg-amber-500/10 border-amber-400 shadow-amber-500/10' : (isLocked ? 'bg-slate-950/60 border-slate-900 opacity-60' : 'bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer')} shadow-lg relative">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-extrabold text-white text-base ${isCurrent ? 'text-amber-400' : ''}">${t.name}</h4>
                        ${isLocked ? `
                            <span class="text-[10px] font-mono font-bold bg-slate-800 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded flex items-center space-x-1">
                                <span>🔒</span>
                                <span>TÉCNICO NVL ${t.minLevel}</span>
                            </span>
                        ` : `
                            <span class="text-xs font-bold px-2 py-0.5 rounded ${isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}">${isCurrent ? 'ATIVA' : 'DISPONÍVEL'}</span>
                        `}
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed">${t.desc || 'Ajuste tático equilibrado para sua equipe.'}</p>
                </div>
            `;
        }).join("");
    }

    renderTrainingTab() {
        const team = this.getUserTeam();
        const playerSelect = document.getElementById("training-player-select");
        if (playerSelect) {
            playerSelect.innerHTML = team.roster.map(p => `
                <option value="${p.id}">${p.name} (${p.pos} • ${p.age} anos • OVR ${p.ovr})</option>
            `).join("");
            this.updateTrainingOdds();
        }

        const statusEl = document.getElementById("training-round-status");
        const rollBtn = document.getElementById("training-roll-action-btn");
        if (statusEl && rollBtn) {
            if (this.state.trainingUsedThisRound) {
                statusEl.innerHTML = `<span class="text-rose-400 font-bold">🔒 Sessão de Treino Concluída para a Rodada ${this.state.gameNumber}</span>. Jogue a próxima partida para liberar um novo treino!`;
                rollBtn.disabled = true;
                rollBtn.classList.add("opacity-50", "cursor-not-allowed");
            } else {
                statusEl.innerHTML = `<span class="text-emerald-400 font-bold">✅ 1 Sessão de Treino Disponível</span> para a Rodada ${this.state.gameNumber}.`;
                rollBtn.disabled = false;
                rollBtn.classList.remove("opacity-50", "cursor-not-allowed");
            }
        }

        const resultBox = document.getElementById("training-result-box");
        if (resultBox && this.state.lastTrainingResult) {
            const res = this.state.lastTrainingResult;
            resultBox.innerHTML = `
                <div class="p-4 rounded-xl border ${res.pointsGained > 0 ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'} text-xs leading-relaxed">
                    ${res.message}
                </div>
            `;
            resultBox.classList.remove("hidden");
        } else if (resultBox) {
            resultBox.classList.add("hidden");
        }
    }

    renderArenaTab() {
        const team = this.getUserTeam();
        document.getElementById("arena-name").innerText = team.arena;
        document.getElementById("arena-capacity").innerText = `${team.arenaCapacity.toLocaleString()} Lugares`;
        document.getElementById("arena-level").innerText = `Nível ${team.arenaLevel || 1}`;
        document.getElementById("ticket-price-display").innerText = `$${team.ticketPrice}`;

        const estAttendance = Math.round(team.arenaCapacity * (team.fanLoyalty / 100) * 0.9);
        const estRevenue = estAttendance * team.ticketPrice;
        document.getElementById("projected-revenue").innerText = `$${(estRevenue / 1000).toFixed(0)}k por jogo em casa`;

        document.getElementById("upgrade-acoustics-status").innerText = team.hasAcoustics ? "✅ Instalado (+3% Vantagem Casa)" : "Disponível ($5M)";
        document.getElementById("upgrade-suites-status").innerText = team.hasSuites ? "✅ Instalado (+$180k/jogo)" : "Disponível ($6M)";
        document.getElementById("upgrade-medical-status").innerText = team.hasMedical ? "✅ Instalado (Stamina Máxima)" : "Disponível ($4.5M)";
    }

    renderStandingsTab() {
        const westTeams = Object.values(this.state.standings).filter(t => t.conference === "West").sort((a, b) => b.pct - a.pct || (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst));
        const eastTeams = Object.values(this.state.standings).filter(t => t.conference === "East").sort((a, b) => b.pct - a.pct || (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst));

        const renderTableRows = (list) => list.map((t, idx) => `
            <tr class="border-b border-slate-800/80 ${t.id === this.state.currentTeamId ? 'bg-amber-500/10 font-bold text-amber-300' : 'text-slate-300'}">
                <td class="py-2.5 px-3 text-xs text-slate-500 font-mono">${idx + 1}</td>
                <td class="py-2.5 px-3 font-semibold text-xs">${t.name}</td>
                <td class="py-2.5 px-3 text-center text-xs font-mono font-bold">${t.wins}</td>
                <td class="py-2.5 px-3 text-center text-xs font-mono text-slate-400">${t.losses}</td>
                <td class="py-2.5 px-3 text-center text-xs font-mono">${(t.pct * 100).toFixed(0)}%</td>
                <td class="py-2.5 px-3 text-center text-xs font-mono text-slate-400">${t.homeRecord[0]}-${t.homeRecord[1]}</td>
                <td class="py-2.5 px-3 text-center text-xs font-mono text-slate-400">${t.awayRecord[0]}-${t.awayRecord[1]}</td>
                <td class="py-2.5 px-3 text-center text-xs font-mono ${t.streak > 0 ? 'text-emerald-400' : (t.streak < 0 ? 'text-rose-400' : 'text-slate-400')}">
                    ${t.streak > 0 ? `+${t.streak}` : (t.streak < 0 ? t.streak : '-')}
                </td>
            </tr>
        `).join("");

        document.getElementById("standings-west-body").innerHTML = renderTableRows(westTeams);
        document.getElementById("standings-east-body").innerHTML = renderTableRows(eastTeams);
    }

    renderDraftTab() {
        const container = document.getElementById("draft-board-cards");
        if (!container) return;

        container.innerHTML = this.state.prospects.map(p => `
            <div class="bg-slate-900 border border-slate-800 hover:border-amber-400/80 p-5 rounded-2xl transition shadow-lg flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">${p.pos}</span>
                            <h4 class="font-extrabold text-white text-base mt-1">${p.name}</h4>
                            <p class="text-xs text-slate-400">${p.college} • ${p.age} anos</p>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-slate-500">OVR</span>
                            <p class="text-lg font-black text-slate-200">${p.ovr}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-2 my-4 text-center">
                        <div class="bg-slate-800/80 p-1.5 rounded">
                            <span class="text-[10px] text-slate-400 block">3PT</span>
                            <strong class="text-xs text-slate-200">${p.o3pt}</strong>
                        </div>
                        <div class="bg-slate-800/80 p-1.5 rounded">
                            <span class="text-[10px] text-slate-400 block">INS</span>
                            <strong class="text-xs text-slate-200">${p.ins}</strong>
                        </div>
                        <div class="bg-slate-800/80 p-1.5 rounded">
                            <span class="text-[10px] text-slate-400 block">DEF</span>
                            <strong class="text-xs text-slate-200">${p.def}</strong>
                        </div>
                        <div class="bg-slate-800/80 p-1.5 rounded">
                            <span class="text-[10px] text-slate-400 block">PLY</span>
                            <strong class="text-xs text-slate-200">${p.ply}</strong>
                        </div>
                    </div>

                    <div class="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                        <span class="text-slate-400">Avaliação do Olheiro:</span>
                        <strong class="text-amber-400 ml-1">Potencial ~${p.scoutedPot}</strong>
                    </div>
                </div>

                <button data-action="draft-player" data-value="${p.id}" class="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow">
                    Recrutar no Draft
                </button>
            </div>
        `).join("");
    }

    renderTradesTab() {
        const userTeam = this.getUserTeam();
        const allTeams = this.getActiveTeams();
        const otherTeams = allTeams.filter(t => t.id !== userTeam.id);

        const mySelect = document.getElementById("trade-my-player");
        if (mySelect) {
            mySelect.innerHTML = userTeam.roster.map(p => `
                <option value="${p.id}">${p.name} (${p.pos} • OVR ${p.ovr} • ${p.age} anos)</option>
            `).join("");
        }

        const oppTeamSelect = document.getElementById("trade-opp-team");
        if (oppTeamSelect) {
            oppTeamSelect.innerHTML = otherTeams.map(t => `
                <option value="${t.id}">${t.name}</option>
            `).join("");

            if (otherTeams.length > 0) {
                this.updateOpponentTradeRoster(otherTeams[0].id);
            }
        }
    }

    renderInboxTab() {
        const container = document.getElementById("inbox-list-container");
        if (!container) return;

        if (this.state.inbox.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm">Sua caixa de entrada está vazia no momento.</div>`;
            return;
        }

        container.innerHTML = this.state.inbox.map(m => `
            <div class="bg-slate-900 border ${m.read ? 'border-slate-800' : 'border-amber-400/60 shadow-lg'} p-5 rounded-2xl space-y-3">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-xs font-mono font-bold text-amber-400">${m.sender}</span>
                        <h4 class="font-extrabold text-white text-base mt-0.5">${m.subject}</h4>
                    </div>
                    ${!m.read ? `<span class="bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">NOVO</span>` : ''}
                </div>
                <p class="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">${m.body}</p>

                ${m.resolved ? `
                    <div class="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                        <strong>Decisão Tomada:</strong> ${m.selectedReply}
                    </div>
                ` : `
                    <div class="space-y-2 pt-2">
                        <span class="text-[11px] font-bold text-slate-400 block uppercase">Sua Decisão como GM:</span>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            ${m.choices.map((c, i) => `
                                <button data-action="resolve-email" data-value="${m.id}:${i}" class="text-xs text-left p-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-black transition border border-slate-700">
                                    ${c.text}
                                </button>
                            `).join("")}
                        </div>
                    </div>
                `}
            </div>
        `).join("");
    }

    renderHistoryTab() {
        const container = document.getElementById("history-list-container");
        if (!container) return;

        if (this.state.seasonHistory.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-slate-500 text-sm">Nenhuma temporada anterior registrada ainda. Conclua seu primeiro ano para gravar sua história no Hall da Fama!</div>`;
            return;
        }

        container.innerHTML = this.state.seasonHistory.map(h => `
            <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-lg">
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-mono font-bold text-amber-400">TEMPORADA ${h.year}</span>
                        ${h.title ? `<span class="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold">${h.title}</span>` : ''}
                    </div>
                    <h4 class="font-extrabold text-white text-lg mt-0.5">${h.teamName}</h4>
                    <p class="text-xs text-slate-400">Campanha Final: <strong class="text-emerald-400">${h.record} (${h.pct})</strong></p>
                </div>
                <div class="text-right">
                    <span class="text-xs text-slate-500 block">Orçamento Final</span>
                    <strong class="text-white font-mono text-sm">${h.budget}</strong>
                </div>
            </div>
        `).join("");
    }

    renderMatchView() {
        const m = this.state.matchState;
        if (!m) return;

        document.getElementById("match-home-id").innerText = m.homeTeam.id.split('_')[0];
        document.getElementById("match-home-name").innerText = m.homeTeam.name;
        document.getElementById("match-home-badge").style.backgroundColor = m.homeTeam.color;

        document.getElementById("match-away-id").innerText = m.awayTeam.id.split('_')[0];
        document.getElementById("match-away-name").innerText = m.awayTeam.name;
        document.getElementById("match-away-badge").style.backgroundColor = m.awayTeam.color;

        document.getElementById("match-home-score").innerText = "0";
        document.getElementById("match-away-score").innerText = "0";
        document.getElementById("match-quarter-label").innerText = "1º QUARTO";
        document.getElementById("match-clock-label").innerText = "12:00";
        document.getElementById("match-progress-bar").style.width = "0%";
        document.getElementById("match-events-ticker").innerHTML = `
            <div class="text-center py-6 text-slate-500 text-sm">
                Bola ao alto no centro da quadra! A partida vai começar...
            </div>
        `;
        document.getElementById("match-actions-post").classList.add("hidden");
    }

    updateMatchDisplay() {
        const m = this.state.matchState;
        if (!m) return;

        document.getElementById("match-home-score").innerText = m.homeScore;
        document.getElementById("match-away-score").innerText = m.awayScore;

        const quarters = ["1º QUARTO", "2º QUARTO", "3º QUARTO", "4º QUARTO"];
        document.getElementById("match-quarter-label").innerText = quarters[m.quarter - 1] || "4º QUARTO";

        const pct = (m.possession / m.totalPossessions) * 100;
        document.getElementById("match-progress-bar").style.width = `${Math.min(100, pct)}%`;

        const ticker = document.getElementById("match-events-ticker");
        ticker.innerHTML = m.events.map((ev, i) => `
            <div class="flex items-start space-x-3 p-3 rounded-xl ${i === 0 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-900/60 border border-slate-800/60'} text-xs">
                <span class="font-mono text-amber-400 font-bold whitespace-nowrap">Q${ev.quarter} ${ev.time}</span>
                <span class="text-slate-200 leading-relaxed">${ev.text}</span>
            </div>
        `).join("");

        const boxscoreContainer = document.getElementById("match-boxscore-grid");
        if (boxscoreContainer) {
            const homeStarters = m.homeTeam.roster.slice(0, 5);
            const awayStarters = m.awayTeam.roster.slice(0, 5);

            boxscoreContainer.innerHTML = `
                <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <h5 class="font-bold text-xs text-white mb-2">${m.homeTeam.name}</h5>
                    <div class="space-y-1">
                        ${homeStarters.map(p => `
                            <div class="flex justify-between text-[11px] text-slate-300">
                                <span>${p.name}</span>
                                <strong class="text-amber-400 font-mono">${m.homeStats[p.id]?.pts || 0} pts, ${m.homeStats[p.id]?.ast || 0} ast</strong>
                            </div>
                        `).join("")}
                    </div>
                </div>
                <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <h5 class="font-bold text-xs text-white mb-2">${m.awayTeam.name}</h5>
                    <div class="space-y-1">
                        ${awayStarters.map(p => `
                            <div class="flex justify-between text-[11px] text-slate-300">
                                <span>${p.name}</span>
                                <strong class="text-amber-400 font-mono">${m.awayStats[p.id]?.pts || 0} pts, ${m.awayStats[p.id]?.ast || 0} ast</strong>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        if (m.isFinished) {
            document.getElementById("match-actions-post").classList.remove("hidden");
        }
    }
}

