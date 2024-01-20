import { model, Schema } from "mongoose";
import AppModel from "../../plugins/app-model/index.js";

export const SPodCast = AppModel(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {},
  false
);

export const PodCast = model("PodCast", SPodCast, "k-pod-casts");
