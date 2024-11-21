//wrapping in asyn function allows complete execution of programme before proceeding
(async () => {

// Bring in mongoose
const mongoose = require( 'mongoose' );

// connects to the "test" database (ensure mongod is running!)
// the later arguments fix some deprecation warnings
mongoose.connect( 'mongodb://localhost:27017/testdb');

const gameSchema = new mongoose.Schema ({
    name: String,
    rating: Number,
    price: Number,
    review: String
});


// this creates a collection called `games` (Weird, but intuitive)
const Game = mongoose.model ( "Game", gameSchema );

//do an insert


const game = new Game({
    name: "Inscryption",
    rating: 5,
    price: 4.99,
    review: "classic"
});

//save the game 
//game.save(); 

//after saving, close connection
//mongoose.connection.close()

//game.save().then(()=>mongoose.connection.close());
//await allows for nested task waiting
//commenting out await game.save() out prevents creating more copies
 //await game.save()

async function findInDatabase() {
    try {
        const results = await Game.findOne({ name: "Inscryption" });
        console.log(results);
        if ( results.length === 0 ) {
            console.log( "no results founds" );
            return;
        }
        // this is where we have access to our results
        
    } catch ( error ) {
        console.log( error );
    }
}

await findInDatabase();

//update game

const game2 = new Game({
    name: "Resident Evil 4",
    rating: 5,
    price: 4.99,
    review: "New and Shiny!"
});

//await game2.save()  

async function updateGames() {
    try {
        const newGame = await Game.findOne({ name: "Resident Evil 4"})
        newGame.rating = 1
        newGame.review = "I like the old one better"
        await newGame.save()

    } catch (error) {
        console.log(error);
    }

};

await updateGames();


await Game.deleteOne ( { name: "Inscryption" } );


//mongoose.connection.close() 
// all your code here

mongoose.connection.close() ;

})();