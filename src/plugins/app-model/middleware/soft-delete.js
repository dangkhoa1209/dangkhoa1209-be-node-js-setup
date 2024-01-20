export default (schema) => {
  schema.add({
    deleted: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  });

  const overrideMethods = [
    "count",
    "find",
    "findByIdAndUpdate",
    "findByIdAndDelete",
    "findByIdAndRemove",
    "findOne",
    "findOneAndUpdate",
    "findOneAndDelete",
    "findOneAndRemove",
    "findOneAndReplace",
    "replaceOne",
    "update",
    "updateOne",
    "updateMany",
  ];

  const setDocumentIsDeleted = async (doc) => {
    doc.deleted = true;
    doc.deletedAt = new Date();
    doc.$isDeleted(true);
    return doc.save();
  };

  const excludeInFindQueriesIsDeleted = async function (query) {
    if (query.options.onlyDeleted) {
      query.where({ deleted: true });
      return;
    }

    if (!query.options.withDeleted) {
      query.where({ deleted: { $in: [null, false] } });
    }
  };

  const excludeInDeletedInAggregateMiddleware = async function (schema) {
    schema.pipeline().unshift({ $match: { deleted: false } });
  };

  schema.query.withDeleted = function () {
    this.options.withDeleted = true;
    return this;
  };

  schema.query.onlyDeleted = function () {
    this.options.onlyDeleted = true;
    return this;
  };

  // modify removeOne
  schema.static("removeOne", async function (filter, options, callback) {
    const update = {
      deleted: true,
      deletedAt: new Date(),
    };
    return this.updateOne(filter, update, options, callback);
  });

  // modify remove removeMany
  schema.static("removeMany", async function (filter, options, callback) {
    const update = {
      deleted: true,
      deletedAt: new Date(),
    };
    return this.updateMany(filter, update, options, callback);
  });

  // add match
  schema.pre("aggregate", async function () {
    await excludeInDeletedInAggregateMiddleware(this);
  });

  schema.post(
    "remove",
    {
      query: false,
      document: true,
    },
    async function (docs) {
      await setDocumentIsDeleted(this);
    }
  );

  // thêm phương thức delete
  schema.method("delete", async function () {
    this.deleted = true;
    this.deletedAt = new Date();
    return this.save();
  });

  overrideMethods.forEach((type) => {
    schema.pre(type, async function () {
      await excludeInFindQueriesIsDeleted(this);
    });
  });
};
