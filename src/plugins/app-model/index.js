import { Schema, Types } from "mongoose";
import softDelete from "./middleware/soft-delete.js";
import queryMiddleware from "./middleware/query.js";

export default (definition, options, useShortId) => {
  const schema = new Schema(definition, {
    ...{
      // allowDiskUse: true,
      timestamps: true,
    },
    ...options,
  });

  if (useShortId) {
    schema.add({
      _sid: {
        type: String,
      },
    });
    schema.pre("save", async function () {
      if (this.isNew) {
        this._id = new Types.ObjectId();
        this._sid = ObjectIdToShortId(this._id);
      } else if (this._sid === undefined || this._sid === null) {
        this._sid = ObjectIdToShortId(this._id);
      }
    });
  }

  schema.add({
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "CompanyUser",
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "CompanyUser",
      index: true,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "CompanyUser",
      index: true,
    },
  });

  softDelete(schema);
  // queryMiddleware(schema);
  // documentMiddleware(schema);
  return schema;
};
