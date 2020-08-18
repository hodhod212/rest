import dotenv from "dotenv";
dotenv.config();
import http from "http";
import path from "path";
import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
const app = express();
//connect to mongodb
const dbURI =
  "mongodb+srv://iran212:iran212@cluster0.n4lci.mongodb.net/iran212?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => console.log("Connected to mongodb"))
  .catch((err) => console.log(err));
app.set("view engine", "ejs");
const __dirname = path.resolve(path.dirname(""));
app.use(express.json());
app.use(express.static("public"));
const posts = [
  {
    username: "Ali",
    title: "post 1",
  },
  {
    username: "Benjamin",
    title: "post 2",
  },
  {
    username: "Billy",
    title: "post 3",
  },
];
app.use(morgan("dev"));
app.get("/", (req, res) => {
  const blogs = [
    {
      title: "Yoshi finds eggs",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      title: "Mario finds stars",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      title: "How to defeat bowser",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
  ];
  res.render("index", { title: "Home", blogs });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(3333);
