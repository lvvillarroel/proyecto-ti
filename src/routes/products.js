const exp = require("express");
const router = exp.Router(); //es lo que se importara, y utilizara

const { createProduct, getProducts, deleteProduct, obtener_almacenes } = require("../controllers/product.controller");
const { getG } = require("../controllers/product.controller");
const { receiveNotification } = require("../controllers/product.controller");
const { receiveOc } = require("../controllers/product.controller");

// /stock
router.post("/db", createProduct);
router.get("/db", getProducts);
// router.delete("/:sku", deleteProduct);


// Obtiene nuestro stock actual
// ruta 0.0.0.0/stock y 0.0.0.0/api llegan aqui
router.get("/stock", getG);
// ruta 0.0.0.0/stock/products lista todos los poductos
router.get("/products", getProducts);
// ruta 0.0.0.0/stock/cprod creacion de productos en la bdd
router.post("/cprod", createProduct);

// Recepcion de Oc
router.post("/api/oc", receiveOc);
// Recepcion de solicitud de la Oc
router.post("/api/oc/:id_oc/notificacion", receiveNotification);

module.exports = router;
