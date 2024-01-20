import generateFormatters from "./response-formatter";

export default (app) => {
  Object.defineProperty(app.request, "fields", {
    configurable: true,
    enumerable: true,
    get() {
      return this.body;
    },
  });

  Object.defineProperty(app.response, "formatter", {
    configurable: true,
    enumerable: true,
    get() {
      return generateFormatters(this);
    },
  });
};
