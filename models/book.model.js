const db = require('../db.js');

module.exports = class Book {

  static async add(book) {
    return await db.qry(
      'INSERT INTO books ( ' +
        'bl_title, bl_isbn, bl_publisher, bl_published_date, bl_info_link, bl_pages, bl_global_rating, bl_img_link) ' +
        'VALUES ("' + 
          book.title + '", "' + book.isbn + '", "' + book.publisher + '", "' + book.published + '", "' + book.infoLink + '", ' + 
          book.pages + ', ' + book.globalRating + ', "' + book.imgLink + '"' + 
        ')', 
    );
  }

  static async updateById(book) {
    return await db.qry(
      'UPDATE books ' +
      'SET bl_key_notes = "' + book.key_notes + '", bl_reading_start = "' + book.reading_start + '", bl_reading_end = "' + book.reading_end + '" ' +
      'WHERE bl_id = ' + book.id);
  }

  static async deleteById(book) {
    return await db.qry(
      'DELETE FROM books ' +
      'WHERE bl_id = ' + book.id);
  }
  
  static async fetchAll() {
    return await db.qry('SELECT * FROM books');
  }

}