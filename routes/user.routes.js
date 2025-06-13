const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
} = require("../controllers/user.controller");
const {
  loginAuthor,
  ActivateUser,
  ResendActivationLink,
  RefreshToken,
  UserLogout,
} = require("../controllers/UserAuth.controller");
const self_checkGuard = require("../middlewares/guards/self_check.guard");
const tokenGuard = require("../middlewares/guards/token.guard");

const router = require("express").Router();

router.get("/", tokenGuard, getAllUsers);
router.get("/driver", tokenGuard, getAllUsers("driver"));
router.get("/users", tokenGuard, getAllUsers("customer"));
router.post("/register", createUser);
router.post("/login", loginAuthor);
router.get("/logout", UserLogout);
router.get("/refresh", tokenGuard, RefreshToken);
router.get("/activate/:id", ActivateUser);
router.get("/resend/:id", ResendActivationLink);
router.get("/:id", tokenGuard, getUserById);
router.patch("/:id", tokenGuard, self_checkGuard, updateUserById);
router.delete("/:id", tokenGuard, self_checkGuard, deleteUserById);

module.exports = router;
