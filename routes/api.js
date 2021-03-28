var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var lostItemRouter = require("./lostitem");

var app = express();

//app.use("/auth/", authRouter);
//app.use("/book/", bookRouter);

app.use("/lostitem/", lostItemRouter);

module.exports = app;