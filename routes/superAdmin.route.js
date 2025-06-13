const { createSuperAdmin } = require("../controllers/CreatesuperAdmin.controller");
const router = require("express").Router();

router.post("/super", createSuperAdmin);

module.exports = router;