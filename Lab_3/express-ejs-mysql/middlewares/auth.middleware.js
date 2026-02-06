const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Bạn không có quyền truy cập chức năng này');
};

const isAdminOrStaff = (req, res, next) => {
  if (req.session && req.session.user) {
    if (req.session.user.role === 'admin' || req.session.user.role === 'staff') {
      return next();
    }
  }
  res.status(403).send('Bạn không có quyền truy cập');
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isAdminOrStaff,
};
