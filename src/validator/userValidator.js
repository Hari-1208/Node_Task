const Joi = require("joi");

//getting the models
const models = require("../dataBase/models");

//getting statuscode and messages
const { statusCodes, messages } = require("../configs");

//getting constants
const { userTypes } = require("../constants");

//Getting schema collection
const userSchema = models.user;

class userValidator {
  // create user validation
  static addNewUser = async (req, res, next) => {
    try {
      // initailize schema with joi
      const schema = Joi.object().keys({
        name: Joi.string().required().min(3),
        mobileNumber: Joi.number().required().min(10),
        dob: Joi.string().required(),
        emailId: Joi.string().required(),
        isAdmin: Joi.boolean().optional(),
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

      // check the user is already exist based on user type
      const user = await userSchema.find({
        mobileNumber: reqBody?.mobileNumber,
        emailId: reqBody?.emailId,
      });
      const userType = Boolean(reqBody?.isAdmin)
        ? userTypes.admin
        : userTypes.customer;
      if (
        user?.length > 0 &&
        user?.filter((x) => x.userType == userType)?.length > 0
      )
        return res.status(statusCodes.HTTP_CREATED).send({
          status: statusCodes.HTTP_CREATED,
          message: messages.userAlreadyExist,
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

  // get user by id validation
  static getUserById = async (req, res, next) => {
    try {
      //finding user data in db using id
      const user = await userSchema.findById(req.query.id);
      if (!user)
        return res.status(statusCodes.HTTP_NOT_FOUND).json({
          status: statusCodes.HTTP_NOT_FOUND,
          message: messages.userNotExist,
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

module.exports = userValidator;
