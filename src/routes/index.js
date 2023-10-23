const initializeRoutes = (app) => {
  app.use("/user", require("./userRoutes"));
  app.use("/order", require("./orderRoutes"));
  app.use("/products", require("./productsRoutes"));
};

module.exports = initializeRoutes;
