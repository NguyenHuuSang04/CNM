const productModel = require("../models/productModel");

// Hiển thị danh sách sản phẩm (GET)
exports.index = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.render("index", { 
      products,
      message: req.query.message || null
    });
  } catch (error) {
    console.error("Error in index controller:", error);
    res.status(500).render("index", { 
      products: [],
      message: "Lỗi khi tải danh sách sản phẩm"
    });
  }
};

// Thêm sản phẩm mới (POST)
exports.add = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !price) {
      return res.redirect("/?message=" + encodeURIComponent("Vui lòng nhập đầy đủ thông tin"));
    }
    
    await productModel.createProduct(name, price, description || "");
    res.redirect("/?message=" + encodeURIComponent("Thêm sản phẩm thành công"));
  } catch (error) {
    console.error("Error in add controller:", error);
    res.redirect("/?message=" + encodeURIComponent("Lỗi khi thêm sản phẩm"));
  }
};

// Xóa sản phẩm (POST)
exports.delete = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.redirect("/?message=" + encodeURIComponent("ID sản phẩm không hợp lệ"));
    }
    
    await productModel.deleteProduct(id);
    res.redirect("/?message=" + encodeURIComponent("Xóa sản phẩm thành công"));
  } catch (error) {
    console.error("Error in delete controller:", error);
    res.redirect("/?message=" + encodeURIComponent("Lỗi khi xóa sản phẩm"));
  }
};
