const debug = require("debug")("CodeError");

class CodeError extends Error {
  constructor (message, code) {
    debug("An api error occured, error = "+ message)
    super(message)
    this.code = code
  }
}
module.exports = CodeError
