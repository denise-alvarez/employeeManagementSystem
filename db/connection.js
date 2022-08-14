const mysql = require("mysql2");
const util = require("util");

const db = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  database: "employees",
});

db.query = util.promisify(db.query);

module.exports = db
