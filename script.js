const fs = require('fs');

const pontosJSON = fs.readFileSync('./pontos.json');

const pontos = JSON.parse(pontosJSON);

function toRadians(graus) {
  return (graus * Math.PI) / 180;
}

function distanceStraight(spot1, spot2) {
  //Distância em linha reta entre dois pontos
  const R = 6371; // Raio médio da Terra em quilômetros

  const dLat = toRadians(spot2['latitude'] - spot1['latitude']);
  const dLon = toRadians(spot2['longitude'] - spot1['longitude']);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(spot1['latitude'])) *
      Math.cos(toRadians(spot2['latitude'])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c * 1000; // Distância em metros
  return parseFloat(distancia.toFixed(2));
}

function findPoint(name) {
  return pontos.find(point => point['nome'] === name)
}

function findF(openList) {
  let minF = openList[0]
  openList.forEach(point => {
    if(point['f'] < minF['f']) {
      minF = point
    }
  })

  return minF
}

function refazerCaminho(cameFrom, atual) {
  const caminho = [atual];

  while(cameFrom[atual['nome']]) {
    atual = cameFrom[atual['nome']]
    caminho.unshift(atual)
  }

  return caminho
}

function aStar(start, destination) {
  const openList = [start]
  const closedList = []
  const cameFrom = {}

  start['g'] = 0
  start['h'] = distanceStraight(start, destination)
  start['f'] = start['g'] + start['h']

  while(openList.length > 0) {
    const atual = findF(openList)

    if(atual['nome'] === destination['nome']) {
      const path = refazerCaminho(cameFrom, atual);
      return path;
    }

    openList.splice(openList.indexOf(atual), 1);
    closedList.push(atual);

    const adjacentes = atual['adjacentes'];

    adjacentes.forEach(adjacente => {
      const vizinho = findPoint(adjacente);

      if (closedList.includes(vizinho)) {
        return;
      }

      const tentativaG = atual['g'] + distanceStraight(atual, vizinho);

      if (!openList.includes(vizinho)) {
        openList.push(vizinho);
      } else if (tentativaG >= vizinho['g']) {
        return;
      }

      cameFrom[vizinho['nome']] = atual;
      vizinho['g'] = tentativaG;
      vizinho['h'] = distanceStraight(vizinho, destination);
      vizinho['f'] = vizinho['g'] + vizinho['h'];
    });
  }

  return null; // Não foi encontrado caminho
}

// Definição do ponto de partida e ponto de destino
const pontoInicial = findPoint('Elipse1');
const pontoFinal = findPoint('Elipse10');


const caminho = aStar(pontoInicial, pontoFinal);
console.log(caminho);