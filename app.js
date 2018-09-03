
//
// Preamble
var mongoose = require ("mongoose"); // The reason for this demo.
var express = require('express');
var parser = require('body-parser');

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

// In case the browser connects before the database is connected, the
// user will see this message.
var found = ['DB Connection not yet established.  Try again later.  Check the console output for error messages if this persists.'];


const app = express()

app.use(function(req,res,next) {
  parser.json({extended: true});
  res.header("Access-Control-Allow-Origin", '*');
  next();
})
// app.use(parser.json({extended : true}));
app.get('/', (req, res) => {
  res.send("Hello world!");
});
app.get('/messages',(req,res) => {
  getMessages(req,res);
});
app.post('/messages',(req,res) => {
  addNewMessage(req,res)
});
app.listen(theport, () => console.log('http server will be listening on port %d', theport));



function getMessages (req, res) {

  // Let's find all the documents
  Message.find({}).exec(function(err, result) {
    if (!err) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(result));
      res.end()
    } else {
      res.end('Error in first query. ' + err)
    };
  });
}

function addNewMessage(req,res) {
  console.log(req.body);
  if(req.body.user && req.body.message) {
    var newMessage = new Message ({
      user: req.body.user,
      message: req.body.message
    });
    newMessage.save(function (err) {if (err) {console.log ('Error on save!')} else {getMessages(req,res)}});
  }
}


// Tell the console we're getting ready.
// The listener in http.createServer should still be active after these messages are emitted.
console.log('http server will be listening on port %d', theport);



