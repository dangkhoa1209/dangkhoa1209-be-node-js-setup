const queryWithDeleted = (query) => {
  if (query.options.withDeleted) {
    console.log("vao day");
    const currentQuery = query.getQuery();
    if (currentQuery.deleted) {
      delete currentQuery.deleted;
    }
    console.log("currentQuery", currentQuery);
    query.setQuery(currentQuery);
  }
};

export default (schema) => {
  const types = [
    "count",
    "countDocuments",
    "find",
    "findOne",
    "findOneAndDelete",
    "findOneAndRemove",
    "findOneAndUpdate",
    "updateMany",
  ];
  types.forEach((type) => {
    schema.pre(type, function () {
      queryWithDeleted(this);
    });
  });
};
