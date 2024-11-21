
$(document).ready( () => { 
    //Put your javascript in here
    // $("h1").text("changed the text in h1")
    $("#my-heading").text("changed the text in h1 with the id");

    $( "a" ).attr( "href", "https://www.google.com/" )

    let stars = $( "#btn-stars" ).data( "star-rating" )
    console.log(stars)

    $( "h1" ).on( "click", () => {
      alert( "you clicked it")   // your onclick code goes here!
    });

    //cascading
    $('#box')
        .css('background-color', 'red') // Changes the background color
        .slideUp(1000)                  // Slides up the box (animation)
        .slideDown(1000)                // Slides down the box (animation)
        .fadeOut(1000)                  // Fades out the box
        .fadeIn(1000);                  // Fades in the box

        //from jQuery back to vanilla dom
       // $( "header" )[0]
    
    $("h1").before ("<button>this is a button</button>");

    $("h1").css( "background-color", "blue" );
    

   });

  