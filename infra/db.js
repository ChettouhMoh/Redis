const mysql = require("mysql2");

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "admin",
  database: "myapp",
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL!");
    connection.release(); // Release the connection back to the pool
  }
});
