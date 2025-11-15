module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session.userId) {
      return next();
    } else {
      req.flash('error', 'Please log in to access this page');
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
