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

var emailError = '';

// Set up session middleware
app.use(
  session({
    secret: key, // replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000 }, // set to 30 seconds for testing
    rolling: true, // Enable rolling session
  })
);

// Endpoint to check session status
app.get("/checkSession", (req, res) => {
  if (req.session.user) {
    res.json({ sessionActive: true });
  } else {
    res.json({ sessionActive: false });
  }
});

// Endpoint to extend session
app.get("/extendSession", (req, res) => {
  if (req.session.user) {
    req.session.touch(); // This updates the session's expiration time
    res.json({ sessionExtended: true });
  } else {
    res.json({ sessionExtended: false });
  }
});



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

// Middleware to check session
// function checkSession(req, res, next) {
//   if (!req.session.user) {
//     return res.redirect('/');
//   }
//   next();
// }

app.get("/", (req, res) => {
  res.render("login.ejs", { emailError: '' });
});

// home page
app.get("/home", (req, res) => {
    const name = req.session.user ? req.session.user.name : null;
    const sessionID = req.sessionID;
    const role = req.session.user ? req.session.user.role : null;
    let btn_value = "Deliveries";
    if(role === 'Admin'){
        btn_value = "Dashboard";
    }else{
        btn_value = "Deliveries";
    }
    console.log(`this is the sessionID ${sessionID} and this is the role ,${role}`);
  res.render("index.ejs", { name, btn_value });
});

// delivery page
app.get("/delivery", (req, res) => {
    const role = req.session.user ? req.session.user.role : null;
    console.log(`This is the user role,${role}`);
   if(role === "Admin"){
    res.render("dashboard.ejs");
   } else{
    res.render("delivery.ejs");
   }
});

// about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// login route
app.post("/signIn", async (req, res) => {
  let email = req.body["email"];
  let password = req.body["password"];
  console.log(
    `here is the email ${email} and here is the password ${password} and here is the key ${key}`
  );
  // read user data from the json file
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
    req.session.user = user; // save user to sessions in browser
    let name = user.name;
    console.log(`this is the name, ${name}`);
    res.redirect("/home");
  } else {
    emailError = "Invalid email or password! Try Again.";
    res.render("login.ejs", { emailError: emailError });
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
