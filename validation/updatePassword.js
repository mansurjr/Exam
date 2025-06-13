const Joi = require("joi");

module.exports = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(55).required(),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": `"Confirm password" must match "New password"`,
  }),
});
