const error_response = require("../utils/error_response");
const Report = require("../models/report");
const TransportService = require("../models/transportService");
const User = require("../models/user");

const getAllReports = async (_, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: TransportService,
          attributes: ["vehicle_type", "reg_number", "status"],
        },
        {
          model: User,
          attributes: ["first_name", "last_name", "email"],
        },
      ],
    });

    if (!reports.length) {
      return error_response(res, {
        message: "No reports found",
        status: 404,
      });
    }

    res.status(200).send({ data: reports });
  } catch (error) {
    error_response(res, error);
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id, {
      include: [
        {
          model: TransportService,
          attributes: ["vehicle_type", "reg_number", "status"],
        },
        {
          model: User,
          attributes: ["first_name", "last_name", "email"],
        },
      ],
    });

    if (!report) {
      return error_response(res, {
        message: "Report not found",
        status: 404,
      });
    }

    res.status(200).send({ data: report });
  } catch (error) {
    error_response(res, error);
  }
};

const createReport = async (req, res) => {
  try {
    const newReport = await Report.create(req.body);
    res.status(201).send({ message: "Report created", data: newReport });
  } catch (error) {
    error_response(res, error);
  }
};

const updateReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);
    if (!report) {
      return error_response(res, {
        message: "Report not found",
        status: 404,
      });
    }

    const [count, updated] = await Report.update(req.body, {
      where: { id },
      returning: true,
    });

    if (!count) {
      return error_response(res, {
        message: "Failed to update report",
      });
    }

    res.status(200).send({ message: "Report updated", data: updated[0] });
  } catch (error) {
    error_response(res, error);
  }
};

const deleteReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Report.destroy({ where: { id } });
    if (!deleted) {
      return error_response(res, {
        message: "Report not found",
        status: 404,
      });
    }

    res.status(200).send({ message: "Report deleted successfully" });
  } catch (error) {
    error_response(res, error);
  }
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateReportById,
  deleteReportById,
};