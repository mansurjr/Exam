const error_response = require("../utils/error_response");
const Card = require("../models/card");
const {
  createCardSchema,
  updateCardSchema,
} = require("../validation/card.validation");
const User = require("../models/user");

const getAllCards = async (_, res) => {
  try {
    const cards = await Card.findAll();

    if (!cards.length) {
      return error_response.errorResponse(res, {
        message: "No cards found",
        status: 404,
        error: "No cards found",
      });
    }
    res.status(200).send({ data: cards });
  } catch (error) {
    error_response.errorResponse(res, { error });
  }
};

const getCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findByPk(id);
    if (!card) {
      return error_response.errorResponse(res, {
        message: "Card not found",
        status: 404,
      });
    }

    res.status(200).send({ data: card });
  } catch (error) {
    error_response.errorResponse(res, { error });
  }
};

const createCard = async (req, res) => {
  try {
    const { error, value } = createCardSchema.validate(req.body);
    if (error) {
      return error_response.errorResponse(res, {
        message: error.details[0].message,
        status: 400,
        error: error,
      });
    }
    const user = await User.findByPk(value.userId);
    if (!user) {
      return error_response.errorResponse(res, {
        message: "User not found",
        status: 404,
        error: "User not found",
      });
    }
    const newCard = await Card.create(value);
    res.status(201).send({ message: "Card created", data: newCard });
  } catch (error) {
    error_response.errorResponse(res, { error });
  }
};

const updateCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findByPk(id);
    if (!card) {
      return error_response.errorResponse(res, {
        message: "Card not found",
        status: 404,
      });
    }
    const { error, value } = await updateCardSchema(req.body);
    if (error) {
      return error_response.errorResponse(res, {
        message: error.details[0].message,
        status: 400,
        error,
      });
    }
    if (value?.userId) {
      const user = await User.findByPk(value.userId);
      if (!user) {
        return error_response.errorResponse(res, {
          message: "User not found",
          status: 404,
          error: "User not found",
        });
      }
    }

    const [count, updated] = await Card.update(value, {
      where: { id },
      returning: true,
    });

    if (!count) {
      return error_response.errorResponse(res, {
        message: "Failed to update card",
      });
    }

    res.status(200).send({ message: "Card updated", data: updated[0] });
  } catch (error) {
    error_response.errorResponse(res, error);
  }
};

const deleteCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Card.destroy({ where: { id } });
    if (!deleted) {
      return error_response.errorResponse(res, {
        message: "Card not found",
        status: 404,
      });
    }

    res.status(200).send({ message: "Card deleted successfully" });
  } catch (error) {
    error_response.errorResponse(res, error);
  }
};

module.exports = {
  getAllCards,
  getCardById,
  createCard,
  updateCardById,
  deleteCardById,
};
