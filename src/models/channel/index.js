import { model, Schema } from "mongoose";
import AppModel from "../../plugins/app-model/index.js";

export const SChannel = AppModel(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

SChannel.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export const Channel = model("Channel", SChannel, "k-channels");
