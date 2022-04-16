class CustomError extends Error {
  constructor(message, name = "CustomError", code = "1") {
    super(message);
    this.name = name;
    this.code = code;
  }
}

module.exports = CustomError;
