const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const app = express();
const port = 8080;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
let jsonData;

try {
  const data = fs.readFileSync("data.json", "utf8");
  jsonData = JSON.parse(data);
} catch (err) {
  console.error("Error reading data.json:", err);
}
app.get("/", (req, res) => {
  res.render("login.ejs");
});
app.get("/home", (req, res) => {
  res.render("homepage.ejs", { textsearch: "" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = jsonData.find(
    (user) => user.email_id === email && user.password === password
  );

  if (user) {
    res.cookie("useremail", email);
    res.render("homepage.ejs", { textsearch: "Your search will appear here." });
  } else {
    res.send("Invalid email or password");
  }
});

app.post("/submitText", (req, res) => {
  const subText = req.body.subText;

  res.cookie("textMessage", subText);
  res.redirect("/home");
});

app.get("/search", (req, res) => {
  const searchText = req.query.searchText;

  const textsearch = req.cookies.textMessage;

  if (searchText === textsearch) {
    res.render("homepage.ejs", { textsearch: textsearch });
  } else {
    res.json({ message: "Try search again" });
  }
});
app.post("/clearCookie", (req, res) => {
  res.clearCookie("submittedText");
  res.render("homepage.ejs", { textsearch: "All cookie cleared." });
});

app.post("/logout", (req, res) => {
  res.clearCookie("useremail");
  res.clearCookie("textMessage");
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
