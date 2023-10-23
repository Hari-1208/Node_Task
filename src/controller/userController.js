//getting the models
const models = require("../dataBase/models");
//getting statuscode and messages
const { statusCodes, messages } = require("../configs");
const { userTypes } = require("../constants");

//Getting schema collection
const userSchema = models.user;

class userController {
  // get sample message
  static initialPage = async (req, res) => {
    res.send("Hello from Node Task Project");
  };

  // create new user
  static addNewUser = async (req, res) => {
    const newUser = new userSchema({
      name: req.body.name,
      mobileNumber: req.body.mobileNumber,
      dob: req.body.dob,
      emailId: req.body.emailId,
      userType: Boolean(req?.body?.isAdmin)
        ? userTypes.admin
        : userTypes.customer,
    });

    try {
      //creating new user
      const addedUser = await newUser.save();
      return res.status(statusCodes.HTTP_OK).send({
        status: statusCodes.HTTP_OK,
        message: messages.userCreatedSuccesfully,
        data: addedUser,
      });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
        data: err.message,
      });
    }
  };

  // get user data by id
  static getUserById = async (req, res) => {
    try {
      //finding user data in db using id
      const user = await userSchema.findById(req.query.id);
      return res.status(statusCodes.HTTP_OK).send({
        status: statusCodes.HTTP_OK,
        message: messages.dataFetchedSucces,
        data: user,
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

module.exports = userController;
