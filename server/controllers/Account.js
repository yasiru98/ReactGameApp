const models = require('../models');// data models

const { Account } = models;// account data modle

const loginPage = (req, res) => { // render login.handlebars page
  res.render('login', { csrfToken: req.csrfToken() });
};

const changePassPage = (req, res) => { // render login.changepass page
  res.render('changepass', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => { // destroy session and redirect to root when user logs out
  req.session.destroy();
  res.redirect('/');
};

const changePass = (request, response) => { // check validity and update user password
  const req = request;
  const res = response;

  const password = `${req.body.newPass}`;
  const password2 = `${req.body.newPass2}`;

  if (!password || !password2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (password !== password2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  if (password.length < 4 || password2.length < 4) {
    return res.status(400).json({ error: 'Password must be more than three characters' });
  }

  return Account.AccountModel.generateHash(password, (salt, hash) => {
    const updatePromise = Account.AccountModel.updateOne({ _id: req.session.account._id },
      {
        salt,
        password: hash,
      });


    updatePromise.then(() => {
      res.json({ redirect: '/choose' });
    });
  });
};

const login = (request, response) => { // validate login data and log the user in
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password' });
    }
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: '/choose' });
  });
};

const signup = (request, response) => { // validate data and create new user account
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/choose' });
    });

    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (request, response) => { // get csrf token
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassPage = changePassPage;
module.exports.changePass = changePass;
