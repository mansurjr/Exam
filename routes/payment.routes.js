const express = require("express");
const router = express.Router();

const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentById,
  deletePaymentById,
} = require("../controllers/payment.controller");

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.put("/:id", updatePaymentById);
router.delete("/:id", deletePaymentById);

module.exports = router;
