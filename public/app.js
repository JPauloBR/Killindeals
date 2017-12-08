

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

$(document).on("click", ".add-note-btn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-article-id");
  $('#modal-note').modal('show');
    //refresh page after buying
});

$(document).on("click", "#confirm-save-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-article-id");

  $('#modal-note-confirm').modal('show');
    //refresh page after buying
});





// $('body').on('click', '.buy-btn', function() {
//     $("#buy-coinID").val($(this).attr("data-coinID"))
//     $("#buy-ccPrice").val($(this).attr("data-price"))
//     $("#buy-ccQuantity").val(0);
//     $("#buy-ccQuantity").val(0);
//     $("#buy-USDVAlue").val(0);
//     $('#modal-buy').modal('show');
//     console.log($("#usd-only").text());