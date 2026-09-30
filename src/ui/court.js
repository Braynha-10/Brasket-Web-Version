// CourtRadar: Mini-Quadra Tática 2D com Radar de Posse e Animação de Jogadas para o Brassket
export class CourtRadar {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext("2d");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }
        this.ball = { x: 260, y: 130, radius: 7, color: "#ff7b00", glow: "#ffdd44" };
        this.currentAnim = null;
        this.particles = [];
        this.floatingTexts = [];
    }

    init() {
        if (!this.canvas) {
            this.canvas = document.getElementById("court-radar");
            if (this.canvas) {
                this.ctx = this.canvas.getContext("2d");
                this.width = this.canvas.width;
                this.height = this.canvas.height;
            }
        }
    }

    drawStaticCourt(homeTeam, awayTeam) {
        this.init();
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // Fundo da quadra (Madeira nobre escura arcade)
        const courtGrad = ctx.createLinearGradient(0, 0, 0, h);
        courtGrad.addColorStop(0, "#1f1811");
        courtGrad.addColorStop(0.5, "#2a2016");
        courtGrad.addColorStop(1, "#1c150f");
        ctx.fillStyle = courtGrad;
        ctx.fillRect(0, 0, w, h);

        // Réguas de assoalho de madeira sutil
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.lineWidth = 1;
        for (let y = 10; y < h; y += 14) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Borda externa da quadra
        ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
        ctx.lineWidth = 3;
        ctx.strokeRect(15, 15, w - 30, h - 30);

        // Garrafão Mandante (Esquerda) com cor primária do time
        const homeColor = homeTeam ? homeTeam.color : "#552583";
        ctx.fillStyle = `${homeColor}40`;
        ctx.fillRect(15, (h / 2) - 45, 90, 90);
        ctx.strokeStyle = homeTeam ? homeTeam.secondaryColor || "#fdb927" : "#fdb927";
        ctx.lineWidth = 2;
        ctx.strokeRect(15, (h / 2) - 45, 90, 90);

        // Garrafão Visitante (Direita) com cor primária do visitante
        const awayColor = awayTeam ? awayTeam.color : "#1d428a";
        ctx.fillStyle = `${awayColor}40`;
        ctx.fillRect(w - 105, (h / 2) - 45, 90, 90);
        ctx.strokeStyle = awayTeam ? awayTeam.secondaryColor || "#ffc72c" : "#ffc72c";
        ctx.lineWidth = 2;
        ctx.strokeRect(w - 105, (h / 2) - 45, 90, 90);

        // Círculos de Lance Livre
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        // Esquerda
        ctx.beginPath();
        ctx.arc(105, h / 2, 32, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        // Direita
        ctx.beginPath();
        ctx.arc(w - 105, h / 2, 32, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.stroke();

        // Linha dos 3 Pontos (Esquerda)
        ctx.beginPath();
        ctx.arc(42, h / 2, 98, -Math.PI / 2.3, Math.PI / 2.3);
        ctx.stroke();

        // Linha dos 3 Pontos (Direita)
        ctx.beginPath();
        ctx.arc(w - 42, h / 2, 98, Math.PI - Math.PI / 2.3, Math.PI + Math.PI / 2.3);
        ctx.stroke();

        // Linha Central e Círculo Central
        ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w / 2, 15);
        ctx.lineTo(w / 2, h - 15);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 36, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 14, 0, Math.PI * 2);
        ctx.fill();

        // Logo Brassket no Centro da Quadra
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.font = "bold 11px 'Chakra Petch', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("BRASSKET ARCADE", w / 2, (h / 2) + 4);

        // Tabelas e Aros
        // Aro Esquerdo
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(28, (h / 2) - 18);
        ctx.lineTo(28, (h / 2) + 18);
        ctx.stroke();

        ctx.fillStyle = "#ff6200";
        ctx.beginPath();
        ctx.arc(40, h / 2, 7, 0, Math.PI * 2);
        ctx.fill();

        // Aro Direito
        ctx.beginPath();
        ctx.moveTo(w - 28, (h / 2) - 18);
        ctx.lineTo(w - 28, (h / 2) + 18);
        ctx.stroke();

        ctx.fillStyle = "#ff6200";
        ctx.beginPath();
        ctx.arc(w - 40, h / 2, 7, 0, Math.PI * 2);
        ctx.fill();

        // Letras dos Times nas pontas da quadra
        ctx.font = "bold 13px 'Chakra Petch', sans-serif";
        if (homeTeam) {
            ctx.fillStyle = homeTeam.color || "#f59e0b";
            ctx.fillText(homeTeam.id.split('_')[0], 45, 32);
        }
        if (awayTeam) {
            ctx.fillStyle = awayTeam.color || "#38bdf8";
            ctx.fillText(awayTeam.id.split('_')[0], w - 45, 32);
        }
    }

    renderBall(x, y, scale = 1, glow = true) {
        if (!this.ctx) return;
        const ctx = this.ctx;

        if (glow) {
            ctx.save();
            ctx.shadowColor = "#ffaa00";
            ctx.shadowBlur = 12;
            ctx.fillStyle = "#ff7b00";
            ctx.beginPath();
            ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Centro da bola com gradiente de basquete
        const ballGrad = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 6 * scale);
        ballGrad.addColorStop(0, "#ffb049");
        ballGrad.addColorStop(0.7, "#d95300");
        ballGrad.addColorStop(1, "#8a2a00");
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(x, y, 6 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Costuras pretas de basquete
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 5 * scale, -0.4, 0.4);
        ctx.stroke();
    }

    createImpactParticles(x, y, color = "#ffaa00", count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1,
                color,
                life: 1.0,
                decay: Math.random() * 0.05 + 0.03
            });
        }
    }

    addFloatingText(text, x, y, color = "#4ade80") {
        this.floatingTexts.push({
            text,
            x,
            y,
            vy: -1.2,
            alpha: 1.0,
            color
        });
    }

    updateEffects() {
        if (!this.ctx) return;
        const ctx = this.ctx;

        // Partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Textos flutuantes (+3, DUNK, TOCO)
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy;
            t.alpha -= 0.03;
            if (t.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
                continue;
            }
            ctx.save();
            ctx.globalAlpha = t.alpha;
            ctx.font = "bold 15px 'Chakra Petch', sans-serif";
            ctx.fillStyle = t.color;
            ctx.textAlign = "center";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 6;
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        }
    }

    animatePossession(event, isHomeAttack, homeTeam, awayTeam, durationMs = 500) {
        this.init();
        if (!this.ctx) return;

        if (this.currentAnim) {
            cancelAnimationFrame(this.currentAnim);
            this.currentAnim = null;
        }

        const w = this.width;
        const h = this.height;

        // Mandante ataca da esquerda para a direita; Visitante ataca da direita para a esquerda
        const targetBasketX = isHomeAttack ? w - 40 : 40;
        const targetBasketY = h / 2;
        const startX = isHomeAttack ? w / 2 - 40 : w / 2 + 40;
        const startY = h / 2 + (Math.random() * 40 - 20);

        // Pontos de parada e finalização de acordo com o tipo de jogada
        let shootX = targetBasketX;
        let shootY = targetBasketY;

        if (event.type === "3PT") {
            shootX = isHomeAttack ? w - 145 : 145;
            shootY = Math.random() < 0.5 ? 45 : h - 45;
        } else if (event.type === "2PT") {
            shootX = isHomeAttack ? w - 100 : 100;
            shootY = h / 2 + (Math.random() * 30 - 15);
        } else if (event.type === "DUNK") {
            shootX = isHomeAttack ? w - 48 : 48;
            shootY = h / 2;
        } else if (event.type === "STEAL") {
            shootX = w / 2 + (isHomeAttack ? 20 : -20);
            shootY = h / 2 + (Math.random() * 30 - 15);
        }

        const startTime = performance.now();
        const animDuration = Math.max(160, durationMs);

        // Atualiza banner de posse
        const banner = document.getElementById("court-possession-banner");
        if (banner) {
            const attackingTeam = isHomeAttack ? homeTeam : awayTeam;
            const actionEmoji = event.type === "3PT" ? "🎯" : (event.type === "DUNK" ? "⚡" : (event.type === "BLOCK" ? "🚫" : (event.type === "STEAL" ? "⚡" : "🏀")));
            banner.innerHTML = `
                <span>${actionEmoji}</span>
                <span class="text-white">${attackingTeam.id.split('_')[0]}:</span>
                <span class="${event.success ? 'text-emerald-400' : 'text-amber-400'}">${event.shooter.name} (${event.type})</span>
            `;
            banner.style.borderColor = attackingTeam.color;
        }

        let impactCreated = false;

        const frame = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(1.0, elapsed / animDuration);

            // Redesenha a quadra estática
            this.drawStaticCourt(homeTeam, awayTeam);

            // Posição intermediária da bola
            let currentX, currentY, scale = 1.0;

            if (progress < 0.5) {
                // Fase 1: Drible até a posição de arremesso
                const p1 = progress / 0.5;
                currentX = startX + (shootX - startX) * p1;
                currentY = startY + (shootY - startY) * p1;
            } else {
                // Fase 2: Voo da bola em direção ao aro
                const p2 = (progress - 0.5) / 0.5;
                if (event.type === "STEAL") {
                    currentX = shootX;
                    currentY = shootY;
                } else {
                    currentX = shootX + (targetBasketX - shootX) * p2;
                    // Arco parabólico do arremesso
                    const arcHeight = event.type === "3PT" ? 35 : (event.type === "DUNK" ? 6 : 20);
                    currentY = shootY + (targetBasketY - shootY) * p2 - Math.sin(p2 * Math.PI) * arcHeight;
                    scale = 1.0 + Math.sin(p2 * Math.PI) * 0.4;
                }
            }

            // Jogador que defende / toco
            if (event.type === "BLOCK" && progress > 0.75) {
                this.ctx.fillStyle = "#ef4444";
                this.ctx.beginPath();
                this.ctx.arc(targetBasketX + (isHomeAttack ? -12 : 12), targetBasketY, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }

            // Desenha a bola
            this.renderBall(currentX, currentY, scale, true);

            // Efeito de impacto no final
            if (progress >= 0.95 && !impactCreated) {
                impactCreated = true;
                if (event.success) {
                    this.createImpactParticles(targetBasketX, targetBasketY, event.points === 3 ? "#4ade80" : "#f59e0b", 16);
                    this.addFloatingText(event.points === 3 ? "+3 PONTOS!" : (event.type === "DUNK" ? "SLAM DUNK! +2" : "+2 PONTOS!"), targetBasketX, targetBasketY - 14, "#4ade80");
                } else if (event.type === "BLOCK") {
                    this.createImpactParticles(targetBasketX, targetBasketY, "#ef4444", 18);
                    this.addFloatingText("🚫 TOCO!", targetBasketX, targetBasketY - 14, "#ef4444");
                } else if (event.type === "STEAL") {
                    this.createImpactParticles(shootX, shootY, "#eab308", 14);
                    this.addFloatingText("⚡ ROUBO DE BOLA!", shootX, shootY - 14, "#eab308");
                } else {
                    this.createImpactParticles(targetBasketX, targetBasketY, "#94a3b8", 8);
                    this.addFloatingText("NO ARO!", targetBasketX, targetBasketY - 14, "#94a3b8");
                }
            }

            this.updateEffects();

            if (progress < 1.0) {
                this.currentAnim = requestAnimationFrame(frame);
            } else {
                this.currentAnim = null;
            }
        };

        this.currentAnim = requestAnimationFrame(frame);
    }
}


