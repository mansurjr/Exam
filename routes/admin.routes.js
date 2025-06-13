const {
  createSuperAdmin,
} = require("../controllers/CreatesuperAdmin.controller");

const router = require("express").Router();

router.post("/", createSuperAdmin);

module.exports = router;
