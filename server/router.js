const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getScores', mid.requiresLogin, controllers.App.getScores);
  app.get('/getAllScores', mid.requiresLogin, controllers.App.getAllScores);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/flappy', mid.requiresLogin, controllers.App.flappyPage);
  app.get('/sviper', mid.requiresLogin, controllers.App.sviperPage);
  app.get('/choose', mid.requiresLogin, controllers.App.choosePage);
  app.post('/maker', mid.requiresLogin, controllers.App.makeScore);
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePassPage);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*',  mid.requiresLogin, controllers.App.choosePage);
};

module.exports = router;
