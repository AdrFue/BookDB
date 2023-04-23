const Book = require('../models/book.model.js');
const Author = require('../models/author.model.js');
const bookApi = 'https://www.googleapis.com/books/v1/volumes?q=';
const apiKey = process.env.BOOKAPIKEY;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const list = async (req, res) => {
  const books = await Book.fetchAll();
  const authors = await Author.fetchAll();
  res.render('index', {
    books: books,
    authors: authors,
    type: 'finishedBooks'
  })
}

const search = async (req, res) => {
  let qry = '';
  if (typeof req.query.isbn != "undefined") {
    qry = 'isbn:' + req.query.isbn;
  } else if (typeof req.query.title != "undefined") {
    qry = req.query.title;
  } else {
    res.redirect('/');
  }
  let mr = 10;
  if (typeof req.query.mr != "undefined") {
    mr = req.query.mr;
  }

  const link = bookApi + qry + '&maxResults=' + mr + '&key=' + apiKey;
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
        // check published date
        if (vi.publishedDate.length == 10) {
          tns[curId].published = vi.publishedDate;
        } else if (vi.publishedDate.length == 7) {
          tns[curId].published = vi.publishedDate + "-01";
        } else if (vi.publishedDate.length == 4) {
          tns[curId].published = vi.publishedDate + "-01-01";
        } else {
          tns[curId].published = "n/a";
        }

        tns[curId].publisher = vi.publisher;
        if (typeof vi.pageCount != 'undefined') {
          tns[curId].pages = vi.pageCount;
        } else {
          tns[curId].pages = -1;
        }
        tns[curId].infoLink = vi.infoLink;
        if (typeof vi.averageRating != "undefined") {
          tns[curId].globalRating = vi.averageRating;
        } else {
          tns[curId].globalRating = -1;
        }

      }
      res.render('index', {
        results: tns,  
        type: 'bookSearchResults'
      })
    })
 
}

const add = async (req, res) => {
  const bookInsert = await Book.add(req.body)
  const authors = req.body.authors.split(', ');
  await Author.add(authors, bookInsert.insertId)
  res.redirect('/');
}

const updateById = async (req, res) => {
  if (req.body.reading_start == '') {
    req.body.reading_start = '0001-01-01';
  }
  if (req.body.reading_end == '') {
    req.body.reading_end = '0001-01-01';
  }
  await Book.updateById(req.body)
  res.redirect('/');
}

const deleteById = async (req, res) => {
  await Author.deleteByBookId(req.body)
  await Book.deleteById(req.body)
  res.redirect('/');
}


module.exports = {
  list,
  search,
  updateById,
  add,
  deleteById  
}