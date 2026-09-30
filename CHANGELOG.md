# Changelog

## 0.2.0 — Fase 1: estabilização + Vite

### Corrigido
- **Elencos, caixa, arena e trocas eram perdidos ao recarregar.** O save guardava só o calendário e a tabela. Agora o save (v2) guarda a liga inteira (`league`) e a carreira (`career`).
- **"Temporada Concluída" aparecia no meio da temporada e o botão JOGAR PARTIDA sumia.** O painel agora decide o que mostrar pelo estado da rodada (`pending`, `round_done`, `season_done`) e é atualizado ao abrir a aba.
- **Cliques repetidos criavam várias simulações da mesma partida.** Há um único timer por partida, e `startMatchSimulation`/`finishMatch` ignoram chamadas repetidas.
- **"Finalizar rápido" deixava o jogo em velocidade máxima para sempre** (a velocidade salva era sobrescrita). Agora é um modo temporário da partida.
- **Trocar de era zerava a carreira sem aviso.** Agora pede confirmação e reinicia a liga de forma limpa.
- **Os dados originais das eras eram alterados durante o jogo.** Cada carreira recebe uma cópia dos times.
- Não é possível avançar de rodada sem jogar, nem virar o ano antes do fim da temporada regular.
- "Reiniciar carreira" agora apaga também os saves antigos (antes o save `hoopsfoot` podia reaparecer).
- O título de campeão deixou de ser fixo em 8 vitórias: usa a posição na tabela (provisório até os playoffs).

### Novo
- Save versionado com validação, migração automática do save v1, backup se o arquivo estiver corrompido e aviso se o armazenamento estiver cheio.
- Avisos na tela (toasts) no lugar dos `alert()` que bloqueavam o jogo.
- Projeto em Vite + Tailwind (sem o CDN de desenvolvimento) e testes automatizados.

### Observações
- Saves v1 são migrados, mas os elencos voltam ao original (eles nunca tinham sido salvos).
- Ainda pendente (próximas fases): draft por classificação, playoffs, prêmios, troca de time, radar da quadra, login e banco no Railway.
