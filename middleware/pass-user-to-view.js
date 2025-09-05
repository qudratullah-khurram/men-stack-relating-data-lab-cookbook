// middleware/pass-user-to-view.js

const passUserToView = (req, res, next) => {
    console.log(req.session)
  res.locals.user = req.session.user ? req.session.user : null;
  next();
};

module.exports = passUserToView;
