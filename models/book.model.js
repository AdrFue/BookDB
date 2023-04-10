const db = require('../db.js');

module.exports = class Book {

  static async add(book) {
    return await db.qry(
      'INSERT INTO books ( ' +
        'bl_title, bl_isbn, bl_publisher, bl_published_date, bl_pages, bl_img_link) ' +
        'VALUES ("' + 
          book.title + '", "' + book.isbn + '", "' + book.publisher + '", "' + book.published + '", "' + book.pages + '", "' + book.thumbnail + '"' + 
        ')', 
    );
  }

  static async fetchAll() {
    return await db.qry('SELECT * FROM books');
  }

}