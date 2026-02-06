const userService = require('../services/user.service');

class AuthController {
  static showLoginForm(req, res) {
    res.render('auth/login', { error: null });
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.render('auth/login', { error: 'Vui lòng nhập đầy đủ thông tin' });
      }

      const user = await userService.login(username, password);
      req.session.user = user;

      res.redirect('/products');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      res.render('auth/login', { error: error.message });
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Lỗi khi logout:', err);
      }
      res.redirect('/login');
    });
  }

  static showRegisterForm(req, res) {
    res.render('auth/register', { error: null });
  }

  static async register(req, res) {
    try {
      const { username, password, confirmPassword, role } = req.body;

      if (!username || !password) {
        return res.render('auth/register', { error: 'Vui lòng nhập đầy đủ thông tin' });
      }

      if (password !== confirmPassword) {
        return res.render('auth/register', { error: 'Mật khẩu không khớp' });
      }

      await userService.register({
        username,
        password,
        role: role || 'staff',
      });

      res.redirect('/login');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.render('auth/register', { error: error.message });
    }
  }
}

module.exports = AuthController;
