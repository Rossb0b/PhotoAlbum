const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const albumRoutes = require('./routes/albums');
const articlesRoutes = require('./routes/articles');
const commentsRoutes = require('./routes/comments');

const app = express();

mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://DBUSERNAME:" + process.env.MONGO_ATLAS_PW + "@cluster0-6xxe0.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/article", articlesRoutes);
app.use("/api/comments", commentsRoutes);


module.exports = app;
