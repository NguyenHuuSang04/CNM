const db = require('../db/mysql');

class UserModel {
  /**
   * Tìm user theo username và password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object|null>}
   */
  static async findByCredentials(username, password) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?', 
        [username, password]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Lỗi khi tìm user: ' + error.message);
    }
  }

  /**
   * Tìm user theo username
   * @param {string} username 
   * @returns {Promise<Object|null>}
   */
  static async findByUsername(username) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM users WHERE username = ?', 
        [username]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Lỗi khi tìm user: ' + error.message);
    }
  }
}

module.exports = UserModel;
