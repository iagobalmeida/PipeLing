const axios = require('axios');

class BlingController {
  constructor() {
    this.axios = axios.create({
      baseURL: process.env.BLING_URL,
    });
  }

  handleErrors(data) {
    if (data && data.erros) {
      data.erro = data.erros.reduce((acc, erro) => (acc + `${(acc.length > 0 ? ', ' : '')}${erro.erro.cod}: ${erro.erro.msg}`), '');
    }
    return data;
  }

  buildXML(name, itemName, value) {
    return `<pedido>
      <cliente><nome>${name}</nome></cliente>
      <itens>
        <item>
          <codigo>1</codigo>
          <descricao>${itemName}</descricao>
          <qtde>1</qtde>
          <vlr_unit>${value}</vlr_unit>
        </item>
      </itens>
    </pedido>`;
  }

  async sendDeal(data) {
    const { person_name, value } = data;
    const xml = this.buildXML(person_name, 'Item 01', value);
    const request = await this.axios.post(`/pedido/json/?apikey=${process.env.BLING_API_KEY}&xml=${xml}`);
    return this.handleErrors(request.data.retorno);
  }
}

module.exports = new BlingController();