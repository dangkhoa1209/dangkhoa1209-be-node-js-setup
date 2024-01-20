import { Schema, Document, Model, model } from "mongoose";

export const OAuthToken = model(
  "OAuthToken",
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      client: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "OAuthClient",
      },
      accessToken: { type: String },
      accessTokenExpiresAt: { type: Date },
      scope: { type: String },
    },
    {
      timestamps: true,
    }
  ),
  "k_oauth_access_tokens"
);
