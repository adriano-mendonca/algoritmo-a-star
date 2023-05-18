const fs = require('fs')

const pontosJSON = fs.readFileSync('./pontos.json')

const pontos = JSON.parse(pontosJSON)

function toRadians(graus) {
  return (graus * Math.PI) / 180;
}

function distanceStraight(point1, point2) {
  const R = 6371; // Raio médio da Terra em quilômetros

  const dLat = toRadians(point2['latitude'] - point1['latitude']);
  const dLon = toRadians(point2['longitude'] - point1['longitude']);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(point1['latitude'])) * Math.cos(toRadians(point2['latitude'])) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c * 1000; // Distância em metros
  return distancia;
}

function isInedit(point, listaAberta = fronteira) {
  let saida = true;
  listaAberta.map(item => {
    if(item['id'] == point['id']){
      saida = false
      return
    }
  })

  return saida
}

function searchAdj(pointName, lista = pontos) {
  let res = null

  lista.map(item => {
    if(item['nome'] == pointName) {
      res = item
      return
    }
  })

  return res
}

let pontoFinal = pontos[4]

function maisProximo(points, destino) {
  let menor = null

  points.forEach((point, index) => {
    if(index == 0){
      menor = [point, distanceStraight(point, destino)]
    } else if(menor < distanceStraight(point, destino)) {
      menor = [point, distanceStraight(point, destino)]
    }
  })

  return menor
}

/* 
A chave para determinar quais pontos usar quando estiver procurando o caminho é:
F = G + H
G: é o custo do movimento. Ou seja, a distância entre os pontos
H: É o custo estimado de movimento para mover de determinado ponto até o ponto final.
1- Adicionar o ponto inicial a LISTA ABERTA
*/

let menor = null
const fronteira = [] // Lista aberta
const visitados = [] // lista fechada
let atual = pontos[0]
let listaAdjacentes = []

atual['adjacentes'].forEach((adj, index) => {
  listaAdjacentes.push(searchAdj(adj))
})

console.log(maisProximo(listaAdjacentes, pontoFinal))

atual = maisProximo(listaAdjacentes, pontoFinal)[0]
listaAdjacentes= []

atual['adjacentes'].forEach((adj, index) => {
  listaAdjacentes.push(searchAdj(adj))
})

console.log(maisProximo(listaAdjacentes, pontoFinal))


// Calcular o custo
// Ordernar pelo custo na lista aberta

/*
2- Procurar o menor custo F na LISTA ABERTA
 - Mover para a LISTA FECHADA
 - Para cada ponto adjacente {
  Se não é passável ou se tiver na lista fechada, ignore.
  Caso contrário {
    Se não estiver na lista aberta, adicione-o. Faça o ponto atual o pai deste. Grave os custos F, G e H do ponto.
    Se já estiver na lista aberta, confere para ver se este caminho para aquele ponto é melhor, usando o custo G como medida. Um valor G mais baixo mostra que este é um caminho melhor. Nesse caso, mude o pai do ponto para o ponto atual, e recalcule os valores de G e F do ponto. Se você está mantendo sua lista aberta ordenada por F, você pode precisar reordenar a lista para corresponder a mudança.
  }
  Pare quando {
    Acrescente o ponto alvo à lista fechada o que determina oque o caminho foi achado ou,
    Não ache o quadrado alvo, e a lista aberta está vazia.
  }
 }
3- Salve o caminho. Caminhando para trás do ponto alvo, vá de cada ponto a seu ponto pai até que você alcance o ponto inicial. 
*/