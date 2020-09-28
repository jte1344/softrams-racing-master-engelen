const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');
var fs = require('fs');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:8000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('/api/teams', (req, res) => {
  request('http://localhost:8000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

//load the "DB"
var fakeDB = require('./db.json')
app.get('/members', (req, res) => {
  //responds with members data
  res.json(fakeDB.members);
});
app.get('/teams', (req, res) => {
  //responds with teams data
  res.json(fakeDB.teams);
});

// Submit Form!
app.post('/api/addMember', (req, res) => {
  //post to add member function
  request.post({
    headers: {'content-type' : 'application/json'},
    url: 'http://localhost:8000/addMember',
    body: JSON.stringify(req.body)
  }, (err, response, body) => {
    console.log(body);
  });
});
app.post('/addMember', (req, res) => {
  //adds member to local data
  fakeDB.members.push(req.body);
  fakeDB = JSON.stringify(fakeDB);
  //writes to actual file "DB"
  fs.writeFile('./db.json', fakeDB, 'utf8', function() {
    console.log("Saved to DB");
  })
  res.send(true);
});



app.post('/api/editMember', (req, res) => {
  //post to edit member function
  request.post({
    headers: {'content-type' : 'application/json'},
    url: 'http://localhost:8000/editMember',
    body: JSON.stringify(req.body)
  }, (err, response, body) => {
    console.log(body);
  });
});
app.post('/editMember', (req, res) => {

//find member to edit
  for (var i = 0; i < fakeDB.members.length; i++) {
    if (fakeDB.members[i].id == req.body.id) {
      //makes the edit
      fakeDB.members[i] = req.body;
    }
  }
  fakeDB = JSON.stringify(fakeDB);
  //writes to actual file "DB"
  fs.writeFile('./db.json', fakeDB, 'utf8', function() {
    console.log("Saved to DB");
  })
  res.send(true);
});



app.post('/api/deleteMember', (req, res) => {
  //post to delete member function
  request.post({
    headers: {'content-type' : 'application/json'},
    url: 'http://localhost:8000/deleteMember',
    body: JSON.stringify(req.body)
  }, (err, response, body) => {
    console.log(body);
  });
});
app.post('/deleteMember', (req, res) => {
  //looks for member to remove
  var removeAt = 0;
  for (var i = 0; i < fakeDB.members.length; i++) {
    if (fakeDB.members[i].id == req.body.id) {
      //finds remove position
      removeAt = i;
      break;
    }
  }
  //removes from local data
  fakeDB.members.splice(removeAt, 1)
  fakeDB = JSON.stringify(fakeDB);
  //writes to actual file "DB"
  fs.writeFile('./db.json', fakeDB, 'utf8', function() {
    console.log("Saved to DB");
  })
  res.send(true);
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
