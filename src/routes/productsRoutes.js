const express = require("express");
const productsRoutes = express.Router();

//getting controllers
const { productsController } = require("../controller");

//getting validators
const { productsValidator } = require("../validator");

//products routes ----------------------------

//post method for add a new product
productsRoutes.post(
  "/api/createNewProduct",
  productsValidator.addNewProduct,
  productsController.addNewProduct
);

//put method for update a product
productsRoutes.put(
  "/api/updateProduct",
  productsValidator.updateProduct,
  productsController.updateProduct
);

//delete method for delete a product
productsRoutes.delete(
  "/api/deleteProduct",
  productsValidator.deleteProduct,
  productsController.deleteProduct
);

module.exports = productsRoutes;
