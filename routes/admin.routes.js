const createAdmin = require("../controllers/createadmin.controller");
const createSuperAdmin = require("../controllers/CreatesuperAdmin.controller");
const router = require("express").Router();

router.post("/",createAdmin);
router.post("/super", createSuperAdmin);

module.exports = router;
