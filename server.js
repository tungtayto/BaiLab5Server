const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        console.log(fileName);

        let arr = fileName.split('.');
        let newFile = arr[0] + '-'+Date.now() + '.'+arr[1];

        cb(null, newFile)
    }
})

var upload = multer({ storage: storage ,limits:{fileSize:1*1024*1024}});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    // const size = parseInt(req.headers["content-length"]);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    // if(size > 1024*1024){
    //     const error = new Error('File Size < 1MB ')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    res.send(file)
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    // const size = parseInt(req.headers["content-length"]);
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    // if(size > 1024*1024){
    //     const error = new Error('File Size < 1MB ')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    res.send(files)
})

var storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.mimetype === "image/jpeg"){
            cb(null, 'uploads')
        } else {
            cb(new Error("Only Image JPEG"),null)
        }
        
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        console.log(fileName);

        let arr = fileName.split('.');
        let newFile = arr[0] + '-'+Date.now() + '.'+arr[1];

        cb(null, file.fieldname + '-' + Date.now())
    }
})

var uploadImage = multer({ storage: storageImage,limits:{fileSize:1*1024*1024}});

app.post('/uploadphoto', uploadImage.single('myImage'), (req, res, next) => {
    const file = req.file
    // const size = parseInt(req.headers["content-length"]);
    if (!file) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    // if(size > 1024*1024){
    //     const error = new Error('File Size < 1MB ')
    //     error.httpStatusCode = 400
    //     return next(error)
    // }
    res.send(file)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});