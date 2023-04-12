const db = require('../db.js');

module.exports = class Book {

  static async fetchAll() {
    return await db.qry('SELECT * FROM authors');
  }

  static async add(authors, bookId) {
    for (let author of authors) {
      await db.qry('INSERT INTO authors (a_bl_id, a_name) ' + 
        'VALUES ("' + bookId + '", "' + author + '" )');
    }
  }

  static async deleteByBookId(bookId) {
    return await db.qry(
      'DELETE FROM authors ' +
      'WHERE a_bl_id = ' + bookId.id);
  }

}