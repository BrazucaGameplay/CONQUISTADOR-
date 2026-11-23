# CHANGELOG

## V135 — Reorganizacao (base V134, pixel a pixel igual)
- O que mudou: assets extraidos do HTML para assets/ (28 arquivos, mesmos bytes); HTML cai de ~2,8 MB para ~300 KB; chao da dungeon agora usa a funcao unica groundTextureForDungeonTile; tabelas DIRT_BY_MASK / CLIFF_BY_MASK / GRASS_GIDS viraram fonte unica; SW virou conquistador-v135 e cacheia os assets.
- Por que: fim do crescimento por remendo; uma regra = uma funcao; upload futuro sobe so o que mudou.
- O que NAO mudou: nada visual, nada de gameplay, nada de floresta/rio/respawn/dungeon. renderCacheKey continua em v132 de proposito.

## V134 — (base)
- Chao da dungeon = chao da floresta (grama alta 85/15, terra por mascara continua terra); arte waifus/boss sob demanda; GROUND_*_GIDS como constantes; intervalos pausam com aba em segundo plano; SW conquistador-v134.
