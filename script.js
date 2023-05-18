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

function searchAdjs(points, lista = pontos) {
  let res = []

  points.forEach(point => {
    lista.forEach(ponto => {
      if (point == ponto['nome']){
        res.push(ponto)
      }
    })
  })

  return res
}

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

const fronteira = [] // Lista aberta
const visitados = [] // lista fechada

let pontoInicial = pontos[0]
let pontoFinal = pontos[22]
let pontoAtual = pontoInicial
let adjacentes = []
let adjMaisProximo = []
fronteira.push(pontoInicial)

while(true){
  if(fronteira.length == 0){
    console.log('Busca finalizado sem solução!')
    break
  } else if(pontoAtual['id'] == pontoFinal['id']){
    console.log('Busca finalizada com solução')
    break
  } else {
    adjacentes = searchAdjs(pontoAtual['adjacentes'])
    adjMaisProximo = maisProximo(adjacentes, pontoFinal)[0]

    console.log(adjMaisProximo)
    //Adicionar no início da lista aberta
    adjacentes.forEach(ponto => {
      fronteira.unshift(ponto)
    })

    // Adicionar na lista fechada
    visitados.push(adjMaisProximo)

    // Remover da lista aberta
    fronteira.forEach((ponto,index) => {
      if(ponto['id'] == adjMaisProximo['id']){
        fronteira.splice(index, 1)
      }
    })
    adjacentes = []
    pontoAtual = adjMaisProximo
}}
