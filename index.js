const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 8080;
//app.set("view engine", "ejs");
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

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  //console.log(typeof email, typeof password);
  console.log(jsonData);
  const user = jsonData.find(
    (user) => user.email_id === email && user.password === password
  );
  //console.log(user);
  if (user) {
    res.cookie("useremail", email);
    res.render("homepage.ejs");
  } else {
    res.send("Invalid email or password");
  }
});

app.post("/submitText", (req, res) => {
  const subText = req.body.subText;
  res.cookie("submittedText", subText);
  //res.render("/homepage.ejs");
  console.log("text submitted");
});

app.get("/search", (req, res) => {
  const searchText = req.query.searchText;
  const textsearch = req.cookies.submittedText;
  console.log(searchText);
  res.render("homepage.ejs", { textsearch: textsearch });
});
app.post("/clearCookie", (req, res) => {
  res.clearCookie("submittedText");
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  res.clearCookie("useremail");
  res.clearCookie("submittedText");
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
