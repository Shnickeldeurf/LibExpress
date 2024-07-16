var express = require('express');
var router = express.Router();

var conn = require('../database/dbconnect.js');

// GET home
router.get(['/', '/:searchby&:search&:order', '/:searchby&:order'], (req, res) => {
    let searchby = req.params.searchby || 'name';
    let search = req.params.search || '';
    let order = req.params.order || 'asc';
    let sqlCmd = '';

    if (search !== '') {
        if (searchby === 'name') {
            sqlCmd = `select * from readers where FName like '%${search}%' or LName like '%${search}%' order by FName ${order}`;
        } else {
            sqlCmd = `select * from readers where ${searchby} like '%${search}%' order by ${searchby} ${order}`;
        }
    }
    else{
        if (searchby === 'name') {
            sqlCmd = `select * from readers order by FName ${order}`;
        } else {
            sqlCmd = `select * from readers order by ${searchby} ${order}`;
        }
    }
    console.log(sqlCmd);
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('readers', { readers: result });
        }
    });
});

// GET readers
router.get('/', (req, res) => {
    var sqlCmd = 'SELECT * FROM readers';
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('readers', { readers: result });
        }
    });
});

// Save reader
router.post('/', (req, res) => {
    var form = req.body;
    var sqlCmd = 'INSERT INTO readers SET ?';
    conn.query(sqlCmd, form, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

// DELETE reader
router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var sqlCmd = `DELETE FROM readers WHERE reader_id = ?`;
    conn.query(sqlCmd, id, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

// UPDATE reader
router.put('/:id', (req, res) => {
    var id = req.params.id;
    var form = req.body;

    var sqlCmd = 'UPDATE readers SET ? WHERE reader_id = ?';
    conn.query(sqlCmd, [form, id], (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

module.exports = router;