const error_response = require("../utils/error_response");
const TransportService = require("../models/transportService");
const Routes = require("../models/route.model");
const { v4: uuidv4 } = require("uuid");

const {
  createTransportServiceSchema,
  updateTransportServiceSchema,
} = require("../validation/transport.validation");
const User = require("../models/user");

const getAllTransportServices = async (_, res) => {
  try {
    const services = await TransportService.findAll();

    if (!services.length) {
      return error_response.errorResponse(res, {
        message: "No transport services found",
        status: 404,
        error: "No transport services found",
      });
    }

    res.status(200).send({ data: services });
  } catch (error) {
    error_response.errorResponse(res, { error });
  }
};

const getTransportServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await TransportService.findByPk(id);

    if (!service) {
      return error_response.errorResponse(res, {
        message: "Transport service not found",
        status: 404,
        error: "Transport service not found",
      });
    }

    res.status(200).send({ data: service });
  } catch (error) {
    error_response.errorResponse(res, { error });
  }
};

const createTransportService = async (req, res) => {
  try {
    const { error, value } = createTransportServiceSchema.validate(req.body);
    if (error) {
      return error_response.errorResponse(res, {
        message: error.details[0].message,
      });
    }
    const driver = await User.findOne({
      where: { id: value.userId, role: "driver" },
    });
    if (!driver) {
      return error_response.errorResponse(res, {
        message: "Driver not found",
        status: 404,
        error: "Driver not found",
      });
    }
    value.reg_number = uuidv4();
    const newService = await TransportService.create(value);
    res
      .status(201)
      .send({ message: "Transport service created", data: newService });
  } catch (error) {
    error_response.errorResponse(res, { error });
  }
};

const updateTransportServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await TransportService.findByPk(id);
    if (!service) {
      return error_response.errorResponse(res, {
        message: "Transport service not found",
        status: 404,
      });
    }

    const { error, value } = updateTransportServiceSchema.validate(req.body);
    if (error) {
      return error_response.errorResponse(res, {
        message: error.details[0].message,
      });
    }
    if (value?.userId) {
      const driver = await User.findOne({
        where: { id: value.userId, role: "driver" },
      });
      if (!driver) {
        return error_response.errorResponse(res, {
          message: "Driver not found",
          status: 404,
          error: "Driver not found",
        });
      }
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
    error_response.errorResponse(res, { error });
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
