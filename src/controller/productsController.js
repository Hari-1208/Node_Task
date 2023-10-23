//getting the models
const models = require("../dataBase/models");
//getting statuscode and messages
const { statusCodes, messages } = require("../configs");

//Getting schema collection
const productsSchema = models.products;

class productsController {
  // create new product
  static addNewProduct = async (req, res) => {
    const newProduct = new productsSchema({
      productName: req.body.productName,
      productCode: req.body.productCode,
      quantityAvailable: req.body.quantityAvailable,
      mrp: req.body.mrp,
    });

    try {
      //creating new product
      const addedProduct = await newProduct.save();
      return res.status(statusCodes.HTTP_OK).send({
        status: statusCodes.HTTP_OK,
        message: messages.productCreatedSuccesfully,
        data: addedProduct,
      });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
        data: err.message,
      });
    }
  };

  // update a product
  static updateProduct = async (req, res) => {
    try {
      //finding product by id and update it
      productsSchema
        .findByIdAndUpdate(req.query.id, req.body)
        .then((response) => {
          res.status(statusCodes.HTTP_OK).send({
            status: statusCodes.HTTP_OK,
            message: messages.productupdatedSuccess,
          });
        })
        .catch((err) => {
          if (err) {
            res.status(statusCodes.HTTP_BAD_REQUEST).send({
              message: "update error",
              data: err,
            });
          }
        });
    } catch (err) {
      res.status(statusCodes.HTTP_BAD_REQUEST).send({
        status: statusCodes.HTTP_BAD_REQUEST,
        message: messages[400],
        data: err.message,
      });
    }
  };

  //delete a product
  static deleteProduct = async (req, res) => {
    try {
      //finding product by id and delete it
      productsSchema
        .findByIdAndDelete(req.query.id)
        .then((response) => {
          res.status(statusCodes.HTTP_OK).send({
            status: statusCodes.HTTP_OK,
            message: messages.productDeletedSuccess,
          });
        })
        .catch((err) => {
          if (err) {
            res.status(statusCodes.HTTP_BAD_REQUEST).send({
              message: "delete error",
              data: err,
            });
          }
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

module.exports = productsController;
