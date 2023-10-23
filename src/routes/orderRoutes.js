const express = require("express");
const orderRoutes = express.Router();

//getting controllers
const { orderController } = require("../controller");

//getting validators
const { orderValidator } = require("../validator");

//order routes ------------------

//post method for add a new order
orderRoutes.post(
  "/api/createOrder",
  orderValidator.addNewOrder,
  orderController.addNewOrder
);

//get method for order list
orderRoutes.get(
  "/api/getOrderList",
  orderValidator.orderList,
  orderController.orderList
);

module.exports = orderRoutes;
