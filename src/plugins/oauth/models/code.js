import { Schema, Model, model } from "mongoose";

export const OAuthCode = model(
  "OAuthCode",
  new Schema()(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      client: {
        type: Schema.Types.ObjectId,
        ref: "OAuthClient",
      },
      authorizationCode: { type: String },
      expiresAt: { type: Date },
      scope: { type: String },
    },
    {
      timestamps: true,
    }
  ),
  "k_oauth_auth_codes"
);
