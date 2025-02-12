const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const redis = require('redis');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb+srv://yasiru043:Britishmotors1@cluster0.gt0ge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// set up mongoDB
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to databse');
    throw err;
  }
});
// set up redis
let redisURL = {
  hostname: 'redis-18908.c111.us-east-1-mz.ec2.redns.redis-cloud.com',
  port: 18908,
};

let redisPASS = 'tTQsC0FM09gAWhddJNbckRBXeFXK1H6H';
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}
const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

// pull in our routes
const router = require('./router');

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({ // create a session
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo Arigato',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

app.use(csrf());// user scrf tokens for security
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log('Missing CSRF token');
  return false;
});


router(app);

app.listen(port, (err) => { // start app
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
