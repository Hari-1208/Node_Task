//getting the models
const models = require("../dataBase/models");
//getting statuscode and messages
const { statusCodes, messages } = require("../configs");
const { ORDER_STATUS } = require("../constants");

//Getting schema collection
const productsSchema = models.products;
const userSchema = models.user;
const orderSchema = models.order;

class orderController {
  // create new order
  static addNewOrder = async (req, res) => {
    try {
      const reqBody = req.body;

      //store product in array to store in db
      var products = [];

      //calculations for order ---------------
      const reqProductArray = reqBody.products;

      //price details calculations
      const orderDetails = {
        orderTotal: 0,
        productsPrice: 0,
      };
      for (let index = 0; index < reqProductArray.length; index++) {
        const element = reqProductArray[index];
        const product = await productsSchema.findById(element.id);

        //push product in products array for storing in db
        let obj = new Object();
        obj.productName = product.productName;
        obj.productCode = product.productCode;
        obj.quantity = element.quantity;
        obj.mrp = product.mrp;
        products.push(obj);

        //setting order details
        orderDetails.productsPrice += product?.mrp * element.quantity;
        orderDetails.orderTotal += product?.mrp * element.quantity;
      }

      // create order
      const newOrder = {
        userId: reqBody.userId,
        products,
        orderDetails: orderDetails,
        orderStatus: ORDER_STATUS[0],
      };

      const createdOrder = await orderSchema.create(newOrder);
      const user = await userSchema.findById(reqBody.userId);

      //update balance quantity for product in db
      for (let index = 0; index < reqProductArray.length; index++) {
        const element = reqProductArray[index];
        const product = await productsSchema.findById(element.id);
        //update in product qty db
        productsSchema
          .findByIdAndUpdate(element.id, {
            quantityAvailable: product.quantityAvailable - element.quantity,
          })
          .then((response) => {
            // handle success
          })
          .catch((err) => {
            // handle err
          });
      }

      return res.status(statusCodes.HTTP_OK).send({
        status: statusCodes.HTTP_OK,
        message: `Hi ${user.name}, your order has been placed succesfully.`,
        data: createdOrder,
      });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
        data: err.message,
      });
    }
  };

  // get order list
  static orderList = async (req, res) => {
    try {
      const reqBody = req.body;

      // query filter
      const filter = {
        ...(Boolean(reqBody?.userId) && { userId: reqBody?.userId }),
      };

      //finding order list for userId if passed or list all orders
      const orderList = await orderSchema.find(filter);
      if (!Boolean(orderList) || orderList.length == 0)
        return res.status(statusCodes.HTTP_NOT_FOUND).send({
          status: statusCodes.HTTP_NOT_FOUND,
          message: messages.ordersNotFound,
        });

      return res.status(statusCodes.HTTP_OK).send({
        status: statusCodes.HTTP_OK,
        message: messages.successfullyFetchedOrders,
        data: orderList,
      });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
        data: err.message,
      });
    }
  };
}

module.exports = orderController;
