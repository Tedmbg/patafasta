// get the imports
import express from "express";
import bodyParser from "body-parser";
import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import session from "express-session";

// define the variables
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
let key = generateRandomString(20);

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key", // replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // set to imin
  })
);

// access to static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// path to the json files
const userFilePath = path.join(__dirname, "data", "users.json");
const carFilePath = path.join(__dirname, "data", "cars.json");

// Load JSON data
async function loadJson(filePath) {
  try {
    return await fs.readJson(filePath);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return null;
  }
}

app.get("/", (req, res) => {
  res.render("login.ejs");
});

//home page
app.get("/home", (req, res) => {
  res.render("index.ejs");
});

// delivery page.
app.get("/delivery", (req, res) => {
  res.render("delivery.ejs");
});

//about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

//login route
app.post("/signIn", async (req, res) => {
  let email = req.body["email"];
  let password = req.body["password"];
  console.log(
    `here is the email ${email} and here is the password ${password}`
  );
  //read user data from the json file
  let usersData = await loadJson(userFilePath);

  // Check if user exists and password is correct
  let user =
    usersData.drivers.find(
      (user) => user.email === email && user.password === password
    ) ||
    usersData.managers.find(
      (user) => user.email === email && user.password === password
    );

  if (user) {
    req.session.user = user; // save user to seeions in browser
    let title = `Welcome, ${user.name}`;
    res.send("index.ejs", {
      title: title,
    });
  } else {
    res.send("Invalid email or password");
  }
});

app.listen(port, () => {
  console.log(`The server is up and running on port ${port}`);
});
// Function to generate a random alphabet
function getRandomAlphabet() {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return alphabets[Math.floor(Math.random() * alphabets.length)];
}

// Function to generate a string of random alphabets
function generateRandomString(length) {
  let randomString = "";
  for (let i = 0; i < length; i++) {
    randomString += getRandomAlphabet();
  }
  return randomString;
}
