const express = require("express");
const app = express();
require("dotenv").config({ path: '../.env' });
const mongoose = require("mongoose");
const userRouter=require("./routers/user")
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Heders",
    "Origin,X-Requsted-With,Content,Accept,Content-Type,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.afeysny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`  )
  .then(() => console.log("Connexion a MongoDB réussie !"))
  .catch((e) => console.log("Connexion a MongoDB échouée!", e));
// mongoose.connect("mongodb://127.0.0.1:27017/TACHETY"
// ).then(() => console.log("connexion a MongoDB reussie!"))
// .catch((e) => console.log("connexion a MongoDB échouée!",e))
// app.get("/", (req, res) => {
//   res.json({ message: "Hello World!" });
// });

app.use("/", userRouter)
module.exports = app;
