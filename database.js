require("dotenv").config();
const msql = require("mysql2/promise");

const database = msql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

database
.getConnection()
.then(connection => {
    console.log("Connected to database");
    connection.release();
}).catch(err => {
    console.error(err);
});


module.exports = database;