const error_response = require("../utils/error_response");
const Routes = require("../models/route.model");
const TransportService = require("../models/transportService");

const getAllRoutes = async (_, res) => {
  try {
    const routes = await Routes.findAll({
      include: [
        {
          model: TransportService,
          attributes: ["vehicle_type", "price", "available_seats", "status"],
        },
      ],
    });

    if (!routes.length) {
      return error_response(res, {
        message: "Routes not found",
        status: 404,
      });
    }

    res.status(200).send({ data: routes });
  } catch (error) {
    error_response(res, error);
  }
};

const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Routes.findByPk(id, {
      include: [
        {
          model: TransportService,
          attributes: ["vehicle_type", "price", "available_seats", "status"],
        },
      ],
    });

    if (!route) {
      return error_response(res, { message: "Route not found", status: 404 });
    }

    res.status(200).send({ data: route });
  } catch (error) {
    error_response(res, error);
  }
};

const createRoute = async (req, res) => {
  try {
    const newRoute = await Routes.create(req.body);
    res.status(201).send({ message: "Route created", data: newRoute });
  } catch (error) {
    error_response(res, error);
  }
};

const updateRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Routes.findByPk(id);
    if (!route) {
      return error_response(res, { message: "Route not found", status: 404 });
    }

    const [count, updated] = await Routes.update(req.body, {
      where: { id },
      returning: true,
    });

    if (!count) {
      return error_response(res, { message: "Failed to update route" });
    }

    res.status(200).send({ message: "Route updated", data: updated[0] });
  } catch (error) {
    error_response(res, error);
  }
};

const deleteRouteById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Routes.destroy({ where: { id } });
    if (!deleted) {
      return error_response(res, { message: "Route not found", status: 404 });
    }

    res.status(200).send({ message: "Route deleted successfully" });
  } catch (error) {
    error_response(res, error);
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRouteById,
  deleteRouteById,
};
