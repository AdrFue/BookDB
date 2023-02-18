const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const fs = require('fs');

let db = require('./db.js');
let link = 'https://www.googleapis.com/books/v1/volumes?q=panem&maxResults=5&key=' + process.env.API_KEY;

const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');


app.get('/api', async (req, res) => {
  const response = await fetch(link);
  const data = await response.json();

  let rawdata = fs.readFile('apiResultSearch.json');
  let bookSearch = rawdata.items;
  let tns = [];
  console.log(bookSearch);
  // setTimeout(() => {
  for (let book of bookSearch) {
    tns.push(book.volumeInfo.imageLinks.thumbnail);
  }
  console.log(bookSearch);
  res.render('list', {
    bookSearch: bookSearch,
    tns: tns
    });
    
  // }, 1000);
})

app.get('/', (req, res) => {

  res.render('index');
})


app.get('/list', (req, res) => {
  db.qry('SELECT * FROM books')
    .then(books => {
      db.qry('SELECT * FROM authors')
      .then(authors => {
        res.render('list', {
          books: books,
          authors: authors
        })
      })
      .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
})



app.listen(port, () => {
  console.log(`Server auf Port ${port} gestartet!`)
})