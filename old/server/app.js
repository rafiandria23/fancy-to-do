"use strict";

if (process.env.NODE_ENV == "development") {
  require("dotenv").config();
}

const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const {
  indexRouter
} = require("./routes/index-router");
const errorHandler = require("./middlewares/error-handler");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/api", indexRouter);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});