function checkUniqueness(id){
  for(person of tables){
    if(person.customerID === id){
      return false;
    }
  }
  for(person of waitlist){
    if(person.customerID === id){
      return false;
    }
  }
  return true;
}

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
var tables;
var waitlist;
fs.readFile("tables.json", "utf8", function(err, data){
  tables = JSON.parse(data);
});
fs.readFile("waitlist.json", "utf8", function(err, data){
  waitlist = JSON.parse(data);
});

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tables", function(req, res) {
  res.sendFile(path.join(__dirname, "tables.html"));
});

app.get("/reserve", function(req, res) {
  res.sendFile(path.join(__dirname, "reservation.html"));
});

// Get all characters
app.get("/api/tables", function(req, res) {
  res.json(tables);
});

// Search for Specific Character (or all characters) - provides JSON
app.get("/api/waitlist", function(req, res) {
  res.json(waitlist);
});

//Create New Characters - takes in JSON input
app.post("/api/tables", function(req, res) {
  if(checkUniqueness(req.body.customerID)){
    if(tables.length < 5){
      tables.push(req.body);
      var stuff = JSON.stringify(tables, null, 2);
      fs.writeFileSync("tables.json", stuff);
      res.send(true);
    }
    else{
      waitlist.push(req.body);
      var stuff = JSON.stringify(waitlist, null, 2);
      fs.writeFileSync("waitlist.json", stuff);
      res.send(false);
    }
  }
  else{
    res.send("already on");
  }
});

app.post("/api/clear", function(req, res){
  tables = [];
  waitlist = [];
  fs.writeFileSync("tables.json", JSON.stringify(tables, null, 2));
  fs.writeFileSync("waitlist.json", JSON.stringify(waitlist, null, 2));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
