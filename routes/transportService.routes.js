const {
  getAllTransportServices,
  createTransportService,
  deleteTransportServiceById,
  updateTransportServiceById,
  getTransportServiceById,
} = require("../controllers/transportService.controller");
const router = require("express").Router();
const roleChecker = require("../middlewares/guards/isPermittedRole.guard");
const tokenGuard = require("../middlewares/guards/token.guard");

router.get(
  "/",
  tokenGuard,
  roleChecker("admin", "client"),
  getAllTransportServices
);
router.post(
  "/",
  tokenGuard,
  roleChecker(["admin"]),
  createTransportService
);
router.get("/:id", tokenGuard, getTransportServiceById);
router.put("/:id", tokenGuard, updateTransportServiceById);
router.delete(
  "/:id",
  tokenGuard,
  roleChecker("admin"),
  deleteTransportServiceById
);

module.exports = router;