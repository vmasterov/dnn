const isObject = (value) => Object.prototype.toString.call(value).slice(8, -1) === "Object";
module.exports = isObject;
