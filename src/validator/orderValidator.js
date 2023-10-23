const Joi = require("joi");

//getting the models
const models = require("../dataBase/models");

//getting statuscode and messages
const { statusCodes, messages } = require("../configs");

//Getting schema collection
const productsSchema = models.products;
const userSchema = models.user;

class orderValidator {
  // create order validation
  static addNewOrder = async (req, res, next) => {
    try {
      // initailize schema with joi
      const schema = Joi.object().keys({
        products: Joi.array()
          .items(
            Joi.object().keys({
              id: Joi.string().required(),
              quantity: Joi.number().required(),
            })
          )
          .required()
          .min(1),
        userId: Joi.string().required(),
      });

      const reqBody = req.body;

      //validate the schema with joi
      const { error } = schema.validate(reqBody);
      //if error occured return error
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        return res
          .status(statusCodes.HTTP_BAD_REQUEST)
          .json({ status: statusCodes.HTTP_BAD_REQUEST, error: message });
      }

      // check the user is exist
      const user = await userSchema.findById(reqBody.userId);
      if (!user)
        return res.status(statusCodes.HTTP_NOT_FOUND).json({
          status: statusCodes.HTTP_NOT_FOUND,
          message: messages.userNotExist,
        });

      //check the products is exist and needed quantity availble
      const reqProductArray = reqBody.products;
      for (let index = 0; index < reqProductArray.length; index++) {
        const element = reqProductArray[index];
        const product = await productsSchema.findById(element.id);
        //product is not found
        if (!product)
          return res.status(statusCodes.HTTP_NOT_FOUND).json({
            status: statusCodes.HTTP_NOT_FOUND,
            message: `Product with ID:${element.id} is not found!`,
          });
        //need quantity is not available
        if (product.quantityAvailable < element.quantity)
          return res.status(statusCodes.HTTP_NOT_FOUND).json({
            status: statusCodes.HTTP_NOT_FOUND,
            message: `Maximum available quantity for ${product.productName} is ${product.quantityAvailable}`,
          });
      }

      // all the valdiation are completed... jumping to next handler
      return next();
    } catch (error) {
      res.status(statusCodes.HTTP_UNPROCESSABLE_ENTITY).json({
        status: statusCodes.HTTP_UNPROCESSABLE_ENTITY,
        message: messages[422],
        error: error.message,
      });
    }
  };

  // get order list validation
  static orderList = async (req, res, next) => {
    try {
      const reqBody = req.body;

      //id user id passed check user is exist
      if (reqBody?.userId) {
        // check the user is exist
        const user = await userSchema.findById(reqBody?.userId);
        if (!user)
          return res.status(statusCodes.HTTP_NOT_FOUND).json({
            status: statusCodes.HTTP_NOT_FOUND,
            message: messages.userNotExist,
          });
      }

      // all the valdiation are completed... jumping to next handler
      return next();
    } catch (error) {
      res.status(statusCodes.HTTP_UNPROCESSABLE_ENTITY).json({
        status: statusCodes.HTTP_UNPROCESSABLE_ENTITY,
        message: messages[422],
        error: error.message,
      });
    }
  };
}

module.exports = orderValidator;
