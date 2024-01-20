import { Schema, Document, Model, model } from "mongoose";

export const OAuthRefreshToken = model(
  "OAuthRefreshToken",
  new Schema(
    {
      accessToken: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "OAuthToken",
      },
      refreshToken: { type: String },
      refreshTokenExpiresAt: { type: Date },
    },
    {
      timestamps: true,
    }
  ),
  "k_oauth_refresh_tokens"
);
