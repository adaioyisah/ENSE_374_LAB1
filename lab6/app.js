


//const fs = require("fs");



/*
let myObj = { name : "Adam",
              address: {street: "123 Fake Street"}
 };



fs.writeFile ( __dirname + "/object.json", 
                   JSON.stringify( myObj ), 
                   "utf8", 
                   ( err ) => {
    if ( err ) {
        console.log( "Error writingthe file:", err );
        return;
    }
});
*/

// const fs = require( "fs" );

/* 
fs.readFile ( __dirname + "/object-bad.json",
            "utf8", 
            ( err, jsonString ) => {
    if ( err ) {
        console.log("Error reading file from disk:", err);
        return;
    }
    try {
        const object = JSON.parse(jsonString);
        console.log("User's name is:", object.name); // Adam
    } catch ( err ) {
        console.log("Error parsing JSON:", err);
    }
});
*/

const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 

// a common localhost test port
const port = 3000; 

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true})); 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

var hitCount= 0;

/**********************
app.get("/", (req, res) => {
    hitCount += 1;
    res.send(`<h1> Hello Node World! </h1> you are visitor number ${hitCount}`);
    console.log(`A user requested the root route`);
});
*******************/



app.get("/", (req, res) => {
   // hitCount += 1;
    res.sendFile(__dirname + "/index.html");
    console.log(`A user requested the root route`);
});



app.get("/about", (req, res) => {
    res.send(`<h1> I am a SSE student at U of R! </h1>`);
    console.log("A user requested the about page");
});

app.post("/", (req, res) => {
    console.log(req.body);
    res.send(`we got you message, it was received ${req.body["my-text"]}  `);
    
  });