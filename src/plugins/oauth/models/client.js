import { Schema, model } from "mongoose";

const OAuthClientSchema = new Schema(
  {
    secret: { type: String },
    redirectUris: { type: [String] }, // Use an array type for redirectUris
    grants: { type: [String] }, // Use an array type for grants
  },
  {
    timestamps: true,
  }
);

const OAuthClient = model("OAuthClient", OAuthClientSchema, "k_oauth_clients");

// const newClient = OAuthClient({
//   secret: "4af9d635-6718-4ca3-94ad-bc997e435580",
//   grants: ["password"],
// });

// newClient.save();

export default OAuthClient;
