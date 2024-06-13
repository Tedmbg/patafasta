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
    secret: "key", // replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }, // set to imin
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
    const name = req.session.user ? req.session.user.name : null;// this is an if statement
    const sessionID = req.sessionID;
    const role = req.session.user ? req.session.user.role : null;
    let btn_value = "Deliveries";
    if(role === 'Admin'){
        btn_value = "Dashboard";
    }else{
        btn_value = "Deliveries";
    }
    console.log(`this is the sessionID ${sessionID} and this is the role ,${role}`);
  res.render("index.ejs",{name:name,
    btn_value:btn_value
  });
});

// delivery page.
app.get("/delivery", (req, res) => {
    const role = req.session.user ? req.session.user.role : null; // here we are geting user role.
    console.log(`This is the user role,${role}`);
   if(role === "Admin"){
    res.render("dashboard.ejs");
   } else{
    res.render("delivery.ejs");
   }
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
    `here is the email ${email} and here is the password ${password} and here is the key ${key}`
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
    let name = user.name;
    console.log(`this is the name, ${name}`);
    res.redirect("/home");
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
