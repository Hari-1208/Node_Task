const Joi = require("joi");

//getting the models
const models = require("../dataBase/models");

//getting statuscode and messages
const { statusCodes, messages } = require("../configs");
const { userTypes } = require("../constants");

//Getting schema collection
const productsSchema = models.products;
const userSchema = models.user;

class productsValidator {
  // create product validation
  static addNewProduct = async (req, res, next) => {
    try {
      // initailize schema with joi
      const schema = Joi.object().keys({
        productName: Joi.string().required().min(3),
        productCode: Joi.string().required(),
        quantityAvailable: Joi.number().required(),
        mrp: Joi.number().required(),
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
      //check user type is valid to create product
      if (user.userType == userTypes.customer)
        return res.status(statusCodes.HTTP_BAD_REQUEST).json({
          status: statusCodes.HTTP_BAD_REQUEST,
          message: messages.customerNotAllowdedToCreateProduct,
        });

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

  //update product validation
  static updateProduct = async (req, res, next) => {
    try {
      // initailize schema with joi
      const schema = Joi.object().keys({
        id: Joi.string().required(),
        userId: Joi.string().required(),
      });

      //validate the schema with joi
      const { error } = schema.validate({
        id: req.query.id,
        userId: req.query.userId,
      });
      //if error occured return error
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        return res
          .status(statusCodes.HTTP_BAD_REQUEST)
          .json({ status: statusCodes.HTTP_BAD_REQUEST, error: message });
      }

      //finding user data in db using id
      const product = await productsSchema.findById(req.query.id);
      if (!product)
        return res.status(statusCodes.HTTP_NOT_FOUND).json({
          status: statusCodes.HTTP_NOT_FOUND,
          message: messages.productNotFound,
        });

      // check the user is exist
      const user = await userSchema.findById(req.query.userId);
      if (!user)
        return res.status(statusCodes.HTTP_NOT_FOUND).json({
          status: statusCodes.HTTP_NOT_FOUND,
          message: messages.userNotExist,
        });
      //check user type is valid to create product
      if (user.userType == userTypes.customer)
        return res.status(statusCodes.HTTP_BAD_REQUEST).json({
          status: statusCodes.HTTP_BAD_REQUEST,
          message: messages.customerNotAllowdedToUpdateProduct,
        });

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

  //delete product validation
  static deleteProduct = async (req, res, next) => {
    try {
      // initailize schema with joi
      const schema = Joi.object().keys({
        id: Joi.string().required(),
        userId: Joi.string().required(),
      });

      //validate the schema with joi
      const { error } = schema.validate({
        id: req.query.id,
        userId: req.query.userId,
      });
      //if error occured return error
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        return res
          .status(statusCodes.HTTP_BAD_REQUEST)
          .json({ status: statusCodes.HTTP_BAD_REQUEST, error: message });
      }

      //finding user data in db using id
      const product = await productsSchema.findById(req.query.id);
      if (!product)
        return res.status(statusCodes.HTTP_NOT_FOUND).json({
          status: statusCodes.HTTP_NOT_FOUND,
          message: messages.productNotFound,
        });

      // check the user is exist
      const user = await userSchema.findById(req.query.userId);
      if (!user)
        return res.status(statusCodes.HTTP_NOT_FOUND).json({
          status: statusCodes.HTTP_NOT_FOUND,
          message: messages.userNotExist,
        });
      //check user type is valid to create product
      if (user.userType == userTypes.customer)
        return res.status(statusCodes.HTTP_BAD_REQUEST).json({
          status: statusCodes.HTTP_BAD_REQUEST,
          message: messages.customerNotAllowdedToUpdateProduct,
        });

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

module.exports = productsValidator;
