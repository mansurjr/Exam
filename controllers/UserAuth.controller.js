const User = require("../models/user");
const { errorResponse } = require("../utils/error_response");
const { User: UserJWT, Admin } = require("../service/jwt.service");
const Role = require("../models/role");
const updatePassword = require("../validation/updatePassword");
const bcrypt = require("bcrypt");

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

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
      role: user.roles.map((r) => r.name),
    };

    const isAdmin = user.roles.some((r) => r.name === "admin");
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
    error_handler(res);
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

    const decoded = UserJWT.verifyAccessToken(refresh_token);

    const user = await User.findAll(decoded.id);
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
    error_handler(res);
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
      .send({ message: "Your account has been activated successfully" });
  } catch (error) {
    error_handler(res);
  }
};

const ResendActivationLink = async (req, res) => {
  try {
    const link = User.findOne({ where: { id: req.params.id } });
    if (!link) {
      return errorResponse(res, {
        message: "Activation link not found",
        status: 404,
      });
    }
    link.activation_link = uuid.v4();
    await link.save();
    await mailService.sendMail(link.email, link.activation_link);
    res.status(200).send({ message: "Activation link sent successfully" });
  } catch (error) {
    errorResponse(res);
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
  loginAuthor,
  UserLogout,
  RefreshToken,
  ActivateUser,
  ResendActivationLink,
  ResetPassword,
};
