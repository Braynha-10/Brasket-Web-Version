# 🏀 Brassket: NBA Arcade GM

**Brassket** é um simulador de basquete arcade e gestão de franquias inspirado no clássico brasileiro **Brasfoot**, combinando a estratégia profunda de ser General Manager e Presidente da NBA com a velocidade viciante dos jogos retrô.

O projeto foi concebido pelo autor (**Bryan**) como a fusão definitiva entre o basquete e a fórmula do *Brasfoot*, desenvolvido e integrado sob a metodologia do programa **[Google for Developers — Antigravity Arcade](https://developers.google.com/solutions/learn/antigravity-arcade)** (repositório oficial `GoogleCloudPlatform/devrel-demos/other/antigravity-arcade`).

---

## 🌟 Sistema de Treinador, Treinamento & RPG

### 1. 🎖️ Nível de Técnico & Desbloqueio de Táticas Históricas
Conforme você disputa e vence jogos (e conquista anéis de campeão), seu treinador acumula **XP** e sobe de nível, desbloqueando filosofias táticas consagradas:
- **Nível 1 (Básicas):** Equilibrado, *Pace & Space*, *Grit & Grind*, *Small Ball*.
- **Nível 2 (Desbloqueável):** **Triângulo Ofensivo de Phil Jackson** (+16% Ataque, foco em passes inteligentes e arremessos de meia-distância com precisão cirúrgica).
- **Nível 3 (Desbloqueável):** **Zona 2-3 Sufocante** (+22% Defesa, proteção máxima do garrafão com tocos e dobras agressivas).
- **Nível 4 (Desbloqueável):** **Showtime Fastbreak** (+20% Ataque e ritmo supersônico com transições e enterradas).
- **Nível 5 (Desbloqueável):** **Clutch Masterclass** (+15% em todas as áreas e precisão máxima sob pressão nos minutos finais).

### 2. 🎲 Sessão de Treinamento Pré-Jogo com Dados (1x por Rodada)
Na nova aba **"Treino"**, o GM pode conduzir uma sessão tática antes de cada partida:
- **Fundamentos Treináveis:** Arremesso de 3 (3PT), Infiltração (INS), Defesa (DEF), Playmaking (PLY) e Físico/Stamina (STA).
- **Probabilidades por Idade:**
  - Calouros e Jovens até 21 anos: **75% de chance de sucesso**.
  - Jogadores de 22 a 26 anos: **60% de chance**.
  - Jogadores de 27 a 31 anos: **40% de chance**.
  - Veteranos acima de 32 anos: **25% de chance** (foco em manutenção).
- **Rolagem de Dados:**
  - 🎲 **Resultado 6:** Sucesso Crítico! *(+2 no atributo)*
  - 🎲 **Resultado 3 a 5:** Sucesso Normal! *(+1 no atributo)*
  - 🎲 **Resultado 1 e 2:** Sem Evolução.
- O **Overall (OVR)** do atleta é recalculado instantaneamente no plantel!

---

## ⏳ Eras Históricas & Franquias (50 Franquias no Total)

- **Era Atual (2024-2025):** Lakers, Warriors, Celtics, Nuggets, Thunder, Knicks, Mavericks, Bucks, Timberwolves, 76ers.
- **Era dos Anos 2000 (2000-2009):** Lakers (01 - Shaq/Kobe), Spurs (03 - Duncan), 76ers (01 - Iverson), Pistons (04), Suns (05 - Nash), Heat (06 - Wade), Mavericks (06 - Dirk), Timberwolves (04 - Garnett), Kings (02), Cavaliers (07 - jovem LeBron).
- **Era de Ouro (Anos 90):** Bulls (96 - Jordan/Pippen), Rockets (94 - Olajuwon), Jazz (97 - Stockton/Malone), Knicks (94 - Ewing), Magic (95 - Shaq/Penny), Pacers (98 - Reggie Miller), SuperSonics (96), Suns (93), Blazers (92), Spurs (99).
- **Era Showtime & Rivalidades (Anos 80):** Lakers (87 - Magic/Kareem), Celtics (86 - Bird/McHale), Pistons (89 - Bad Boys), 76ers (83 - Dr. J), Hawks (88 - Wilkins), Bucks (86), Nuggets (85), Rockets (86), Bulls (88), Mavericks (88).
- **Era Clássica (Anos 70):** Knicks (70 - Frazier), Bucks (71 - Kareem/Oscar), Blazers (77 - Walton), Bullets (78 - Hayes), Lakers (72 - West/Wilt), Celtics (74), Warriors (75 - Rick Barry), SuperSonics (79), Nets (76 - ABA Dr. J), 76ers (77).

---

## 🎓 Classes Históricas Reais do NBA Draft

- **Anos 80:** Michael Jordan, Hakeem Olajuwon, Charles Barkley, John Stockton, Karl Malone, Scottie Pippen, Reggie Miller (e Sam Bowie).
- **Anos 90:** Kobe Bryant, Allen Iverson, Tim Duncan, Steve Nash, Ray Allen, Kevin Garnett, Dirk Nowitzki, Vince Carter.
- **Anos 2000:** LeBron James, Dwyane Wade, Carmelo Anthony, Chris Bosh, Dwight Howard, Chris Paul, Kevin Durant (e Darko Milicic).
- **Anos 70:** Magic Johnson, Larry Bird, Bill Walton, David Thompson, Adrian Dantley, Bernard King, Robert Parish.
- **Era Atual:** Victor Wembanyama, Brandon Miller, Chet Holmgren, Scoot Henderson, Stephon Castle, Reed Sheppard.

---

## 🚀 Outras Funcionalidades

- **📰 Manchetes de Jornal Pós-Jogo:** Reagem a lavadas, jogos no clutch e atuações de astros.
- **📬 E-mails do GM:** Atletas mandam pedidos de minutos com 3 escolhas de resposta que alteram a moral.
- **🔄 Trade Machine com IA:** Avalia trocas de atletas e compensações financeiras.
- **🏥 Sistema de Lesões:** Desgaste e fadiga provocam contusões que duram de 1 a 4 jogos.
- **🏆 Multitemporadas:** Avance anos (ex: 1970 ➔ 1971) preservando seu elenco, envelhecendo os atletas e acumulando troféus no Hall da Fama.

---

## 🎮 Como Jogar

Dê um duplo clique no arquivo [`index.html`](file:///C:/Users/Bryan/.gemini/antigravity/scratch/hoopsfoot-nba-arcade-gm/index.html) para abrir diretamente no seu navegador. O jogo salva tudo no seu `localStorage` de forma automática e offline!

---

## 🌐 Publicação no GitHub Pages & Antigravity Arcade

Consulte as instruções detalhadas no repositório para publicar gratuitamente no GitHub Pages ou clonar o projeto dentro de `devrel-demos/other/antigravity-arcade/games/brassket`.
