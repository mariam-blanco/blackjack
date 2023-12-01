let baraja = []; // [ { imagen: "7C.png", representacion: "7C", valor: 7, }, ... ]
const PALOS = ['C', 'D', 'P', 'T']; // C=> corazones, D=> diamantes, P=> picas, T=> tréboles
const FIGURAS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Variables juego
let ganador = ''; // 'jugador' o 'banca' o 'empate' o  undefined
let cartaOculta = false;
let contadorOculto = false;
// Variables jugadores
const banca = {
  alias: 'banca',
  manoCartas: [],
  contador: 0
};

const jugador1 = {
  alias: 'jugador',
  manoCartas: [],
  contador: 0
};

// Elementos HTML
const btnStart = document.querySelector('.js-btn-start');
const btnDeal = document.querySelector('.js-btn-deal');
const btnAddCard = document.querySelector('.js-btn-add');
const btnStop = document.querySelector('.js-btn-stop');

const modal = document.querySelector('.js-modal');
const btnModal = document.querySelector('.js-btn-modal');

// Crear baraja
const crearBaraja = () => {
  const nuevaBaraja = [];
  for (let i = 0; i <= PALOS.length - 1; i++) {
    for (let j = 0; j <= FIGURAS.length - 1; j++) {
      nuevaBaraja.push(new Carta(FIGURAS[j] + PALOS[i]));
    }
  }

  return _.shuffle(nuevaBaraja); /* Mezclar baraja */
};

const actualizarContadorDOM = (aliasJugador) => {
  const jugador = aliasJugador === 'jugador' ? jugador1 : banca;

  const contadorActualizado = jugador.manoCartas.reduce((acc, carta) => {
    return acc + carta.valor;
  }, 0);

  jugador.contador = contadorActualizado;

  const contadorJugadorDOM = document.querySelector(`.${aliasJugador} .js-contador`);

  if (aliasJugador === 'banca' && banca.manoCartas.length === 1) {
    contadorOculto = true;
    contadorJugadorDOM.textContent = 0;
  } else if (aliasJugador === 'banca' && banca.manoCartas.length === 2) {
    contadorOculto = true;
    console.log('actualizarContadorDOM: ', contadorOculto);
    contadorJugadorDOM.textContent = banca.manoCartas[1].valor;
  } else {
    contadorJugadorDOM.textContent = contadorActualizado;
    if (aliasJugador === 'banca') {
      contadorOculto = false;
    }
  }
};

const mostrarCartaOculta = () => {
  const primeraCartaBanca = document.querySelector('.banca .js-cards div img');
  const imgPrimeraCarta = banca.manoCartas[0].imagen;
  primeraCartaBanca.src = `./images/cartas/${imgPrimeraCarta}`;
  cartaOculta = false;
};

const mostrarContadorBanca = () => {
  const contadorBancaDOM = document.querySelector(`.banca .js-contador`);
  contadorBancaDOM.textContent = banca.contador;
};

/**
 * 1º Coger una carta de la baraja (la primera)
 * 2º Añadir la carta nueva a la mano del jugador que corresponda
 * 3º Actualizar contador
 * 4º Mostrar carta en el DOM
 * 5º Comprobar si hay ganador
 */

const repartirCarta = (aliasJugador) => {
  const nuevaCarta = baraja.shift();
  let imgCarta = nuevaCarta.getImagen();

  const jugador = aliasJugador === 'jugador' ? jugador1 : banca;
  jugador.manoCartas.push(nuevaCarta);

  // Colocar la imagen carta en el DOM
  const img = document.createElement('img');
  const divCarta = document.createElement('div');

  if (aliasJugador === 'banca' && banca.manoCartas.length === 1) {
    imgCarta = 'red_back.png';
    cartaOculta = true;
  } else if (aliasJugador === 'banca' && banca.manoCartas.length === 3) {
    mostrarCartaOculta();
  }

  img.src = `./images/cartas/${imgCarta}`;
  divCarta.appendChild(img);
  document.querySelector(`.${aliasJugador} .js-cards`).appendChild(divCarta);

  actualizarContadorDOM(aliasJugador);
  checkGanador(aliasJugador);
};

const checkGanador = (aliasJugador) => {
  const jugador = aliasJugador === 'jugador' ? jugador1 : banca;

  if (jugador.contador > 21) {
    ganador = aliasJugador === 'jugador' ? 'banca' : 'jugador';
  } else if (jugador.contador === 21) {
    ganador = aliasJugador;
  }

  ganador && mostrarGanador();
};

const mostrarGanador = () => {
  console.log('contadorOculto: ', contadorOculto);
  cartaOculta && mostrarCartaOculta();
  contadorOculto && mostrarContadorBanca();
  setTimeout(abrirModal, 800);
};

const parar = () => {
  while (banca.contador <= 16) {
    repartirCarta('banca');
  }

  if (banca.contador > 21) {
    ganador = 'jugador';
  } else if (banca.contador === jugador1.contador) {
    ganador = 'empate';
  } else if (banca.contador === 21) {
    ganador = 'banca';
  } else if (banca.contador < 21) {
    ganador = banca.contador > jugador1.contador ? 'banca' : 'jugador';
  }

  ganador && mostrarGanador();
};

const abrirModal = () => {
  modal.querySelector('h2').textContent = ganador == 'empate' ? 'Empate' : `¡Gana ${ganador}!`;
  modal.classList.remove('hidden');
};

const cerrarModal = () => modal.classList.add('hidden');

const deshabilitarBoton = (btn) => {
  btn.disabled = true;
};

const habilitarBoton = (btn) => {
  btn.disabled = false;
};

const borrarNodosHijoDOM = (contenedor) => {
  while (contenedor.firstChild) {
    contenedor.removeChild(contenedor.firstChild);
  }
};

const eliminarCartasDOM = () => {
  // Eliminar cartas del DOM de la partida anterior
  const divCartasJugador = document.querySelector('.jugador .js-cards');
  const divCartasBanca = document.querySelector('.banca .js-cards');

  borrarNodosHijoDOM(divCartasJugador);
  borrarNodosHijoDOM(divCartasBanca);
};

const initValoresPartida = () => {
  // Inicializar contadores, arrays de cartas de las manos y ganador
  banca.contador = 0;
  banca.manoCartas = [];
  jugador1.contador = 0;
  jugador1.manoCartas = [];
  ganador = '';
};

/********************************************+ */

const iniciarJuego = () => {
  // Crear baraja y mezclar
  baraja = crearBaraja();
};

const iniciarPartida = () => {
  baraja.length == 0 && iniciarJuego();

  const primerasCartas = ['jugador', 'banca', 'jugador', 'banca'];
  primerasCartas.forEach((alias, index) => {
    setTimeout(() => {
      repartirCarta(alias);
    }, index * 300);
  });

  deshabilitarBoton(btnDeal);
  habilitarBoton(btnAddCard);
  habilitarBoton(btnStop);
};

const limpiarPartida = () => {
  cerrarModal();
  initValoresPartida();
  actualizarContadorDOM('banca');
  actualizarContadorDOM('jugador');
  eliminarCartasDOM();

  habilitarBoton(btnDeal);
  deshabilitarBoton(btnAddCard);
  deshabilitarBoton(btnStop);
};

// btnStart.addEventListener('click', iniciarJuego);
btnDeal.addEventListener('click', iniciarPartida);
btnAddCard.addEventListener('click', () => repartirCarta('jugador'));
btnStop.addEventListener('click', parar);
btnModal.addEventListener('click', limpiarPartida);
