var express = require('express');

var conn = require('../database/dbconnect.js');

var router = express.Router();

// GET home
router.get(['/', '/:searchby&:search&:order', '/:searchby&:order'], (req, res) => {
    let searchby = req.params.searchby || 'title';
    let search = req.params.search || '';
    let order = req.params.order || 'asc';
    let sqlCmd = '';

    if (search !== '') {
        sqlCmd = `select * from books where ${searchby} like '%${search}%' order by ${searchby} ${order}`;
    }
    else{
        sqlCmd = `select * from books order by ${searchby} ${order}`;
    }
    console.log(sqlCmd);
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            result.forEach(book => {
                const coverImage = Buffer.from(book.cover).toString('base64');
                book.image = coverImage;
            });
            res.render('index', { books: result });
        }
    });
});

/* GET home page. */
/*router.get('/', function(req, res, next) {
  console.log(req.headers)
  var sqlCmd = 'select * from books';
  conn.query(sqlCmd, (error, result) => {
      if (error)
          console.log(error);
      else {
          result.forEach(book => {
              const coverImage = Buffer.from(book.cover).toString('base64');
              book.image = coverImage;
          });
          res.render('index', { books: result });
      }
  });
});*/

module.exports = router;