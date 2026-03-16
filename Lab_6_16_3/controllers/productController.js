const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const productModel = require("../models/productModel");

function deleteImageByUrl(imageUrl) {
  if (!imageUrl) {
    return;
  }

  const filePath = path.join(__dirname, "..", "public", imageUrl.replace(/^\//, ""));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function buildProductFromRequest(req, fallbackImageUrl = "") {
  return {
    name: req.body.name.trim(),
    price: Number(req.body.price),
    unit_in_stock: Number(req.body.unit_in_stock),
    url_image: req.file ? `/uploads/${req.file.filename}` : fallbackImageUrl,
  };
}

async function list(req, res, next) {
  try {
    const q = (req.query.q || "").trim();
    const products = await productModel.getAll(q);
    res.render("products/index", { products, q });
  } catch (error) {
    next(error);
  }
}

function showCreate(_req, res) {
  res.render("products/new", {
    formData: {},
    errors: [],
  });
}

async function create(req, res, next) {
  try {
    if (req.validationErrors.length > 0) {
      if (req.file) {
        deleteImageByUrl(`/uploads/${req.file.filename}`);
      }

      return res.status(400).render("products/new", {
        errors: req.validationErrors,
        formData: req.body,
      });
    }

    const product = {
      id: uuidv4(),
      ...buildProductFromRequest(req, ""),
    };

    await productModel.create(product);
    req.flash("success", "Thêm sản phẩm thành công.");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) {
      req.flash("error", "Không tìm thấy sản phẩm.");
      return res.redirect("/");
    }

    return res.render("products/detail", { product });
  } catch (error) {
    next(error);
  }
}

async function showEdit(req, res, next) {
  try {
    const product = await productModel.getById(req.params.id);
    if (!product) {
      req.flash("error", "Không tìm thấy sản phẩm.");
      return res.redirect("/");
    }

    return res.render("products/edit", {
      product,
      formData: product,
      errors: [],
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const existingProduct = await productModel.getById(req.params.id);

    if (!existingProduct) {
      if (req.file) {
        deleteImageByUrl(`/uploads/${req.file.filename}`);
      }

      req.flash("error", "Không tìm thấy sản phẩm.");
      return res.redirect("/");
    }

    if (req.validationErrors.length > 0) {
      if (req.file) {
        deleteImageByUrl(`/uploads/${req.file.filename}`);
      }

      return res.status(400).render("products/edit", {
        product: existingProduct,
        errors: req.validationErrors,
        formData: {
          ...req.body,
          url_image: existingProduct.url_image,
        },
      });
    }

    const updatedProduct = buildProductFromRequest(req, existingProduct.url_image);

    await productModel.update(req.params.id, updatedProduct);

    if (req.file && existingProduct.url_image) {
      deleteImageByUrl(existingProduct.url_image);
    }

    req.flash("success", "Cập nhật sản phẩm thành công.");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const removedProduct = await productModel.remove(req.params.id);

    if (!removedProduct) {
      req.flash("error", "Không tìm thấy sản phẩm để xóa.");
      return res.redirect("/");
    }

    if (removedProduct.url_image) {
      deleteImageByUrl(removedProduct.url_image);
    }

    req.flash("success", "Xóa sản phẩm thành công.");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  showCreate,
  create,
  detail,
  showEdit,
  update,
  remove,
};
