const DatabaseController = require('./DatabaseController');
const BlingController = require('./BlingController');
const PipeDriveController = require('./PipeDriveController');

const verifyDeal = async (deal) => {
  // Returns if deal was inserted into MongoDB and/or sent to Bling
  let inserted = false;
  let sent = false;

  // Retrieve data from PipeDrive deal & find deal in MongoDB
  const { id, value, update_time, person_name } = deal;
  const date = new Date(update_time).toISOString().split('T')[0];
  let mongoDeal = await DatabaseController.findOneDeal({id});

  // If deal not found, create deal an attrib to mongoDeal
  if(!mongoDeal) {
    const { deal, day } = await DatabaseController.insertDeal({ id, value, date, status: 'waiting' });
    mongoDeal = deal;
    inserted = true;
  }

  // If deal status is not 'sent', try to send via BlingController
  if (mongoDeal.status != 'sent') {
    sent = true;
    const blingRecord = await BlingController.sendDeal({ person_name, value });
    console.log(blingRecord);
    const status = (bilingRecord.erro && !billingRecord.erro.includes('30:')) ? 'not_sent' : 'sent';
    mongoDeal = await DatabaseController.updateDeal({ id, status });
  }

  return { mongoDeal, inserted, sent };
}

module.exports = {
  Routines: {
    verifyDeals: async (req, res, next) => {
      try {
        const result = {
          read: 0,
          registered: 0,
          sent: 0
        }
        const data = [];

        // Foreach pipeDrive 'won' deal, verify deal
        const pipeDriveDeals = await PipeDriveController.getDeals();
        for (pipeDriveDeal of pipeDriveDeals) {
          const { mongoDeal, inserted, sent } = await verifyDeal(pipeDriveDeal);
          // Updating returning data
          data.push({ mongoDeal, inserted, sent });
          // Updating metrics
          result.read += 1;
          result.registered += inserted ? 1 : 0;
          result.sent += sent ? 1 : 0
        }

        // Return metrics
        res.status(200).json({ result, data });
      } catch (error) {
        next(error);
      }
    }
  },
  Days: {
    get: async (req, res, next) => {
      try {
        const data = await DatabaseController.findDay();
        res.status(201).json(data);
      } catch (error) {
        next(error);
      }
    },
    getDate: async (req, res, next) => {
      try {
        const date = req.params.date;
        const data = await DatabaseController.findDay({ date });
        res.status(201).json(data);
      } catch (error) {
        next(error);
      }
    },
  },
  Deals: {
    get: async (req, res, next) => {
      try {
        const data = await DatabaseController.findDeal();
        res.status(201).json(data);
      } catch (error) {
        next(error);
      }
    },
    getId: async (req, res, next) => {
      try {
        const id = req.params.id;
        const data = await DatabaseController.findDeal({ id });
        res.status(201).json(data);
      } catch (error) {
        next(error);
      }
    },
    post: async (req, res, next) => {
      try {
        const pipeDriveDeal = req.body.current ? req.body.current : req.body;
        if(pipeDriveDeal.status == 'won'){
          return res.status(200).json(await verifyDeal(pipeDriveDeal));
        }else{
          return res.status(200).send('Only "won" deals are registered');
        }

      } catch (error) {
        next(error);
      }
    }
  }
}