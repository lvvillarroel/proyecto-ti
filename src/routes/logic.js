const exp = require("express");
const router = exp.Router(); //es lo que se importará, y utilizará

const { scheduleFTP } = require("../controllers/logic.controller");

router.get("/", scheduleFTP);

module.exports = router;
