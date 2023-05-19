const fs = require('fs');

const pontosJSON = fs.readFileSync('./pontos.json');

const pontos = JSON.parse(pontosJSON);

function toRadians(graus) {
  return (graus * Math.PI) / 180;
}

function distanceStraight(spot1, spot2 = pontoFinal) {
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
  return distancia.toFixed(2);
}

function isInedit(spot, openList) {
  //Vefica se é inedito na fronteira
  let exit = true;
  openList.map((point) => {
    if (point['id'] == spot['id']) {
      exit = false;
      return;
    }
  });

  return exit;
}

function searchAdjs(points, list = pontos) {
  //Busca todos os adjacentes na lista principal
  return list.filter(spot => points.includes(spot['nome']));
}

function closer(points, destiny) {
  // Busca o mais próximo em relação ao ponto final
  let smaller = null;
  points.forEach((point, index) => {
    if (index == 0) {
      smaller = [point, distanceStraight(point, destiny)];
    } else if (distanceStraight(point, destiny) < smaller[1]) {
      smaller = [point, distanceStraight(point, destiny)];
    }
  });
  return smaller;
}

function removePoint(wantedPoint, list = fronteira) {
  //
  list.forEach((point, index) => {
    if (point['id'] == wantedPoint['id']) {
      list.splice(index, 1);
    }
  });
}

function sortList(list) {
  //Ordena a fronteira
  return list.sort((a, b) => a.f - b.f);
}

function evaluation(point1, point2) {
  let g = null
  const h = parseFloat(distanceStraight(point1))
  point1['adjacentes'].forEach((point, index) => {
    if(point === point2['nome']){
      g = point2['distancias'][index]
    }
    return
  })

  const f = parseFloat((g + h).toFixed(2))
  return {...point1, h, g, f}
}

let pontoInicial = pontos[0]
let pontoFinal = pontos[1]

