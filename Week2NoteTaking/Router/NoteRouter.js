//express is required for the Router as it is in charge of rendering, the going back and forth of the content between the frontend and backend
//responsible for updating our json file
const express = require("express");

//class NoteRouter so we can inject noteService to obe called on and also link all the functions with this global effect
class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  router() {
    let router = express.Router();  //here we define the 4 functions, get for rendering content, post to push new, put to replace, and delete
    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));
    return router;
  }

  get(req, res) { //get is only for rendering so only list is needed
    return this.noteService
      .list(req.auth.user) //similar to the get where we will list user unique notes
      .then(notes => {
        console.log(notes);
        res.json(notes);
      }) //we must send the notes back in Json format so that it can be stored in a json file
      .catch(err => res.status(500).json(err)); // This .catch is to handle any errors that may befall our project.
  }
  //here we invoke functions from our noteService so that everything will get added to the Json file and our frontend
  post(req, res) {
    console.log(req.body.note, req.auth.user);
    return this.noteService
      .add(req.body.note, req.auth.user)
      .then(() => this.noteService.list(req.auth.user))
      .then(notes => res.json(notes))
      .catch(err => res.status(500).json(err));
  }
//notes are then listed to reflect the changes as post put delete corresponds to add/update/remove in noteService
  put(req, res) {
    return this.noteService 
      .update(req.params.id, req.body.note, req.auth.user) //command to update notes + json     -> req.params.id is needed so we know which note in the array is changed
      .then(() => this.noteService.list(req.auth.user)) 
      .then(notes => res.json(notes)) 
      .catch(err => res.status(500).json(err));
  }

  delete(req, res) {
    return this.noteService
      .remove(req.params.id, req.auth.user)
      .then(() => this.noteService.list(req.auth.user))
      .then(notes => res.json(notes))
      .catch(err => res.status(500).json(err));
  }
}

module.exports = NoteRouter;
