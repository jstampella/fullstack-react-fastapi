class MiExcepcion extends Error {
  codigo: number;

  constructor(mensaje: string, codigo: number) {
    super(mensaje);
    Object.setPrototypeOf(this, MiExcepcion.prototype);
    this.codigo = codigo;
  }
}

export default MiExcepcion;
