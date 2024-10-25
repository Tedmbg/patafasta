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
    cookie: { maxAge: 60000000 }, // set to 1 min
    // cookie: { maxAge: 3000 }
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
app.use(bodyParser.json()); // to parse JSON bodies
app.use(express.static("public")); // enable use to access static pages.

// path to the json files
const userFilePath = path.join(__dirname, "data", "users.json");// create path to the json
const assignmentsFilePath = path.join(__dirname, 'data', 'cars.json');

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
    if (!req.session.user) {
        return res.redirect('/');
      }
    const name = req.session.user ? req.session.user.name : null;
    const sessionID = req.sessionID;
    const role = req.session.user ? req.session.user.role : null;
    let btn_value = "Deliveries";
    if (role === 'Admin') {
        btn_value = "Dashboard";
    } else {
        btn_value = "Deliveries";
    }
    console.log(`this is the sessionID ${sessionID} and this is the role ,${role}`);
  res.render("index.ejs", { name, btn_value });
});

// delivery page
app.get("/delivery", async (req, res) => {
    const role = req.session.user ? req.session.user.role : null;
    const driverName = req.session.user ? req.session.user.name :null;
    console.log(`This is the user role,${role}`);
    const assignments = await loadJson(assignmentsFilePath);

    if (role === "Admin") {
        res.redirect("/dashboard");
    } else {
        const driverAssignments = assignments.assignments.filter(
            (assignment) => assignment.driver === driverName
        );
        res.render("delivery.ejs", {
            assignments: driverAssignments,
            driverName: driverName,
        });
    }
});

// Route to update status
// Route to update status
app.post('/update-status', async (req, res) => {
    const { id, status } = req.body;

    let assignments = await loadJson(assignmentsFilePath);

    if (!assignments || !assignments.assignments) {
        console.error('Assignments data not found or invalid.');
        return res.json({ success: false });
    }

    // Find the assignment by ID and update its status
    let assignment = assignments.assignments.find(a => a.id === id);
    if (assignment) {
        assignment.status = status;
        assignment.type = status;  // Assuming `type` should also be updated

        // Save the updated assignments back to the JSON file
        try {
            await fs.writeJson(assignmentsFilePath, assignments, { spaces: 2 });
            res.json({ success: true });
        } catch (error) {
            console.error('Error writing to JSON file:', error);
            res.json({ success: false });
        }
    } else {
        console.error(`Assignment with ID ${id} not found.`);
        res.json({ success: false });
    }
});


//dashboard route
app.get("/dashboard", async (req, res) => {
    const name = req.session.user ? req.session.user.name : null;
    var assignments = await loadJson(assignmentsFilePath);
    console.log(`these are the assignments, ${JSON.stringify(assignments, null, 2)}`);
    res.render("dashboard.ejs", { name: name, assignments: assignments.assignments });
});
// assigning personnel
app.post('/assign', async (req, res) => {
    const { id, driver, destination } = req.body;
  
    console.log(`Assign request received: id=${id}, driver=${driver}, destination=${destination}`);
  
    let assignments = await loadJson(assignmentsFilePath);
  
    if (!assignments || !assignments.assignments) {
        console.error('Assignments data not found or invalid.');
        return res.json({ success: false });
    }
  
    // Find the assignment by ID and update the driver and destination
    let assignment = assignments.assignments.find(a => a.id === id);
    if (assignment) {
        assignment.driver = driver;
        assignment.destination = destination;
  
        // Save the updated assignments back to the JSON file
        try {
            console.log(`Writing updated assignments: ${JSON.stringify(assignments, null, 2)}`);
            await fs.writeJson(assignmentsFilePath, assignments, { spaces: 2 }); // Adding { spaces: 2 } to format the JSON
            res.json({ success: true });
        } catch (error) {
            console.error('Error writing to JSON file:', error);
            res.json({ success: false });
        }
    } else {
        console.error(`Assignment with ID ${id} not found.`);
        res.json({ success: false });
    }
});
  
//about page
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
