function toRadians(graus) {
  return (graus * Math.PI) / 180;
}

function reta(ponto1, ponto2) {
  circTerra = 40075000;
  distanciaY = (ponto1['latitude'] * ponto2['latitude'] * circTerra) / 360;

  fatorPonto1 = Math.cos(toRadians(ponto1['latitude']));
  fatorPonto2 = Math.cos(toRadians(ponto2['latitude']));

  distanciaX =
    ((ponto1['longitude'] * fatorPonto1 - ponto2['longitude'] * fatorPonto2) *
      circTerra) /
    360;

  const distancia = R * c * 1000; // Distância em metros
  return distancia;
}
