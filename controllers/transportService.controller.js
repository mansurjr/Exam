const error_response = require("../utils/error_response");
const TransportService = require("../models/transport_service");
const Routes = require("../models/route.model");
const { v4: uuidv4 } = require("uuid");

const {
  createTransportServiceSchema,
  updateTransportSchema,
} = require("../validation/transport.validation");

const getAllTransportServices = async (_, res) => {
  try {
    const services = await TransportService.findAll({
      include: [
        {
          model: Routes,
          attributes: ["id", "origin", "destination", "distance", "duration"],
        },
      ],
    });

    if (!services.length) {
      return error_response(res, {
        message: "No transport services found",
        status: 404,
      });
    }

    res.status(200).send({ data: services });
  } catch (error) {
    error_response(res, error);
  }
};

const getTransportServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await TransportService.findByPk(id, {
      include: [
        {
          model: Routes,
          attributes: ["id", "origin", "destination", "distance", "duration"],
        },
      ],
    });

    if (!service) {
      return error_response(res, {
        message: "Transport service not found",
        status: 404,
      });
    }

    res.status(200).send({ data: service });
  } catch (error) {
    error_response(res, error);
  }
};

const createTransportService = async (req, res) => {
  try {
    const { error, value } = createTransportServiceSchema(req.body);
    if (error) {
      return error_response(res, { message: error.details[0].message });
    }
    value.reg_number = uuidv4();
    const newService = await TransportService.create(value);
    res
      .status(201)
      .send({ message: "Transport service created", data: newService });
  } catch (error) {
    error_response(res, error);
  }
};

const updateTransportServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await TransportService.findByPk(id);
    if (!service) {
      return error_response(res, {
        message: "Transport service not found",
        status: 404,
      });
    }

    const { error, value } = updateTransportSchema(req.body);
    if (error) {
      return error_response(res, { message: error.details[0].message });
    }

    const [count, updated] = await TransportService.update(value, {
      where: { id },
      returning: true,
    });

    if (!count) {
      return res.status(404).send({ message: "Transport service not found" });
    }

    res
      .status(200)
      .send({ message: "Transport service updated", data: updated[0] });
  } catch (error) {
    error_response(res, error);
  }
};

const deleteTransportServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TransportService.destroy({ where: { id } });
    if (!deleted) {
      return error_response(res, { message: "Transport service not found" });
    }

    res.status(200).send({ message: "Transport service deleted" });
  } catch (error) {
    error_response(res, error);
  }
};

module.exports = {
  getAllTransportServices,
  getTransportServiceById,
  createTransportService,
  updateTransportServiceById,
  deleteTransportServiceById,
};
