const models = require('../models');

const { Flappy } = models;
const { Sviper } = models;
const flappyPage = (req, res) => {
  Flappy.FlappyModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('flappy', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const sviperPage = (req, res) => {
  Sviper.SviperModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('sviper', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const choosePage = (req, res) => {
  Flappy.FlappyModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('choose', { csrfToken: req.csrfToken(), domos: docs });
  });
};


const makeScore = (req, res) => {
  if (req.body.score === '0') {
    return res.status(400).json({ error: 'RAWR! Play the game first' });
  }
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  if (req.body.name.trim().length < 4) {
    return res.status(400).json({ error: 'RAWR! Name should be more than three characters' });
  }
  if (req.body.age.trim() > 99) {
    return res.status(400).json({ error: 'RAWR! Enter a valid age' });
  }
  const scoreData = {
    name: req.body.name.trim(),
    age: req.body.age.trim(),
    score: req.body.score,
    owner: req.session.account._id,
  };
  if(req.body.game === "flappy"){
  const newScore = new Flappy.FlappyModel(scoreData);
  const flappyPromise = newScore.save();

  flappyPromise.then(() => res.json({ redirect: '/flappy' }));

  flappyPromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ err: 'Score already exists.' });
    }
    return res.status(400).json({ err: 'An error occurred' });
  });
  return flappyPromise;
  }

  if(req.body.game === "sviper"){
    const newScore = new Sviper.SviperModel(scoreData);
    const sviperPromise = newScore.save();
  
    sviperPromise.then(() => res.json({ redirect: '/sviper' }));
  
    sviperPromise.catch((err) => {
      console.log(err);
  
      if (err.code === 11000) {
        return res.status(400).json({ err: 'Domo already exists.' });
      }
      return res.status(400).json({ err: 'An error occurred' });
    });
    return sviperPromise;
    }
  return false;
};

const getScores = (request, response) => {
  const req = request;
  const res = response;
  let splitUrl = request.url.split('&');
  let userGame = splitUrl[1];
  console.log(userGame);
  if(userGame === "flappy"){
  return Flappy.FlappyModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ scores: docs });
  });
}

if(userGame === "sviper"){
  return Sviper.SviperModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ scores: docs });
  });
}
return false
};

const getAllScores = (request, response) => {
  const res = response;
  let splitUrl = request.url.split('&');
  let userGame = splitUrl[1];
  if(userGame === "flappy"){
  return Flappy.FlappyModel.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ scores: docs });
  });
  
}
if(userGame === "sviper"){
  return Sviper.SviperModel.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ scores: docs });
  });
}
return false
};

module.exports.flappyPage = flappyPage;
module.exports.choosePage = choosePage;
module.exports.sviperPage = sviperPage;
module.exports.getScores = getScores;
module.exports.getAllScores = getAllScores;
module.exports.makeScore = makeScore;
