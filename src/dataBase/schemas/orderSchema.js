const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema(
  {
    products: {
      type: [
        {
          productName: {
            type: String,
            trim: true,
            required: true,
            unique: false,
          },
          productCode: {
            type: String,
            trim: true,
            required: true,
            unique: false,
          },
          quantity: {
            type: Number,
            trim: true,
            required: true,
            unique: false,
          },
          mrp: {
            type: Number,
            trim: true,
            unique: false,
          },
        },
      ],
      required: true,
      unique: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: false,
    },
    orderStatus: {
      type: String,
      unique: false,
    },

    //order datas
    orderDetails: {
      orderTotal: {
        required: true,
        unique: false,
        type: Number,
      },
      productsPrice: {
        required: true,
        type: Number,
        unique: false,
      },
    },
  },
  { timestamps: true }
);
