class Jugador {
  cartasJugador;
  contador;
  alias;

  constructor(alias) {
    this.contador = 0;
    this.alias = alias;
    this.cartasJugador = [];
  }

  get contador() {
    return this.contador;
  }

  get alias() {
    return this.alias;
  }

  actualizarContador() {
    // this.contador = this.cartasJugador.reduce((acc, current) => acc + current);
  }

  anadirCarta(carta) {
    this.cartasJugador.push(carta);

    this.actualizarContador();
    console.log(`contador ${this.alias}:  ${this.contador}`);
  }
}
