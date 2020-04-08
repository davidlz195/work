//require inbuilt
const fs = require("fs");
const path = require("path");
//require our downloaded modules
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");

const app = express();
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//serve up frontend data needed
app.use(express.static("public"));

//To best modularize our content, config.json is created to store notes, users, and port so that they can be called upon later.
const config = require("./stores/config.json")["development"];

const AuthChallenger = require("./AuthChallenger");
const NoteService = require("./Service/NoteService");
const NoteRouter = require("./Router/NoteRouter");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  basicAuth({
    authorizer: AuthChallenger(
      JSON.parse(fs.readFileSync(path.join(__dirname, config.users)))
    ),
    challenge: true,
    realm: "Note Taking Application"
    //basicAuth is run through AC.js and fs is used to read users.json linked through config
  })
);

//we have to initialize a new variable noteService to call upon the NoteService that we have required
//Our notes will be read and stored through notes
const noteService = new NoteService(path.join(__dirname, config.notes));

// first app.get to render index
app.get("/", (req, res) => {
  console.log(req.auth.user);
  noteService.list(req.auth.user).then(data => { //the list function is activated and data is console logged
    console.log(data);
    res.render("index", { //this will render the page unique to each user 
      user: req.auth.user,
      notes: data
    });
  });
});

app.use("/api/notes", new NoteRouter(noteService).router()); 
//the router is responsible for rendering our notes whilst the note service serves as its functioning guide

app.listen(config.port, () =>
  console.log(`${config.port} vroom vroom`)
);

module.exports = app;
