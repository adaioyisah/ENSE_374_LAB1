const express  = require( "express" );
const mongoose = require( "mongoose" );

// 1. Require dependencies /////////////////////////////////////////
//Your code here!

// 1. Require dependencies /////////////////////////////////////////
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// a common localhost test port
const port = 3000; 

// body-parser is now built into express!
app.use( express.urlencoded( { extended: true} ) ); 

// 2. Create a session. The secret is used to sign the session ID.
//Your code here!
// 2. Create a session. The secret is used to sign the session ID.
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////


app.set( "view engine", "ejs" );

// connect to mongoose on port 27017
mongoose.connect( 'mongodb://localhost:27017/games', 
                 { useNewUrlParser: true, useUnifiedTopology: true });


// 3. Create the userSchema /////////////////////////////////////////
// It is important not to change these names
// passport-local-mongoose expects these. Use `username` and `password`!
// If you use `email` and `password`, it will not work!
const userSchema = new mongoose.Schema ({
    username: String,
    password: String
})

// plugins extend Schema functionality
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
////////////////////////////////////////////////////////////////////


const gameSchema = new mongoose.Schema({
    userName: String,
    gameName: String,
    score: Number,
    reviewText: String
});

const Game = mongoose.model( "Game", gameSchema );


// 4. Add our strategy for using Passport, using the local user from MongoDB
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////////////////////////////////////////


// Simple server operation
app.listen ( port, () => {
    // template literal
    console.log ( `Server is running on http://localhost:${port}` );
});

// 5. Register a user with the following code, which needs to be in the appropriate route
// As in (3), be sure to use req.body.username and req.body.password, and ensure the 
// html forms match these values as well
app.post( "/register", (req, res) => {
    console.log( "User " + req.body.username + " is attempting to register" );
    User.register({ username : req.body.username }, 
                    req.body.password, 
                    ( err, user ) => {
        if ( err ) {
        console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                res.redirect( "/reviews" );
            });
        }
    });
});
////////////////////////////////////////////////////////////////////


// 6. Log in users on the login route ////////////////////////////////
app.post( "/login", ( req, res ) => {
    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                res.redirect( "/reviews" ); 
            });
        }
    });
});
////////////////////////////////////////////////////////////////////


app.get( "/", ( req, res ) => {
    console.log( "A user is accessing the root route using get" );
    res.sendFile( __dirname + "/index.html" );
});

// 7. Register get routes for reviews and add-review ////////////////
app.get( "/reviews", async( req, res ) => {
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            console.log( "was authorized and found:" );
            const results = await Game.find();
            console.log( results );
            res.render( "reviews", { results : results });
        } catch ( error ) {
            console.log( error );
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }
});

app.get( "/add-review", ( req, res ) => {
    console.log( "A user is accessing the add-review page, and..." );
    if (req.isAuthenticated()) {
        console.log( "was authorized" );
        res.render( "add-review" );
    } else {
        console.log( "was not authorized" );
        res.redirect( "/" ) 
    }
});
////////////////////////////////////////////////////////////////////


// 8. Logout ///////////////////////////////////////////////////////
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      res.redirect('/');
    });
  });
  ////////////////////////////////////////////////////////////////////


// 9. Submit a post to the database ////////////////////////////////
// Note that in the username, we are using the username from the
// session rather than the form
app.post( "/submit", async( req, res ) => {
    console.log( "User " + req.user.username + " is adding the review:" );
    console.log( req.body )
    const game = new Game({
        userName:   req.user.username,
        gameName:   req.body.gameName,
        score:      parseInt( req.body.score ),
        reviewText: req.body.reviewText
    });

    game.save();

    res.redirect( "/reviews" );
});
////////////////////////////////////////////////////////////////////
