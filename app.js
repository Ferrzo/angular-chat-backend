
//
// Preamble
var http = require ('http');	     // For serving a basic web page.
var mongoose = require ("mongoose"); // The reason for this demo.
var express = require('express');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
  process.env.MONGODB_URI ||
  'mongodb://localhost/HelloMongoose';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var messageSchema = new mongoose.Schema({
  user: {
    type: String, minlength: 1
  },
  message: { type: String, minlength: 1},
  created: { type: Date, default: Date.now()}
});

var Message = mongoose.model('Messages', messageSchema);

// Clear out old data
Message.remove({}, function(err) {
  if (err) {
    console.log ('error deleting old data.');
  }
});

// Creating one user.
var test = new Message ({
  user: 'TEST',
  message: 'Hello world'
});

// Saving it to the database.
test.save(function (err) {if (err) console.log ('Error on save!')});


// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];

// Create a rudimentary http server.  (Note, a real web application
// would use a complete web framework and router like express.js).
// This is effectively the main interaction loop for the application.
// As new http requests arrive, the callback function gets invoked.
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   createWebpage(req, res);
// }).listen(theport);

const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(theport, () => console.log('Example app listening on port 3000!'))



function createWebpage (req, res) {
  // Let's find all the documents
  Message.find({}).exec(function(err, result) {
    if (!err) {
      res.write(JSON.stringify(result));
    } else {
      res.end('Error in first query. ' + err)
    };
  });
}









// Tell the console we're getting ready.
// The listener in http.createServer should still be active after these messages are emitted.
console.log('http server will be listening on port %d', theport);



