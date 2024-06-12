// get the imports
import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";


// define the variables
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

// access to static files
app.use(express.static("public"));

app.get("/",(req,res)=>{
//  res.sendFile(__dirname + "/public/index.html");
res.render("login.ejs");
});

app.listen(port,()=>{
    console.log(`The server is up and running on port ${port}`);
});