//require fs to read file
const fs = require("fs");

class NoteService {
  //by creating a class NoteService, we are able to invoke it in all of our functions and link it all together.
  // this.init can then be called later
  constructor(file) {
    this.file = file;
    this.initPromise = null;

    this.init();
  }

  //init is how we makes sure our notes are run, as it initializes the notes once
  init() {
    if (this.initPromise === null) {
      this.initPromise = new Promise((resolve, reject) => {
        this.read()
          .then(() => {
            resolve();
          })
          .catch(() => {
            this.notes = {}; //an empty object is declared
            this.write()
              .then(resolve)
              .catch(reject);
          });
      });
    }
    return this.initPromise;
  }

// read is how we will read our notes. Using Promise syntax, we are able to call this.file and resolve it with this.notes, which is linked through config. We are able to effectively catch errors easier. 
  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.file, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          this.notes = JSON.parse(data);
        } catch (e) {
          return reject(e);
        }
        return resolve(this.notes);
      });
    });
  }

  //Write method will allow us to add in our notes 
  write() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.file, JSON.stringify(this.notes), err => {
        if (err) {
          return reject(err);
        }
        resolve(this.notes); //with every step, we should be resolving it by showing the list of notes that we have created
      });
    });
  }

  //list is unique for each user as it will retrieve only their notes. It is called through a Get call in index.js
  //by Running it, we have to make sure user is defined and see if there are notes pertaining to user. 
  list(user) {
    if (typeof user !== "undefined") {
      return this.init() 
        .then(() => {
          return this.read();
        })
        .then(() => {
          if (typeof this.notes[user] === "undefined") { //we have if causes to return either an empty array or the user's notes
            return [];
          } else {
            return this.notes[user];
          }
        });
    } else { 
      return this.init().then(() => {
        return this.read();
      });
    }
  }

 //add notes
  add(note, user) { //note is data passed in
    return this.init().then(() => {
      if (typeof this.notes[user] === "undefined") { 
        this.notes[user] = []; //empty array if user has no notes
      }
      this.notes[user].push(note); //we push our user input into their respective user (notes.json)
      return this.write();
    });
  }

  update(index, note, user) { 
    return this.init().then(() => {
        //conditions are written for our update, where we cannot update notes if they do not exist
      if (typeof this.notes[user] === "undefined") {
        throw new Error("Denied"); //index determines position of notes in our created {}
      } 
      if (this.notes[user].length <= index) {
        throw new Error("Denied");
      }
      this.notes[user][index] = note; //we are replacing the existing notes of user at index with our new input note
      return this.write(); //we must call the write function again to update
    });
  }

  //
  remove(index, user) {
    return this.init().then(() => {
      if (typeof this.notes[user] === "undefined") {
        throw new Error("Denied");
      }
      if (this.notes[user].length <= index) {
        throw new Error("Denied");
      }
      return this.read().then(() => {   //we call read first then splice to alter the index in our array 
        this.notes[user].splice(index, 1);  
        return this.write();
      });
    });
  }
}

module.exports = NoteService;
