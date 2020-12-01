//Loads the express module
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Loads the Multer Module for photo uploads
const multer = require('multer');
const { time } = require('console');

//Set storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

//Init upload 
const upload = multer({
    storage: storage,
    limits: {fileSize: 50000000},
    fileFilter:  function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage');

//check file type for image upload
function checkFileType(file,cb){
    //allowed ext
    const filetypes =  /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else { 
        cb('Error: Images Only!');
    }
}
module.exports.upload = upload;

//Creates our express server
const app = express();
const port = process.env.port || 9175;

//instead of app.set('view engine', 'handlebars');
app.set('view engine', 'hbs');

//instead of app.engine('handlebars', handlebars({
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'main'
}));

app.set('port', port);
app.set('mysql', mysql);

app.use(express.static(path.join(__dirname, '/public')))
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./welcome.js'));
app.use('/experts', require('./expertPage.js'));
app.use('/search', require('./search.js'));
app.use('/add-expert', require('./add-expert.js'));
app.use('/', express.static('public'));
app.use('/photo-upload', require('./uploads.js'));

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));


