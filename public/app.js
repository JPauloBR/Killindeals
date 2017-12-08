

// Whenever someone clicks scrape button
$(document).on("click", ".scrape-new", function() {
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

// When you click the save button
$(document).on("click", ".save-btn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-article-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    data: {
      externalArticleId : thisId
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $('#modal-save-confirm').modal('show');
    });
    $("#modal-save-confirm").on('hidden.bs.modal', function () {
           window.location.reload(true);
       });

});

// When you click the delete button
$(document).on("click", ".delete-btn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-article-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "PUT",
    url: "/articles-del/" + thisId,
    data: {
      externalArticleId : thisId
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $('#modal-delete-confirm').modal('show');
    });
    //refresh page after buying
    $("#modal-delete-confirm").on('hidden.bs.modal', function () {
           window.location.reload(true);
       });

});

// When you click the delete button
$(document).on("click", ".delete-note-btn", function() {
  // Grab the id associated with the article from the submit button
  var noteId = $(this).attr("note-id");
  var articleId = $("#art-id").attr("data-article-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "DELETE",
    url: "/note-del/" + noteId,
    data: {
      noteId : noteId,
      articleId: articleId
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $('#modal-note-delete-confirm').modal('show');
    });
    //refresh page after buying
    $("#modal-note-delete-confirm").on('hidden.bs.modal', function () {
           window.location.reload(true);
       });

});

$(document).on("click", ".add-note-btn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-article-id");
  $("#article-id").text(thisId);
  $("#notes").text($(this).notes);
  $("#confirm-save-note").val(thisId).attr("data-article-id");


  $('#modal-note').modal('show');
    //refresh page after buying
});

$(document).on("click", "#confirm-save-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).val();
  var thisNote = $("#new-note").val();
  console.log(thisId);
  console.log(thisNote);
  $('#modal-note').modal('hide');

    $.ajax({
      method: "PUT",
      url: "/articles-add-note/" + thisId,
      data: {
        externalArticleId : thisId,
        body : thisNote
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $('#modal-note-confirm').modal('show');
      });
      //refresh page after buying
      $("#modal-note-confirm").on('hidden.bs.modal', function () {
             window.location.reload(true);
         });

});