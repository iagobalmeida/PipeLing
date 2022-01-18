const axios = require('axios');

class PipeDriveController {
  constructor() {
    this.axios = axios.create({
      baseURL: process.env.PIPEDRIVE_URL,
    });
  }

  async getDeals(data) {
    const request = await this.axios.get(`/deals?api_token=${process.env.PIPEDRIVE_API_KEY}&status=won`);
    return request.data.data;
  }
}

module.exports = new PipeDriveController();