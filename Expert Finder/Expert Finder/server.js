//Loads the express module
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

//Loads the handlebars module
const handlebars = require('express-handlebars');

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

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.render('welcome'));
app.use('/', express.static('public'));

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
