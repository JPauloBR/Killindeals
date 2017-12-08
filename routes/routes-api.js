var db = require("../models");
var request = require("request");
var cheerio = require("cheerio");

module.exports = function(app) {
// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://kotaku.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article.status-published").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("a.js_entry-link")
        .text();
      result.author = $(this)
        .find("div.author").children()
        .text();
      result.dateTime = $(this)
        .find("time").attr("datetime");
      result.link = $(this)
        .find("a.js_entry-link")
        .attr("href");
      result.summary = $(this)
        .find("p").text();
      result.externalArticleId = $(this).attr("data-id");
      // Create a new Article using the `result` object built from scraping
      db.Article
        .updateOne(
          {externalArticleId : result.externalArticleId}, 
          {
            "$setOnInsert": result
          }, 
          {
            new : true, 
            upsert : true
          })
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          console.log("Scrape Complete!");
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
  });
});

// index route loads index handlebars page
app.get("/", function(req, res) {
    console.log('html-routes: app.get(/)');
    // console.log(req.session.passport.user);
    db.Article.find({}).sort({dateTime: -1}).then(function(resp, err) {
      if(err) {
        console.log(err);
      }
      else {
        console.log(resp);
        res.render("pages/index", {articles : resp});
      }
    })
});

// index route loads index handlebars page
app.get("/saved", function(req, res) {
    console.log('html-routes: app.get(/saved)');
    // console.log(req.session.passport.user);
    db.Article.find({isSaved : true }).sort({dateTime: -1})
    .populate("notes")
    .then(function(resp, err) {
      if(err) {
        console.log(err);
      }
      else {
        res.render("pages/saved", {articles : resp});
      }
    })
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}).sort({dateTime: -1}).then(function(resp, err) {
    if(err) {
      console.log(err);
    }
    else {
      res.json(resp);
    }
  })
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({'_id' : req.params.id})
  .populate("note")
  .then(function(article) {
    res.json(article);
  })
  .catch(function(err) {
    res.json(err)
  })
});

// Route for saving/updating an Article's associated Note
app.put("/articles/:id", function(req, res) {
  db.Article.update({externalArticleId : req.params.id}, {isSaved : true})
  .then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  })
});

// Route for saving/updating an Article's associated Note
app.put("/articles-del/:id", function(req, res) {
  db.Article.update({externalArticleId : req.params.id}, {isSaved : false})
  .then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  })
});

// Route for saving a new Note to the db and associating it with a User
app.put("/articles-add-note/:id", function(req, res) {

  // Create a new Note in the db
  db.Note
    .create({body: req.body.body})
    .then(function(dbNote) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({externalArticleId : req.params.id}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If the User was updated successfully, send it back to the client
      console.log(dbArticle)
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      console.log(err)
      res.json(err);
    });
});

// Route to get all User's and populate them with their notes
app.get("/populated", function(req, res) {
  // Find all users
  db.User
    .find({})
    // Specify that we want to populate the retrieved users with any associated notes
    .populate("notes")
    .then(function(dbUser) {
      // If able to successfully find and associate all Users and Notes, send them back to the client
      res.json(dbUser);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.delete("/note-del/:id", function(req, res) {
  // Find all users
  db.Note.findOneAndRemove({
      "_id": req.params.id
    }, function(err) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        db.Article.findOneAndUpdate({
            externalArticleId : req.body.articleId
          }, {
            $pull: {
              "notes": req.params.id
            }
          })
          .exec(function(err) {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              res.send("Note Deleted");
            }
          });
      }
    });
  });
};