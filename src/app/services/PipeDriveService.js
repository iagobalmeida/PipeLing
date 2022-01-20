// Requirements
const axios = require('axios');

// Enviromental
const BASE_URL = process.env.PIPEDRIVE_URL;
const API_KEY = process.env.PIPEDRIVE_API_KEY;
    
// Abstracts the connection to PipeDrive API
class PipeDriveService {

  constructor() {
    this.baseURL = BASE_URL;
    this.apiKey = API_KEY;
    this.axios = axios.create({
      baseURL: this.baseURL,
    });
  }

  // Retrieves all deals with status won
  async getDeals() {
    const request = await this.axios.get(`/deals?api_token=${this.apiKey}&status=won`);
    return request.data.data;
  }

  // Convert a mongoDB format deal into a PipeDrive format deal
  convertDeal(mongoDeal) {
    return {
      id: mongoDeal.id,
      value: mongoDeal.value,
      person_name: mongoDeal.person_name,
      update_time: mongoDeal.date
    }
  }

  // Convert a list of mogoDB format deals into a list of PipeDrive format deal
  convertDealList(mongoDealList) {
    return mongoDealList.map((deal) => this.convertDeal(deal));
  }
}

module.exports = new PipeDriveService();