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

// Updated Redis Configuration
let redisClient;
if (process.env.REDISCLOUD_URL) {
  try {
    const redisURL = new URL(process.env.REDISCLOUD_URL);
    
    redisClient = redis.createClient({
      host: redisURL.hostname,
      port: redisURL.port,
      password: redisURL.password || '', // Extracted Redis password
    });

    redisClient.on('connect', () => console.log('Connected to Redis'));
    redisClient.on('error', (err) => console.error('Redis Error:', err));

  } catch (error) {
    console.error('Error parsing REDISCLOUD_URL:', error);
    throw error;
  }
} else {
  console.error('Missing REDISCLOUD_URL in environment variables');
  throw new Error('Missing REDISCLOUD_URL');
}

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
