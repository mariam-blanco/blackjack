class Carta {
  representacion;
  valor;
  imagen;

  constructor(representacion) {
    this.representacion = representacion;
    this.valor = this.getValor();
    this.imagen = `${representacion}.png`;
  }

  getRepresentacion() {
    return this.representacion;
  }

  getValor() {
    // 11=> J(jota); 12=> Q(reina); 13=> K(rey);
    const figura = this.representacion.slice(0, -1);
    if (figura == 'A') {
      return 1;
    } else if (figura == 'J' || figura == 'Q' || figura == 'K') {
      return 11;
    } else {
      const valor = Number(figura);
      return valor;
    }
  }

  getImagen() {
    return this.imagen;
  }
}
