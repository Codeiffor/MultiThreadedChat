require = require("esm")(module);
const dotenv = require("dotenv");
dotenv.config();
module.exports = require("./server/app");
