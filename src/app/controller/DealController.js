// Requirements
const DatabaseService = require('../services/DatabaseService');
const PipeDriveService = require('../services/PipeDriveService');
const BlingService = require('../services/BlingService');

// Verify if a deal need to be inserted into database, sent or not sent to Bling.
const verifyDeal = async (deal) => {
  // Returns if deal was inserted into MongoDB and/or sent to Bling
  let inserted = false;
  let sent = false;

  // Retrieve data from PipeDrive deal & find deal in MongoDB
  const {
    id,
    value,
    update_time,
    person_name
  } = deal;
  let mongoDeal = await DatabaseService.findOneDeal({ id });

  // If deal not found, create deal an attrib to mongoDeal
  if (!mongoDeal) {
    const { deal, day } = await DatabaseService.insertDeal({
      id,
      person_name,
      value,
      date: update_time,
      status: 'waiting'
    });
    mongoDeal = deal;
    inserted = true;
  }

  // If deal status is not 'sent', try to send via BlingService
  if (mongoDeal.status != 'sent') {
    sent = true;
    const items = [{
      code: 1,
      description: deal.title,
      quantity: 1,
      value: value
    }];
    const blingRecord = await BlingService.sendDeal({
      person_name,
      items
    });
    const status = !blingRecord || (blingRecord.erro && !blingRecord.erros.includes(30)) ? 'not_sent' : 'sent';
    mongoDeal = await DatabaseService.updateDeal({
      id,
      status
    });
  }

  return {
    deal: mongoDeal,
    inserted,
    sent
  };
}

// Apply the verifying procedure to a list of deals
const verifyDealList = async (dealList) => {
  const result = {
    read: 0,
    registered: 0,
    sent: 0
  }
  const data = [];

  // Foreach pipeDrive 'won' deal, verify deal
  for (pipeDriveDeal of dealList) {
    const {
      deal,
      inserted,
      sent
    } = await verifyDeal(pipeDriveDeal);
    // Updating returning data
    data.push({
      deal,
      inserted,
      sent
    });
    // Updating metrics
    result.read += 1;
    result.registered += inserted ? 1 : 0;
    result.sent += sent ? 1 : 0
  }

  // Return metrics
  return ({
    result,
    data
  });
}

// Deals related routes
module.exports = {
  // Get all the deals stored in MongoDB
  get: (req, res, next) => {
    DatabaseService.findDeals().then((data) => {
      return res.status(200).json(data);
    }).catch((error) => {
      next(error)
    });
  },

  // Get a single deal by its ID
  getId: (req, res, next) => {
    const id = req.params.id;
    DatabaseService.findOneDeal({
      id
    }).then((data) => {
      return res.status(200).json(data);
    }).catch((error) => {
      next(error);
    })
  },

  // Receives a deal either from manual POST or PipeDrive webhook
  post: (req, res, next) => {
    const pipeDriveDeal = req.body.current ? req.body.current : req.body;
    if (pipeDriveDeal.status != 'won') {
      return res.status(200).send('Only "won" deals are registred.');
    }
    verifyDeal(pipeDriveDeal).then((result) => {
      return res.status(201).json(result);
    }).catch((error) => {
      next(error);
    })
  },
  
  // Try to send the deals found in PipeDrive with status 'won'
  verifyPipeDriveDeals: (req, res, next) => {
    PipeDriveService.getDeals().then((pipeDriveDeals) => {
      verifyDealList(pipeDriveDeals).then((result) => {
        return res.status(200).json(result);
      })
    }).catch((error) => {
      next(error)
    });
  },

  // Try to resend the deals stored in MongoDB that were not sent
  verifyMongoDeals: (req, res, next) => {
    DatabaseService.findDeals().then((mongoDeals) => {
      const pipeDriveDeals = PipeDriveService.convertDealList(mongoDeals);
      verifyDealList(pipeDriveDeals).then((result) => {
        return res.status(200).json(result);
      })
    }).catch((error) => {
      next(error)
    });
  }
}