class AppError extends Error {
  name = "";

  messages = "";

  httpCode = 422;

  constructor(messages, httpCode = 422) {
    super(JSON.stringify(messages));
    this.messages = messages;
    this.httpCode = httpCode;
  }
}

export default AppError;
