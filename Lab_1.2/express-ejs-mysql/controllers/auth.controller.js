const UserModel = require('../models/user.model');

class AuthController {
  /**
   * Hiển thị trang Login
   */
  static showLoginPage(req, res) {
    res.render('login', { error: null });
  }

  /**
   * Xử lý logic Login
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.render('login', { error: 'Vui lòng nhập đầy đủ thông tin!' });
      }

      // Tìm user trong database
      const user = await UserModel.findByCredentials(username, password);

      if (user) {
        // Lưu thông tin user vào session
        req.session.user = user.username;
        res.redirect('/');
      } else {
        res.render('login', { error: 'Sai tài khoản hoặc mật khẩu!' });
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      res.render('login', { error: 'Đã xảy ra lỗi, vui lòng thử lại!' });
    }
  }

  /**
   * Xử lý Logout
   */
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Lỗi khi đăng xuất:', err);
      }
      res.redirect('/login');
    });
  }
}

module.exports = AuthController;
