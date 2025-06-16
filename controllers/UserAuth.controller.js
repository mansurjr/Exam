const { errorResponse } = require("../utils/error_response");
const { User: UserJWT, Admin } = require("../service/jwt.service");
const updatePassword = require("../validation/updatePassword");
const bcrypt = require("bcrypt");
const { sendActivationEmail } = require("../service/email.service");
const User = require("../models/user");
const Card = require("../models/card");
const config = require("config");
const uuid = require("uuid");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, {
        message: "Email and password are required",
        status: 400,
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email }, include: Card });

    if (!user) {
      return errorResponse(res, {
        message: "Invalid email or password",
        status: 401,
      });
    }

    if (!user.isActive) {
      return errorResponse(res, {
        message: "Your account is not activated",
        status: 401,
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, {
        message: "Invalid email or password",
        status: 401,
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      isCreator: user.isCreator,
      role: user.role,
    };

    const isAdmin = user.role === "admin";
    const tokenProvider = isAdmin ? Admin : UserJWT;
    const { access_token, refresh_token } =
      tokenProvider.generateTokens(payload);

    user.token = refresh_token;
    await user.save();

    res.cookie("refresh_token", refresh_token, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Login successful",
      access_token,
    });
  } catch (error) {
    errorResponse(res, { error });
  }
};

const UserLogout = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return errorResponse(res, {
        message: "Refresh token not provided",
        status: 401,
      });
    }

    const user = await Author.findOne({ token: refresh_token });
    if (!user) {
      return errorResponse(res, {
        message: "Invalid refresh token",
        status: 401,
      });
    }

    user.token = null;
    await user.save();

    res.clearCookie("refresh_token");
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    error_handler(res);
  }
};

const RefreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return errorResponse(res, {
        message: "Refresh token not provided",
        status: 401,
      });
    }
    const service = req.decoded.role === "admin" ? Admin : UserJWT;
    const decoded = service.verifyRefreshToken(refresh_token);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return errorResponse(res, {
        message: "Invalid refresh token",
        status: 401,
      });
    }

    const existingTokenUser = await User.findOne({
      where: { token: refresh_token },
    });
    if (!existingTokenUser) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const { access_token, refresh_token: new_refresh_token } =
      UserJWT.generateTokens({
        id: user.id,
        email: user.email,
        isActive: user.isActive,
        isCreator: user.isCreator,
      });

    existingTokenUser.token = new_refresh_token;
    await existingTokenUser.save();

    res.cookie("refresh_token", new_refresh_token, {
      maxAge: config.get("cookieTime"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Token refreshed successfully",
      access_token: access_token,
    });
  } catch (error) {
    errorResponse(res, { error });
  }
};

const ActivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { activation_link: id } });
    user.isActive = true;
    await user.save();
    res
      .status(200)
      .json({ message: "Your account has been activated successfully" });
  } catch (error) {
    errorResponse(res, { error });
  }
};

const ResendActivationLink = async (req, res) => {
  try {
    const link = await User.findOne({ where: { id: req.params.id } });
    if (!link) {
      return errorResponse(res, {
        message: "Activation link not found",
        status: 404,
      });
    }
    if (link.isActive) {
      return errorResponse(res, {
        message: "Your account is already activated",
        status: 400,
      });
    }
    link.activation_link = uuid.v4();
    console.log(link);
    await link.save();
    await sendActivationEmail(link.email, link.activation_link);
    res.status(200).send({ message: "Activation link sent successfully" });
  } catch (error) {
    errorResponse(res, { error });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = updatePassword.validate(req.body);
    if (error) {
      return errorResponse(res, {
        message: error.details[0].message,
        status: 400,
      });
    }

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return errorResponse(res, {
        message: "User not found",
        status: 404,
      });
    }

    if (!bcrypt.compare(value.oldPassword, user.password)) {
      return errorResponse(res, {
        messege: "Old password is incorrect!",
        status: 400,
      });
    }
    user.password = value.newPassword;
    await user.save();

    res.status(200).send({ message: "Password successfully reset" });
  } catch (error) {
    errorResponse(res, {
      message: error.message,
      status: 500,
    });
  }
};

module.exports = {
  login,
  UserLogout,
  RefreshToken,
  ActivateUser,
  ResendActivationLink,
  ResetPassword,
};
