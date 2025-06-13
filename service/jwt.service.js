const jwt = require("jsonwebtoken");
const config = require("config");

class JWT {
  constructor({ access_key, refresh_key, refresh_time, access_time }) {
    this.access_key = access_key;
    this.refresh_key = refresh_key;
    this.access_time = access_time;
    this.refresh_time = refresh_time;
  }

  generateTokens(payload) {
    const access_token = jwt.sign(payload, this.access_key, {
      expiresIn: this.access_time,
    });
    const refresh_token = jwt.sign(payload, this.refresh_key, {
      expiresIn: this.refresh_time,
    });
      return {
      access_token,
      refresh_token,
    };
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refresh_key, {
      expiresIn: this.refresh_time,
    });
  }

  verifyAccessToken(token) {
    return jwt.verify(token, this.access_key);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, this.refresh_key);
  }
}

const Admin = new JWT(config.get("admin"));
const User = new JWT(config.get("user"));

module.exports = { Admin, User };