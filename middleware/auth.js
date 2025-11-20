module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session.userId) {
      return next();
    } else {
      return res.redirect('/login');
    }
  },

  ensureGuest: (req, res, next) => {
    if (req.session.userId) {
      return res.redirect('/tasks');
    } else {
      return next();
    }
  }
};
