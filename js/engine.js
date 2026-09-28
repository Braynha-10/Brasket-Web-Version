// Engine de Simulação Estatística, Manchetes, Negociações, Lesões e Táticas de Treinador do Brassket
class SimulationEngine {
    constructor() {
        this.tactics = {
            "balanced": { name: "Equilibrado", offMod: 1.0, defMod: 1.0, paceMod: 1.0, threeBias: 0.32, staDrain: 1.0, minLevel: 1 },
            "pace_space": { name: "Pace & Space (Chuva de 3)", offMod: 1.12, defMod: 0.92, paceMod: 1.25, threeBias: 0.50, staDrain: 1.3, minLevel: 1 },
            "grit_grind": { name: "Grit & Grind (Foco Defensivo)", offMod: 0.90, defMod: 1.15, paceMod: 0.85, threeBias: 0.20, staDrain: 0.9, minLevel: 1 },
            "small_ball": { name: "Small Ball Rápido", offMod: 1.08, defMod: 0.95, paceMod: 1.18, threeBias: 0.42, staDrain: 1.2, minLevel: 1 },
            // Táticas Desbloqueáveis por Nível de Treinador
            "triangle_offense": { name: "Triângulo de Phil Jackson", offMod: 1.16, defMod: 1.02, paceMod: 0.95, threeBias: 0.28, staDrain: 0.95, minLevel: 2, desc: "A lendária tática dos Bulls e Lakers. Prioriza passes inteligentes e bolas de meia distância com alta precisão." },
            "lockdown_zone": { name: "Zona 2-3 Sufocante", offMod: 0.92, defMod: 1.22, paceMod: 0.88, threeBias: 0.22, staDrain: 1.1, minLevel: 3, desc: "Fecha o garrafão com tocos e dobras agressivas, intimidando qualquer infiltração." },
            "showtime_break": { name: "Showtime Fastbreak", offMod: 1.20, defMod: 0.94, paceMod: 1.30, threeBias: 0.35, staDrain: 1.35, minLevel: 4, desc: "Transição relâmpago com passes de ponta a ponta e enterradas espetaculares no contra-ataque." },
            "clutch_mastery": { name: "Clutch Masterclass", offMod: 1.15, defMod: 1.15, paceMod: 1.05, threeBias: 0.40, staDrain: 1.05, minLevel: 5, desc: "Instruções táticas de mestre para converter bolas decisivas nos minutos finais sob extrema pressão." }
        };
    }

    getHealthyStarters(team) {
        return team.roster.filter(p => !p.injured || p.injured <= 0).slice(0, 5);
    }

    getTeamCombatPower(team, tacticKey = "balanced", isHome = false) {
        const tactic = this.tactics[tacticKey] || this.tactics.balanced;
        let starters = this.getHealthyStarters(team);
        if (starters.length < 5) starters = team.roster.slice(0, 5);
        
        let totalOff = 0;
        let totalDef = 0;
        let totalSta = 0;

        starters.forEach(p => {
            const staminaWeight = Math.max(0.55, (p.sta || 85) / 100);
            const moraleWeight = 0.9 + ((p.morale || 85) / 500);
            
            const playerOff = ((p.o3pt * 0.4) + (p.ins * 0.4) + (p.ply * 0.2)) * staminaWeight * moraleWeight;
            const playerDef = p.def * staminaWeight * moraleWeight;
            
            totalOff += playerOff;
            totalDef += playerDef;
            totalSta += p.sta;
        });

        let homeMultiplier = 1.0;
        if (isHome) {
            const arenaBonus = ((team.arenaLevel || 1) * 0.02) + (team.hasAcoustics ? 0.03 : 0);
            homeMultiplier = 1.05 + arenaBonus;
        }

        const avgSta = totalSta / Math.max(1, starters.length);

        return {
            offense: (totalOff / Math.max(1, starters.length)) * tactic.offMod * homeMultiplier,
            defense: (totalDef / Math.max(1, starters.length)) * tactic.defMod * homeMultiplier,
            pace: tactic.paceMod,
            threeBias: tactic.threeBias,
            staDrain: tactic.staDrain,
            avgSta: avgSta
        };
    }

    simulatePossession(offTeam, defTeam, offCP, defCP, quarter, timeLeft) {
        const isClutch = (quarter === 4 && timeLeft <= 180);
        
        let diff = offCP.offense - defCP.defense;
        let probScore = 0.52 + (diff / 250);
        probScore = Math.min(0.78, Math.max(0.28, probScore));

        const starters = this.getHealthyStarters(offTeam);
        const weights = starters.map(p => {
            let w = Math.pow(p.ovr / 70, 2.5);
            if (isClutch && p.clutch > 85) w *= 1.4;
            return w;
        });
        const totalW = weights.reduce((a, b) => a + b, 0);
        let randW = Math.random() * totalW;
        let shooter = starters[0] || offTeam.roster[0];
        for (let i = 0; i < starters.length; i++) {
            if (randW <= weights[i]) {
                shooter = starters[i];
                break;
            }
            randW -= weights[i];
        }

        const passers = starters.filter(p => p.id !== shooter.id);
        const passer = passers.length > 0 ? passers[Math.floor(Math.random() * passers.length)] : null;

        const defStarters = this.getHealthyStarters(defTeam);
        const defender = defStarters.length > 0 ? defStarters[Math.floor(Math.random() * defStarters.length)] : defTeam.roster[0];

        const roll = Math.random();

        if (roll < probScore) {
            const threeRoll = Math.random();
            const isThree = threeRoll < (offCP.threeBias * (shooter.o3pt / 85));

            if (isThree) {
                return {
                    success: true,
                    type: "3PT",
                    points: 3,
                    shooter: shooter,
                    passer: passer,
                    defender: defender,
                    text: `🎯 ${shooter.name} arremessa livre da linha de 3... CESTA! (+3)`
                };
            } else {
                const dunkRoll = Math.random();
                if (dunkRoll < 0.25 && shooter.ins > 85) {
                    return {
                        success: true,
                        type: "DUNK",
                        points: 2,
                        shooter: shooter,
                        passer: passer,
                        defender: defender,
                        text: `⚡ ${passer ? `${passer.name} acha ${shooter.name} voando: ` : ''}ENTERRO ESPETACULAR! (+2)`
                    };
                } else if (dunkRoll < 0.35) {
                    return {
                        success: true,
                        type: "AND1",
                        points: 3,
                        shooter: shooter,
                        passer: passer,
                        defender: defender,
                        text: `🔥 Cesta e falta! ${shooter.name} converte a bandeja e guarda o lance livre! (+3)`
                    };
                } else {
                    return {
                        success: true,
                        type: "2PT",
                        points: 2,
                        shooter: shooter,
                        passer: passer,
                        defender: defender,
                        text: `🏀 ${shooter.name} bate para dentro e anota mais dois pontos! (+2)`
                    };
                }
            }
        } else {
            const failRoll = Math.random();
            if (failRoll < 0.30 && defender && defender.def > 85) {
                return {
                    success: false,
                    type: "BLOCK",
                    points: 0,
                    shooter: shooter,
                    defender: defender,
                    text: `🚫 TOCO MONSTRUOSO! ${defender.name} barra a subida de ${shooter.name}!`
                };
            } else if (failRoll < 0.55 && defender && defender.def > 80) {
                return {
                    success: false,
                    type: "STEAL",
                    points: 0,
                    shooter: shooter,
                    defender: defender,
                    text: `⚡ Roubo de bola cirúrgico de ${defender.name}!`
                };
            } else {
                return {
                    success: false,
                    type: "MISS",
                    points: 0,
                    shooter: shooter,
                    defender: defender,
                    text: `💨 ${shooter.name} tenta a finalização, mas a bola caprichosamente não entra.`
                };
            }
        }
    }

    simulateMatchFast(homeTeam, awayTeam, homeTactic = "balanced", awayTactic = "balanced") {
        const homeCP = this.getTeamCombatPower(homeTeam, homeTactic, true);
        const awayCP = this.getTeamCombatPower(awayTeam, awayTactic, false);

        let homeScore = 0;
        let awayScore = 0;
        const totalPossessions = Math.round(24 * ((homeCP.pace + awayCP.pace) / 2));

        for (let q = 1; q <= 4; q++) {
            for (let p = 0; p < totalPossessions / 4; p++) {
                const timeLeft = Math.round(720 - (p * (720 / (totalPossessions / 4))));
                const homePoss = this.simulatePossession(homeTeam, awayTeam, homeCP, awayCP, q, timeLeft);
                if (homePoss.success) homeScore += homePoss.points;
                const awayPoss = this.simulatePossession(awayTeam, homeTeam, awayCP, homeCP, q, timeLeft);
                if (awayPoss.success) awayScore += awayPoss.points;
            }
        }

        if (homeScore === awayScore) {
            if (Math.random() < 0.55) {
                homeScore += Math.floor(Math.random() * 6) + 4;
                awayScore += Math.floor(Math.random() * 4) + 1;
            } else {
                awayScore += Math.floor(Math.random() * 6) + 4;
                homeScore += Math.floor(Math.random() * 4) + 1;
            }
        }

        return {
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            homeScore,
            awayScore,
            winnerId: homeScore > awayScore ? homeTeam.id : awayTeam.id
        };
    }

    calculatePostGameFinances(team, isHome, won) {
        if (!isHome) return { attendance: 0, revenue: 0, ticketRev: 0, luxuryRev: 0 };

        const baseHype = team.fanLoyalty / 100;
        const priceResistance = Math.max(0.4, 1 - ((team.ticketPrice - 50) / 100));
        let occupancyRate = Math.min(1.0, Math.max(0.55, baseHype * priceResistance + (won ? 0.05 : -0.05)));

        const attendance = Math.round(team.arenaCapacity * occupancyRate);
        const ticketRev = attendance * team.ticketPrice;
        const luxuryRev = team.hasSuites ? 180000 : 40000;
        const concessionsRev = attendance * 15;
        const totalRevenue = ticketRev + luxuryRev + concessionsRev;

        return {
            attendance,
            occupancyRate: Math.round(occupancyRate * 100),
            ticketRev,
            luxuryRev,
            concessionsRev,
            revenue: totalRevenue
        };
    }

    generateNewspaperHeadline(userTeam, oppTeam, userScore, oppScore, isHome, starPlayer) {
        const newspapers = [
            "THE BRASSKET CHRONICLE",
            "THE DAILY HOOPS GAZETTE",
            "SLAM SPORTS REPORT",
            "NBA MORNING TRIBUNE"
        ];
        const paper = newspapers[Math.floor(Math.random() * newspapers.length)];
        const won = userScore > oppScore;
        const diff = Math.abs(userScore - oppScore);
        const starName = starPlayer ? starPlayer.name : userTeam.roster[0].name;

        let headline = "";
        let sub = "";

        if (won) {
            if (diff >= 18) {
                headline = `MASSACRE! ${userTeam.name.toUpperCase()} ATROPELA ${oppTeam.name.toUpperCase()} POR ${diff} PONTOS!`;
                sub = `Em atuação de gala liderada por ${starName}, a equipe não tomou conhecimento do adversário e deu um recital de basquete.`;
            } else if (diff <= 4) {
                headline = `NO CORAÇÃO! ${starName.toUpperCase()} DECIDE NO CLUTCH E ${userTeam.name.toUpperCase()} VENCE NO FINAL!`;
                sub = `Partida eletrizante com trocas de liderança até os últimos segundos. Torcida foi ao delírio no apito final (${userScore} x ${oppScore}).`;
            } else {
                headline = `VITÓRIA SÓLIDA! ${userTeam.name.toUpperCase()} DOMINA ${oppTeam.name.toUpperCase()} COM GRANDE ATUAÇÃO COLETIVA!`;
                sub = `${starName} foi o maestro da quadra na vitória por ${userScore} a ${oppScore}. Treinador elogiou o ritmo tático.`;
            }
        } else {
            if (diff >= 18) {
                headline = `NOITE DE PESADELO: ${userTeam.name.toUpperCase()} É GOLEADO POR ${oppTeam.name.toUpperCase()}!`;
                sub = `Apagão defensivo custa caro e diretoria cobra respostas após revés por ${oppScore} a ${userScore}.`;
            } else if (diff <= 4) {
                headline = `POR UM DETALHE! ${userTeam.name.toUpperCase()} LUTA ATÉ O FIM, MAS CAI DIANTE DE ${oppTeam.name.toUpperCase()}`;
                sub = `Arremesso nos últimos segundos tocou no aro e não caiu. Derrota amarga por ${oppScore} a ${userScore}.`;
            } else {
                headline = `TROPEÇO: ${oppTeam.name.toUpperCase()} SUPERA O ${userTeam.name.toUpperCase()} EM DUELO INTENSO`;
                sub = `Fadiga no último período cobrou seu preço e adversário garantiu a vitória por ${oppScore} a ${userScore}.`;
            }
        }

        return {
            paper,
            date: "EDIÇÃO ESPECIAL • PÓS-RODADA",
            headline,
            sub,
            scoreSummary: `${userTeam.name} ${userScore} x ${oppScore} ${oppTeam.name}`
        };
    }

    checkPlayerInjuries(team) {
        const medicalBonus = team.hasMedical ? 0.35 : 1.0;
        const newInjuries = [];

        team.roster.forEach(p => {
            if (p.injured && p.injured > 0) {
                p.injured--;
                if (p.injured === 0) {
                    p.morale = Math.min(100, p.morale + 10);
                }
                return;
            }

            let injuryRisk = 0.03 * medicalBonus;
            if (p.sta < 60) injuryRisk += 0.08 * medicalBonus;
            if (p.age > 33) injuryRisk += 0.05 * medicalBonus;

            if (Math.random() < injuryRisk) {
                const types = [
                    { desc: "Entorse no tornozelo", games: Math.floor(Math.random() * 2) + 1 },
                    { desc: "Estiramento muscular", games: Math.floor(Math.random() * 3) + 2 },
                    { desc: "Contusão no joelho", games: Math.floor(Math.random() * 4) + 2 }
                ];
                const injury = types[Math.floor(Math.random() * types.length)];
                p.injured = team.hasMedical ? Math.max(1, Math.floor(injury.games / 2)) : injury.games;
                newInjuries.push({ player: p, reason: injury.desc, games: p.injured });
            }
        });

        return newInjuries;
    }

    evaluateTrade(myPlayer, targetPlayer, cashOffered = 0) {
        if (!myPlayer || !targetPlayer) return { accepted: false, reason: "Selecione ambos os jogadores para a troca." };

        const myValue = (myPlayer.ovr * 1.5) + ((35 - myPlayer.age) * 1.2) + (cashOffered / 2000000);
        const targetValue = (targetPlayer.ovr * 1.5) + ((35 - targetPlayer.age) * 1.2);

        const diff = myValue - targetValue;

        if (diff >= -1.5) {
            return {
                accepted: true,
                message: `✅ Proposta Aceita! A diretoria adversária considerou o pacote justo e vantajoso.`
            };
        } else if (diff >= -5.0) {
            return {
                accepted: false,
                message: `❌ Recusada: A proposta está próxima, mas eles exigem mais dinheiro de compensação ($2M a $5M) ou um atleta de maior nível.`
            };
        } else {
            return {
                accepted: false,
                message: `❌ Proposta Rejeitada Imediatamente: "Não temos nenhum interesse em nos desfazer de ${targetPlayer.name} por esta oferta."`
            };
        }
    }

    simulatePlayoffMatch(homeTeam, awayTeam, homeTactic = "balanced", awayTactic = "balanced") {
        const homeCP = this.getTeamCombatPower(homeTeam, homeTactic, true);
        const awayCP = this.getTeamCombatPower(awayTeam, awayTactic, false);

        homeCP.defense *= 1.08;
        awayCP.defense *= 1.08;

        return this.simulateMatchFast(homeTeam, awayTeam, homeTactic, awayTactic);
    }

    calculateSeasonAwards(allTeams, standings) {
        let allPlayers = [];
        allTeams.forEach(t => {
            const teamStanding = standings[t.id] || { wins: 0, losses: 0, pct: 0 };
            t.roster.forEach(p => {
                allPlayers.push({
                    player: p,
                    team: t,
                    teamWins: teamStanding.wins,
                    teamPct: teamStanding.pct
                });
            });
        });

        // 1. MVP (Most Valuable Player)
        const mvpCandidates = [...allPlayers].map(item => {
            const p = item.player;
            const score = (p.ovr * 1.8) + (item.teamWins * 3.5) + (p.clutch * 0.25) + (p.o3pt * 0.15) + (p.ins * 0.15);
            return { ...item, score };
        }).sort((a, b) => b.score - a.score);

        const mvpWinner = mvpCandidates[0];
        if (mvpWinner) {
            mvpWinner.player.morale = 100;
            mvpWinner.player.ovr = Math.min(99, mvpWinner.player.ovr + 1);
        }

        // 2. DPOY (Defensive Player of the Year)
        const dpoyCandidates = [...allPlayers].map(item => {
            const p = item.player;
            const score = (p.def * 2.2) + (item.teamWins * 2.0) + (p.ovr * 0.2);
            return { ...item, score };
        }).sort((a, b) => b.score - a.score);

        const dpoyWinner = dpoyCandidates[0];
        if (dpoyWinner) {
            dpoyWinner.player.def = Math.min(99, dpoyWinner.player.def + 1);
            dpoyWinner.player.morale = Math.min(100, dpoyWinner.player.morale + 10);
        }

        // 3. ROY (Rookie of the Year) - Atletas de até 22 anos ou novatos
        const royEligible = allPlayers.filter(item => item.player.age <= 22);
        const royCandidates = (royEligible.length > 0 ? royEligible : allPlayers).map(item => {
            const p = item.player;
            const score = (p.ovr * 2.0) + (item.teamWins * 1.5) + ((25 - p.age) * 3);
            return { ...item, score };
        }).sort((a, b) => b.score - a.score);

        const royWinner = royCandidates[0];
        if (royWinner) {
            royWinner.player.ovr = Math.min(99, royWinner.player.ovr + 2);
            royWinner.player.morale = 100;
        }

        // 4. Quinteto Ideal All-NBA First Team
        const positions = ["PG", "SG", "SF", "PF", "C"];
        const allNbaTeam = {};
        positions.forEach(pos => {
            const posPlayers = allPlayers.filter(item => item.player.pos === pos).sort((a, b) => {
                const scoreA = (a.player.ovr * 1.5) + (a.teamWins * 2.0);
                const scoreB = (b.player.ovr * 1.5) + (b.teamWins * 2.0);
                return scoreB - scoreA;
            });
            allNbaTeam[pos] = posPlayers[0] || allPlayers[0];
        });

        return {
            mvp: mvpWinner,
            dpoy: dpoyWinner,
            roy: royWinner,
            allNba: allNbaTeam
        };
    }
}

window.simEngine = new SimulationEngine();
