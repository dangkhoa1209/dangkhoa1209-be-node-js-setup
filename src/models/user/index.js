import { model, Schema } from "mongoose";
import AppModel from "../../plugins/app-model/index.js";
import bcrypt from "bcrypt";

const EUserStatus = {
  ACTIVE: 1,
};

export const SUser = AppModel({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    index: true,
  },
  password: {
    type: Schema.Types.String,
    select: false,
    required: true,
  },
  status: {
    type: Schema.Types.Number,
    enum: Object.values(EUserStatus),
    default: EUserStatus.ACTIVE,
  },
});

SUser.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

SUser.method("validatePassword", function (password) {
  if (!password) return false;
  return bcrypt.compare(password, this.password);
});

SUser.method("setPassword", async function (password) {
  this.password = await bcrypt.hash(password, 10);
  return true;
});

SUser.method("generatePassword", async function () {
  const crypto = require("crypto");
  const o = 16;
  const n =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$&*";
  const p = Array.from(crypto.getRandomValues(new Uint32Array(o)))
    .map((t) => n[t % n.length])
    .join("");
  this.password = await p;
  return p;
});

export const User = model("User", SUser, "k-users");
