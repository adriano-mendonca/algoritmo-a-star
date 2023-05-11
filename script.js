const fs = require('fs');

const pontosJSON = fs.readFileSync('./pontos.json')

const pontos = JSON.parse(pontosJSON)

let fronteira = []

function toRadians(graus) {
  return (graus * Math.PI) / 180;
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio médio da Terra em quilômetros

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c * 1000; // Distância em metros
  return distancia;
}

/* 

A chave para determinar quais pontos usar quando estiver procurando o caminho é:

F = G + H

G: é o custo do movimento.
H: É o custo estimado de movimento para mover de determinado ponto até o ponto final.

1- Adicionar o ponto inicial a LISTA ABERTA

2- Procurar o menor custo F na LISTA ABERTA
 - Mover para a LISTA FECHADA
 - Para cada ponto adjacente {
  Se não é passável ou se tiver na lista fechada, ignore.
  Caso contrário {
    Se não estiver na lista aberta, adicione-o. Faça o ponto atual o pai deste. Grave os custos F, G e H do ponto.
    Se já estiver na lista aberta, confere para ver se este caminho para aquele ponto é melhor, usando o custo G como medida. Um valor G mais baixo mostra que este é u caminho melhor. Nesse caso, mude o pai do ponto para o ponto atual, e recalcule os valores de G e F do ponto. Se você está mantendo sua lista aberta ordenada por F, você pode precisar reordenar a lista para corresponder a mudança.
  }
  Pare quando {
    Acrescente o ponto alvo à lista fecada o que determina oque o caminho foi achado ou,
    Não ache o quadrado alvo, e a lista aberta está vazia.
  }
 }

3- Salve o caminho. Caminhando para trás do ponto alvo, vá de cada ponto a seu ponto pai até que você alcance o ponto inicial. 

*/