export class ErroAplicacao extends Error {
  constructor(
    mensagem: string,
    public readonly codigoHttp: number = 400,
  ) {
    super(mensagem);
    this.name = 'ErroAplicacao';
    Object.setPrototypeOf(this, ErroAplicacao.prototype);
  }
}
