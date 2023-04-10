const Book = require('../models/book.model.js');
const Author = require('../models/author.model.js');
const bookApi = 'https://www.googleapis.com/books/v1/volumes?q=';
const apiKey = process.env.BOOKAPIKEY;
const maxRes = 10;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const list = async (req, res) => {
  const books = await Book.fetchAll();
  const authors = await Author.fetchAll();
  res.render('list', {
    books: books,
    authors: authors,
    type: 'readBooks'
  })
}

const search = async (req, res) => {

  const link = bookApi + req.query.title + '&maxResults=' + maxRes + '&key=' + apiKey;
  const response = await fetch(link)
    .then(res => res.json())
    .then(googleBooks => {
      let tns = [];
      for (let gb of googleBooks.items) {
        const vi = gb.volumeInfo;
        tns.push({})
        curId = tns.length - 1;
        tns[curId].title = vi.title;
        tns[curId].authors = [];
        
        if (typeof vi.authors != "undefined") {
          for (let author of vi.authors) {
            tns[curId].authors.push(author);
          }
        } else {
          tns[curId].authors[0] = "n/a";
        }
        if (typeof vi.imageLinks != "undefined") {
          tns[curId].thumbnail = vi.imageLinks.thumbnail;
        } else {
          tns[curId].thumbnail = "n/a";
        }
        tns[curId].description = vi.description;

        if (typeof vi.industryIdentifiers != "undefined") {
          if (vi.industryIdentifiers[0].type == "ISBN_13") {
            tns[curId].isbn = vi.industryIdentifiers[0].identifier;
          } else if (vi.industryIdentifiers.length > 1) {
            if (vi.industryIdentifiers[1].type == "ISBN_13") {
            tns[curId].isbn = vi.industryIdentifiers[1].identifier;
            } else {
              tns[curId].isbn = "n/a";
            }
          } else {
            tns[curId].isbn = "n/a";
          }
        } else {
          tns[curId].isbn = "n/a";
        }
        tns[curId].published = vi.publishedDate;
        tns[curId].publisher = vi.publisher;
        tns[curId].pages = vi.pageCount;

      }
      res.render('list', {
        results: tns,  
        type: 'bookSearchResults'
      })
    })
 

}

const add = async (req, res) => {
  const bookInsert = await Book.add(req.body)
  const authors = req.body.authors.split(', ');
  await Author.add(authors, bookInsert.insertId)
  res.redirect('/list');

}

const deleteById = (req, res) => {
  return db.qry('DELETE FROM books WHERE id = ?', [id]);
}


module.exports = {
  list,
  search,
  add,
  deleteById   
}