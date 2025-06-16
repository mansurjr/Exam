const {
  getAllRoutes,
  createRoute,
  getRouteById,
  updateRouteById,
  deleteRouteById,
} = require("../controllers/route.controller");

const router = require("express").Router();
const roleChecker = require("../middlewares/guards/isPermittedRole.guard");
const tokenGuard = require("../middlewares/guards/token.guard");

router.get("/", tokenGuard, getAllRoutes);
router.post("/", tokenGuard, roleChecker("admin"), createRoute);
router.get("/:id", tokenGuard, getRouteById);
router.patch("/:id", tokenGuard, roleChecker("admin"), updateRouteById);
router.delete("/:id", tokenGuard, roleChecker("admin"), deleteRouteById);

module.exports = router;
