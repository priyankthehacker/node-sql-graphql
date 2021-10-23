const express = require("express");
const app = express();
require("dotenv").config();

app.get("/", function (req, res) {
  var Connection = require("tedious").Connection;
  console.log(process.env.DB_SERVER_URL);
  var config = {
    server: process.env.DB_SERVER_URL, //update me
    authentication: {
      type: "default",
      options: {
        userName: process.env.DB_USER_NAME, //update me
        password: process.env.DB_PASSWORD //update me
      }
    },
    options: {
      // If you are on Microsoft Azure, you need encryption:
      encrypt: true,
      database: process.env.DB_NAME //update me
    }
  };
  var connection = new Connection(config);
  connection.on("connect", function (err) {
    // If no error, then good to proceed.
    console.log("Connected");
    executeStatement();
  });

  connection.connect();

  var Request = require("tedious").Request;
  var TYPES = require("tedious").TYPES;

  function executeStatement() {
    request = new Request("SELECT * FROM tUser", function (err) {
      if (err) {
        console.log(err);
      }
    });
    var result = "";
    request.on("row", function (columns) {
      columns.forEach(function (column) {
        if (column.value === null) {
          console.log("NULL");
        } else {
          result += column.value + " ";
        }
      });
      console.log(result);
      result = "";
    });

    request.on("done", function (rowCount, more) {
      console.log(rowCount + " rows returned");
    });

    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
      connection.close();
    });
    connection.execSql(request);
  }
});

app.listen(5001, function () {
  console.log("Server is running..");
});
