const requiresLogin = (req, res, next) => {//check if the user is logged in
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {//check if the user is logged out
  if (req.session.account) {
    return res.redirect('/choose');
  }
  return next();
};

const requiresSecure = (req, res, next) => {//check if user's connection is secure
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {//bypass secure check for testing
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {//check if secure connection is required
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
