const {
  getAllTransportServices,
  createTransportService,
  deleteTransportServiceById,
  updateTransportServiceById,
  getTransportServiceById,
} = require("../controllers/transportService.controller");

const router = require("express").Router();

router.get("/", getAllTransportServices);
router.post("/", createTransportService);
router.get("/:id", getTransportServiceById);
router.put("/:id", updateTransportServiceById);
router.delete("/:id", deleteTransportServiceById);

module.exports = router;