

const express = require ( "express" );

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// host static resources
app.use(express.static("public"));
// body-parser is now built into express!
app.use(express.urlencoded({ extended: true})); 

app.set("view engine", "ejs");

// a common localhost test port
const port = 3000; 

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})


var fruits = ["apples", "orange", "peach", "mango"];

app.post("/", (req, res) => {
    // template literal
    //console.log(req.body)
    res.render("greeting", {username: req.body ["my-name"], fruitList: req.body.fruits})
})

/*****
app.post("/", (req, res) => {
    // template literal
    res.send (`<h1>Welcome to my page, ${req.body["my-name"]}</h1>`)
})
/****
app.get("/greeting", function (req, res) {
    //note the difference vs a res.send, we drop the directory and the .ejs
    res.render("greeting")
});


app.get("/greeting", function (req, res) {
    let userName = "notadam"
    res.render("greeting", {username: userName})
});
***/
