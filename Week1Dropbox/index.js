const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 


//npmjs website to see how to use express-fileupload to learn how to setup middleware
//path.sep is because windows/mac use different slashes, so it allows the use of both
app.use(fileUpload());

const uploadDirectory = __dirname + path.sep + 'uploaded';
// creates a path to folder 

app.use(express.static(__dirname)); 
// couldnt get certain pages (uploads.html, or background iamge) to load without using just __dirname


let caches = {};

// uses name and body for storage and write file to uploaded
function writeFile(name, body){
    return new Promise ((res, rej)=>{
        fs.writeFile(uploadDirectory + path.sep + name, body, (err)=>{
            if(err){
                console.error(err);
            } else {
                res(name);
            }
        });
    }).then(readFile);
}

function readFile(file){
    return new Promise ((res, rej)=>{
        fs.readFile(uploadDirectory + path.sep + file, (err, body)=>{
            if(err){
                console.error(err);
            } else {
                res(body);
            }
        });
    });
}

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});
//res.send will check structure of output + set header/etag attributes (makes caches more effective)
// then and catch for get and post


app.post('/files', async(req, res)=>{
    try{
        console.log(req.files)
       let file = req.files.upload.name;
       let data = req.files.upload.data;
       caches[file] = await writeFile(file, data);
       res.sendFile(path.join(__dirname, '/pages/uploads.html'));
    }catch(err){
        console.log(err);
        throw err; 
    }
});

app.get('/uploads',(req, res) => {
    let files = [];
    fs.readdirSync(uploadDirectory).forEach(file => {
            files.push(file);
    });
            console.log(files)
            res.send(files)
});

app.get('/uploadedFile/:name',(req, res) => {
    console.log('this is in the backend')
    res.download(uploadDirectory + path.sep + req.params.name)
});
    

//only multer is used for multiple file upload
// APP.get to download


app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
});
