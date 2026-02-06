const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

class UserService {
  async register(userData) {
    // Check if username exists
    const existingUser = await userRepository.findByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await userRepository.createUser({
      username: userData.username,
      password: hashedPassword,
      role: userData.role || 'staff',
    });

    // Don't return password
    delete user.password;
    return user;
  }

  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    // Don't return password
    delete user.password;
    return user;
  }

  async getUserById(userId) {
    const user = await userRepository.findByUserId(userId);
    if (user) {
      delete user.password;
    }
    return user;
  }

  async getAllUsers() {
    const users = await userRepository.getAllUsers();
    return users.map(user => {
      delete user.password;
      return user;
    });
  }
}

module.exports = new UserService();
