const express = require("express");
const bodyParser = require("body-parser");
const teacherRouter = require("./routes/teacher-routes");
const expressHBS = require("express-handlebars");
const path = require("path");

const app = express();

const hbs = expressHBS.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials")
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).render("home.hbs", { message: "Hello world!" });
});

app.use("/teachers", teacherRouter);

app.get("/about", (req, res) => {
  res.status(200).send("About page");
});

app.get("*", (req, res) => {
  res.status(404).send("404 page not found");
});

app.listen(8080, () => {
  console.log("server running");
});
