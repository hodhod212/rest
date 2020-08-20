import dotenv from "dotenv";
dotenv.config();
import http from "http";
import request from "request";
import path from "path";
import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
import Blog from "./models/blog.js";
import fs from "fs";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//connect to mongodb
const dbURI =
  "mongodb+srv://iran212:iran212@cluster0.n4lci.mongodb.net/iran212?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => {
    app.listen(3333);
    console.log("Connected to mongodb");
  })
  .catch((err) => console.log(err));

const __dirname = path.resolve(path.dirname(""));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
let myBlogs = [];

app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "New blog 3",
    snippet: "About new blog 3",
    body: "More about my new blog 3",
  });
  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
      myBlogs.push(result);
      var words = JSON.stringify(myBlogs, null, 2);
      fs.appendFileSync("data.json", words);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/single-blog", (req, res) => {
  Blog.findById("5f3d1d5d3792747758a20496")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
//////////////////////////////

app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});
//blogs route
app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", {
        title: "All blogs",
        blogs: result,
        weather: null,
        error: null,
      });
      //console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/blogs", (req, res) => {
  console.log(req.body);
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.send(result);
      res.redirect("/blogs");
      myBlogs.push(result);
      fs.writeFileSync("./data.json", myBlogs.join(","), "utf-8");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.put("/blogs/:id", (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var snippet = req.body.snippet;
  var body = req.body.body;
  Blog.update({ id, title, snippet, body }, (id) => {
    res.redirect("/blogs/" + id);
  });
});
app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog details" });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id).then((result) => {
    res.json({ redirect: "/blogs" });
  });
});
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
