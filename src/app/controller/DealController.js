const Deal = require("../model/Deal");

class DealController {
    async post(req, res, next) {
        try {
            const data = await Deal.create(req.body);
            // Recebe e insere
            res.status(201).json(data);
        }catch(error){
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }
    async put(req, res, next) {
        // Recebe e insere
        res.status(201).send('Rota PUT!');
    }
    async delete(req, res, next) {
        // Recebe e insere
        res.status(201).send('Rota DELETE!');
    }
    async get(req, res, next) {
        // Recebe e insere
        try {
            const data = await Deal.find({});
            res.status(201).json(data);
        }catch(error){
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }
    async getById(req, res, next) {
        // Recebe e insere
        try {
            const id = req.params.id;
            const data = await Deal.find({id});
            res.status(201).json(data);
        }catch(error){
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }
}

module.exports = new DealController();