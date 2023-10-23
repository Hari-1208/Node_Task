const express = require("express");
const userRoutes = express.Router();

//getting controllers
const { userController } = require("../controller");

//getting validators
const { userValidator } = require("../validator");

//user routes ----------------------------

// send sample msg when entered
userRoutes.get("/", userController.initialPage);

//post method for add a new user
userRoutes.post(
  "/api/createUser",
  userValidator.addNewUser,
  userController.addNewUser
);

//get user by id
userRoutes.get(
  "/api/getUserById",
  userValidator.getUserById,
  userController.getUserById
);

module.exports = userRoutes;
