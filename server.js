const express = require('express');
const bookRoutes = require('./routes/book.route.js');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
})

app.use(bookRoutes);

app.listen(port, () => {
  console.log(`Server auf Port ${port} gestartet!`)
})