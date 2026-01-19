const db = require('../db/mysql');

class ProductModel {
  /**
   * Lấy tất cả sản phẩm
   * @returns {Promise<Array>}
   */
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách sản phẩm: ' + error.message);
    }
  }

  /**
   * Lấy sản phẩm theo ID
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error('Lỗi khi lấy sản phẩm: ' + error.message);
    }
  }

  /**
   * Tạo sản phẩm mới
   * @param {Object} productData 
   * @returns {Promise<number>} ID của sản phẩm mới
   */
  static async create(productData) {
    try {
      const { name, price, quantity } = productData;
      const [result] = await db.query(
        'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)',
        [name, price, quantity]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('Lỗi khi tạo sản phẩm: ' + error.message);
    }
  }

  /**
   * Cập nhật sản phẩm
   * @param {number} id 
   * @param {Object} productData 
   * @returns {Promise<boolean>}
   */
  static async update(id, productData) {
    try {
      const { name, price, quantity } = productData;
      const [result] = await db.query(
        'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
        [name, price, quantity, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật sản phẩm: ' + error.message);
    }
  }

  /**
   * Xóa sản phẩm
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Lỗi khi xóa sản phẩm: ' + error.message);
    }
  }
}

module.exports = ProductModel;
