const express = require("express");
const router = express.Router();

const {
  getAllReports,
  getReportById,
  createReport,
  updateReportById,
  deleteReportById,
} = require("../controllers/report.controller");

router.get("/", getAllReports);
router.get("/:id", getReportById);
router.post("/", createReport);
router.put("/:id", updateReportById);
router.delete("/:id", deleteReportById);

module.exports = router;
