let download = $(function(){
    let fileData = $.get('/uploads').done(data => {
        for (file in data) {
               $(".uploadsList").append(`<a href="/uploadedFile/${data[file]}">${data[file]}</a>`)
        }
    });
});     
        // .get - receive from app.get (uploads) + .done execute it + append it to div uploadsList and href