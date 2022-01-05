var express = require("express");
var mongoose = require("mongoose");

// Require all models
var db = require("./demo/index");
console.log(db);

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://Rahul540:Rahul540@cluster0.ui5kg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public static folder
app.use(express.static("public"));

// Routes

// Home route. Currently just to make sure app is running returns hello message.
app.get("/", function (req, res) {
  res.send("Hello from demo app!");
});
app.get("/products", function (req, res) {
  db.Product.find({})
    .then(function (dbProducts) {
      res.json(dbProducts);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/reviews", function (req, res) {
  db.Review.find({})
    .then(function (dbReviews) {
      res.json(dbReviews);
    })
    .catch(function (err) {
      res.json(err);
    });
});
app.post("/product", function (req, res) {
  db.Product.create(req.body)
    .then(function (dbProduct) {
      // If we were able to successfully create a Product, send it back to the client
      res.json(dbProduct);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// // Route for creating a new Review and updating Product "review" field with it
app.post("/product/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Review.create(req.body)
    .then(function (dbReview) {
      // If a Review was created successfully, find one Product with an `_id` equal to `req.params.id`. Update the Product to be associated with the new Review
      // { new: true } tells the query that we want it to return the updated Product -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Product.find(
        { _id: req.params.id },
        { review: dbReview._id },
        { new: true }
      );
    })
    .then(function (dbProduct) {
      // If we were able to successfully update a Product, send it back to the client
      res.json(dbProduct);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Route for retrieving a Product by id and populating it's Review.
app.get("/products/:id", function (req, res) {
 console.log('-------------------1');
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  // db.Product.find()
  //   // ..and populate all of the notes associated with it
  //   .populate("review")
  //   .then(function (dbProduct) {
  //     // If we were able to successfully find an Product with the given id, send it back to the client
  //     res.json(dbProduct);
  //   })
  //   .catch(function (err) {
  //     // If an error occurred, send it to the client
  //     res.json(err);
  //   });

    db.Product.find()
    // ..and populate all of the notes associated with it
    .populate("review")
    .then(function(dbProduct) {
      // If we were able to successfully find an Product with the given id, send it back to the client
      res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

// Start the server
app.listen(PORT, function () {
  console.log("Listening on port " + PORT + ".");
});
