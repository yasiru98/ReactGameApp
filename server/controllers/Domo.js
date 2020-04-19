const models = require('../models');
const Domo = models.Domo;

const makerPage = (req,res) =>{
    Domo.DomoModel.findByOwner(req.session.account._id, (err,docs)=>{
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error occurred'});
        }

        return res.render('app',{csrfToken: req.csrfToken(), domos: docs});
    });

};

const choosePage = (req,res) =>{
    Domo.DomoModel.findByOwner(req.session.account._id, (err,docs)=>{
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error occurred'});
        }

        return res.render('choose',{csrfToken: req.csrfToken(), domos: docs});
    });

};


const makeDomo = (req, res) => {
    if(req.body.score === "0" ){
        return res.status(400).json({error: 'RAWR! Play the game first'});
    }
    else if(!req.body.name || !req.body.age){
        return res.status(400).json({error: 'RAWR! Both name and age are required'});
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        score: req.body.score,
        owner: req.session.account._id,
    };

    const newDomo = new Domo.DomoModel(domoData);
    const domoPromise = newDomo.save();

    domoPromise.then(()=> res.json({redirect: '/maker'}));

    domoPromise.catch((err) =>{
        console.log(err);

        if(err.code === 11000){
            return res.status(400).json({err: 'Domo already exists.'});
        }
        return res.status(400).json({err: 'An error occurred'});
    });

    return domoPromise;
}

const getDomos = (request, response) => {
    const req = request;
    const res = response;

    return Domo.DomoModel.findByOwner(req.session.account._id, (err,docs) => {
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error occurred'});
        }

        return res.json({domos: docs});
    });
};

const getAll = (request, response) => {
   
    const res = response;

    return Domo.DomoModel.find((err,docs) => {
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error occurred'});
        }

        return res.json({domos: docs});
    });
};

module.exports.makerPage = makerPage;
module.exports.choosePage = choosePage;
module.exports.getDomos = getDomos;
module.exports.getAll = getAll;
module.exports.make = makeDomo;