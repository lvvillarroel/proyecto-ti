const express = require("express");
const { json } = require("express");
const morgan = require("morgan");

//importing routes
const productRoutes = require("./routes/products");
const ordenmRoutes = require("./routes/orden_compras_municipalidad");
// import taskRoutes from "./routes/tasks";
const logicRoutes = require("./routes/logic");

const app = express();

//middlewares
app.use(morgan("dev")); //muestra en consola lo que va llegando
app.use(json()); //permite entender los json que van llegando
app.set(`port`, process.env.PORT || 80);
app.set(`host`, '0.0.0.0');

//routes
//app.use("/orden", ordenmRoutes);
// app.use("/api/tasks", taskRoutes);

//routes
app.use("/", productRoutes);
app.use("/test", logicRoutes);
app.use("/orders", ordenmRoutes);

module.exports = app;
