// Requirements
const axios = require('axios');
const utf8 = require('utf8');

// Enviromental
const BASE_URL = process.env.BLING_URL;
const API_KEY = process.env.BLING_API_KEY;

// Abstracts the connection to Bling API
class BlingService {
  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
    });
  }

  // Aggregates the errors from the API into a single field
  handleErrors(data) {
    if (data && data.erros) {
      data.erros = data.erros.map(erro => (erro.cod));
    }
    return data;
  }

  // Build the XML for the order request
  buildXML(name, items) {
    const itemsXML = items.reduce((acc, item) => {
      return acc + `
      <item>
        <codigo>${item.code}</codigo>
        <descricao>${item.description}</descricao>
        <qtde>${item.quantity}</qtde>
        <vlr_unit>${item.value}</vlr_unit>
      </item>`
    }, '');
    return utf8.encode(`<pedido>
      <cliente><nome>${name}</nome></cliente>
      <itens>
        ${itemsXML}
      </itens>
    </pedido>`);
  }

  // Creates an order request to Bling
  async sendDeal(data) {
    const {
      person_name,
      items
    } = data;
    const xml = this.buildXML(person_name, items);
    try {
      const request = await this.axios.post(`/pedido/json/?apikey=${API_KEY}&xml=${xml}`);
      return this.handleErrors(request.data.retorno);
    } catch (error) {
      return {
        erro: error.message
      };
    }
  }
}

module.exports = new BlingService();