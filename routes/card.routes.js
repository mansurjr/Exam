const {
  getAllCards,
  createCard,
  getCardById,
  updateCardById,
  deleteCardById,
} = require("../controllers/card.controller");

const router = require("express").Router();
const roleChecker = require("../middlewares/guards/isPermittedRole.guard");
const selfGuard = require("../middlewares/guards/self_check.guard");
const tokenGuard = require("../middlewares/guards/token.guard");

router.get("/", tokenGuard, roleChecker("admin"), getAllCards);
router.post("/", tokenGuard, createCard);
router.get("/:id", tokenGuard, selfGuard, getCardById);
router.patch("/:id", tokenGuard, selfGuard, updateCardById);
router.delete("/:id", tokenGuard, selfGuard, deleteCardById);

module.exports = router;
