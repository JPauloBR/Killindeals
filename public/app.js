// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
    for (var i = 0; i < data.length; i++) {
      // The title of the article
      $(".article-container").append("<h4><a target='_blank' href="+data[i].link+">" + "<b>Title:</b> " + data[i].title + "</h4>");
      // An input to enter a new title
      $(".article-container").append("<p>" + "<b>Author</b>: " + data[i].author + "</p>");
      // A textarea to add a new note body
      $(".article-container").append("<p>" + "<b>Date:</b> " + data[i].dateTime + "</p>");
      // A button to submit a new note, with the id of the article saved to it
      $(".article-container").append("<p>" + "<b>Summary:</b> " +  data[i].summary + "</p>");
      $(".article-container").append("<p>" + "<b>Article Id:</b> " + data[i].externalArticleId + "</p><br>");

      // If there's a note in the article
      if (data[i].note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
  }
});


// Whenever someone clicks scrape button
$(document).on("click", ".btn", function() {
  console.log("click");

  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      location.reload();
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
