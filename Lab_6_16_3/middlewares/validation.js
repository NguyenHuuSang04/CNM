function validateProductInput(req, _res, next) {
  const errors = [];
  const { name, price, unit_in_stock } = req.body;

  if (!name || !name.trim()) {
    errors.push("Tên sản phẩm không được để trống.");
  }

  const parsedPrice = Number(price);
  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    errors.push("Giá phải là số lớn hơn hoặc bằng 0.");
  }

  const parsedStock = Number(unit_in_stock);
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    errors.push("Số lượng tồn phải là số nguyên lớn hơn hoặc bằng 0.");
  }

  req.validationErrors = errors;
  next();
}

module.exports = {
  validateProductInput,
};
