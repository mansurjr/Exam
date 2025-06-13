const { getAllRoles, createRole, getRoleById } = require('../controllers/role.controller');

const router = require('express').Router();

router.get("/", getAllRoles);
router.post("/", createRole);
router.get("/:id", getRoleById);
router.put("/:id", getRoleById);
router.delete("/:id", getRoleById);

module.exports = router;