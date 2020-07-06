const exp = require("express");
const router = exp.Router(); //es lo que se importara, y utilizara

const { getG, getOrdersm } = require("../controllers/ordenmunicipalidad.controller");

// /orden
router.get("/", getG);
router.get("/show", getOrdersm);

module.exports =  router;
