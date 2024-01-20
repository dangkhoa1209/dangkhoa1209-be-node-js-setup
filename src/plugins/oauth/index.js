import { User } from "../../models/index";
import OAuthClient from "./models/client";
import { OAuthToken } from "./models/token";
import { OAuthRefreshToken } from "./models/refresh-token";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

export default {
  getAccessToken: async (accessToken) => {
    const jwtSecretKey = process.env.APP_KEY;
    const verified = jwt.verify(accessToken, jwtSecretKey);
    if (verified) {
      const { tokenId } = verified;
      const token = await OAuthToken.findOne({ accessToken: tokenId })
        .populate("user")
        .populate("client");
      if (!token) {
        return null;
      }
      return token.toObject();
    }
    return null;
  },

  getRefreshToken: async (refreshToken) => {
    const jwtSecretKey = process.env.APP_KEY;
    const verified = jwt.verify(refreshToken, jwtSecretKey);
    if (verified) {
      const { tokenId } = verified;
      const token = await OAuthRefreshToken.findOne({ refreshToken: tokenId })
        .populate("user")
        .populate("client");
      if (!token) {
        return null;
      }
      return token.toObject();
    }
    return null;
  },

  getClient: async (clientId, clientSecret) => {
    const params = {
      _id: clientId,
      secret: clientSecret,
    };
    if (clientSecret) {
      params.secret = clientSecret;
    }
    return await OAuthClient.findOne(params);
  },

  getUser: async (username, password) => {
    const user = await User.findOne({ email: username }).select("+password");

    if (!user || !(await user.validatePassword(password))) {
      throw new Error("Email hoặc mật khẩu không khớp vui lòng kiểm tra lại!");
    }

    return user;
  },

  generateAccessToken: async (client, user, scope) => {
    const tokenId = await bcrypt.hash(crypto.randomUUID(), 10);
    const jwtSecretKey = process.env.APP_KEY;
    const data = {
      time: Date(),
      userId: user.id,
      tokenId,
    };

    return {
      tokenId,
      code: jwt.sign(data, jwtSecretKey),
    };
  },

  generateRefreshToken: async (client, user, scope) => {
    const tokenId = crypto.createHash("sha1").digest("hex");
    const jwtSecretKey = process.env.APP_KEY;
    const data = {
      time: Date(),
      userId: user.id,
      tokenId,
    };

    return {
      tokenId,
      code: jwt.sign(data, jwtSecretKey),
    };
  },

  saveToken: async (token, client, user) => {
    const accessToken = await OAuthToken.create({
      user: user._id || null,
      client: client._id,
      accessToken: token.accessToken.tokenId,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      scope: token.scope,
    });
    await OAuthRefreshToken.create({
      accessToken: accessToken._id,
      refreshToken: token.refreshToken.tokenId,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      scope: token.scope,
    });

    // Trả về một đối tượng chứa thông tin về token
    // {
    //   access_token: '',    // Chuỗi đại diện cho token truy cập
    //   token_type: '',      // Loại token (ví dụ: Bearer)
    //   expires_in: 0,       // Thời gian số giây còn lại trước khi token hết hạn
    //   refresh_token: ''    // Chuỗi đại diện cho token refresh (nếu có)
    // }

    return {
      user: user._id || null,
      client: client._id,
      accessToken: token.accessToken.code,
      refreshToken: token.refreshToken.code,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
    };
  },

  revokeToken: async (refreshToken) => {
    const jwtSecretKey = process.env.APP_KEY;
    const verified = jwt.verify(refreshToken, jwtSecretKey);
    if (verified) {
      const { tokenId } = verified;
      return OAuthToken.findOne({ refreshToken: tokenId }).deleteOne();
    }
    return false;
  },
};
