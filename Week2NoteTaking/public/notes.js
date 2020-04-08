var notesTemplate = Handlebars.compile(
  `
    {{#each notes}}
    <div class="note">
        <span class="input"><textarea data-id="{{ @index }}"> {{ this }}</textarea></span>

        <button class="remove btn btn-xs" data-id="{{ @index }}"><i class = "fa fa-trash" aria-hidden="true"></i></button>
        </div>
        {{/each}}
    `
);

//page is rerendered every time notes are updated
const reloadNotes = notes => {
  console.log(notes);
  $("#notes").html(notesTemplate({ notes: notes }));
};

// Document on ready function -> execute all
$(() => {
  axios
    .get("/api/notes/") //this is the initial get request for rendering everything so that we can actually see it in the frontend
    .then(res => {
      console.log(`Starting... ${res.data} !`);
      reloadNotes(res.data);
    })
    .catch(err => {
      console.log(err);
    });

//click events for buttons but we will invoke in the router, which then calls the noteService
//this also corresponds to our 4 methods, get post push delete
  $("#add").submit(e => {
    e.preventDefault();
    console.log("added");

    var val = $("textarea[name=note]").val();
    console.log(val);
    if (val === "") {
      return;
    }
    $("textarea[name=note]").val("");
    axios
      .post("/api/notes/", {
        note: val
      })
      .then(res => {
        console.log(res.data);
        reloadNotes(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  });


  $("#notes").on("blur", "textarea", event => {
    beginSaving(event.currentTarget);

    axios
      .put("/api/notes/" + $(event.currentTarget).data("id"), {
        note: $(event.currentTarget).val()
      })
      .then(res => {
        reloadNotes(res.data);
      })
      .catch(e => {
        alert(e);
      });
  });

  $("#notes").on("click", ".remove", event => {
    console.log($(event.currentTarget).data("id"));
    axios
      .delete("/api/notes/" + $(event.currentTarget).data("id"))
      .then(res => {
        reloadNotes(res.data);
      })
      .catch(e => {
        alert(e);
      });
  });
});
