const BaseRepository = require('./base.repository');
const { v4: uuidv4 } = require('uuid');

class UserRepository extends BaseRepository {
  constructor() {
    super('Users');
  }

  async createUser(userData) {
    const user = {
      userId: uuidv4(),
      username: userData.username,
      password: userData.password, // Already hashed
      role: userData.role || 'staff',
      createdAt: new Date().toISOString(),
    };
    return await this.create(user);
  }

  async findByUsername(username) {
    const users = await this.findAll(
      'username = :username',
      { ':username': username }
    );
    return users.length > 0 ? users[0] : null;
  }

  async findByUserId(userId) {
    return await this.findById({ userId });
  }

  async getAllUsers() {
    return await this.findAll();
  }
}

module.exports = new UserRepository();
