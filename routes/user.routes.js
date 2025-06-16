const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
} = require("../controllers/user.controller");
const {
  ActivateUser,
  ResendActivationLink,
  RefreshToken,
  UserLogout,
  login,
  ResetPassword,
} = require("../controllers/UserAuth.controller");
const roleChecker = require("../middlewares/guards/isPermittedRole.guard");
const selfGuard = require("../middlewares/guards/self_check.guard");
const tokenGuard = require("../middlewares/guards/token.guard");

const router = require("express").Router();

router.get("/", tokenGuard, roleChecker(), getAllUsers());
router.get("/driver", tokenGuard, roleChecker("admin"), getAllUsers("driver"));
router.get("/client", tokenGuard, roleChecker("admin"), getAllUsers("client"));
router.get("/admin", tokenGuard, roleChecker(), getAllUsers("admin"));
router.post("/register", createUser);
router.post("/reset/:id", tokenGuard, selfGuard, ResetPassword);
router.post("/login", login);
router.get("/logout", tokenGuard, UserLogout);
router.get("/refresh", tokenGuard, RefreshToken);
router.get("/activate/:id", ActivateUser);
router.get("/resend/:id", ResendActivationLink);
router.get("/:id", tokenGuard, selfGuard, getUserById);
router.patch("/:id", tokenGuard, selfGuard, updateUserById);
router.delete("/:id", tokenGuard, selfGuard, deleteUserById);

module.exports = router;
