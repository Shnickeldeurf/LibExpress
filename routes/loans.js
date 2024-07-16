var express = require('express');
var router = express.Router();

var conn = require('../database/dbconnect.js');

// checkReturnDate
const checkReturnDate = (loans) => {
    const today = new Date();
    let returned = [];
    let loaned = [];
    loans.forEach(loan => {
        let returnDate = new Date(loan.returnDate);
        if (returnDate <= today) {
            returned.push(loan.book_id);
        }
        else {
            loaned.push(loan.book_id);
        }
    });
    var set = new Set(loaned);
    var rtrns = returned.filter(x => !set.has(x));
    rtrns.forEach(id => {
        const sqlCmd = 'UPDATE books SET isBorrowed = 0 WHERE book_id = ?';
        conn.query(sqlCmd, id, (error, result) => {
            if (error)
                console.log(error);
        });
    })
}

// GET loans
router.get(['/', '/:searchby&:search&:order', '/:searchby&:order'], (req, res) => {
    let searchby = req.params.searchby || 'title';
    let search = req.params.search || '';
    let order = req.params.order || 'asc';
    let sqlCmd = '';

    if (search !== '') {
        if (searchby == 'reader'){
            sqlCmd = `SELECT * FROM loans INNER JOIN readers ON loans.reader_id = readers.reader_id INNER JOIN books ON loans.book_id = books.book_id where readers.FName like '%${search}%' or readers.LName like '%${search}%' order by readers.Fname ${order}`;
        } else {
            sqlCmd = `SELECT * FROM loans INNER JOIN readers ON loans.reader_id = readers.reader_id INNER JOIN books ON loans.book_id = books.book_id where ${searchby} like '%${search}%' order by ${searchby} ${order}`;
        }
    }
    else{
        if (searchby == 'reader'){
            sqlCmd = `SELECT * FROM loans INNER JOIN readers ON loans.reader_id = readers.reader_id INNER JOIN books ON loans.book_id = books.book_id order by readers.Fname ${order}`;
        } else {
            sqlCmd = `SELECT * FROM loans INNER JOIN readers ON loans.reader_id = readers.reader_id INNER JOIN books ON loans.book_id = books.book_id order by ${searchby} ${order}`;
        }
    }
    console.log(sqlCmd);
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            checkReturnDate(result);
            res.render('loans', { loans: JSON.stringify(result) });
        }
    });
});


// GET loans
/*router.get('/', (req, res) => {
    const sqlCmd = 'SELECT * FROM loans INNER JOIN readers ON loans.reader_id = readers.reader_id INNER JOIN books ON loans.book_id = books.book_id';
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            checkReturnDate(result);
            res.render('loans', { loans: JSON.stringify(result) });
        }
    });
});*/

// GET books
router.get('/getbooks', (req, res) => {
    const sqlCmd = 'SELECT * FROM books WHERE isBorrowed = 0';
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            res.json(result);
        }
    }); 
});

// GET readers
router.get('/getreaders', (req, res) => {
    const sqlCmd = 'SELECT * FROM readers';
    conn.query(sqlCmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            res.json(result);
        }
    }); 
});

// Save loan
router.post('/', (req, res) => {
    const form = req.body;
    console.log(form);
    const sqlCmd = 'INSERT INTO loans SET ?';
    conn.query(sqlCmd, form, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
    var id = form.book_id;
    const sqlCmd2 = `UPDATE books SET isBorrowed = 1 WHERE book_id = ?`;
    conn.query(sqlCmd2, id, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

// DELETE loan
router.delete('/:id&:bid', (req, res) => {
    const id = req.params.id;
    const bid = req.params.bid;
    const sqlCmd = `DELETE FROM loans WHERE loan_id = ?`;
    conn.query(sqlCmd, id, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
    const sqlCmd2 = `UPDATE books SET isBorrowed = 0 WHERE book_id = ?`;
    conn.query(sqlCmd2, bid, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

// Edit loan
router.put('/:id&:bid', (req, res) => {
    const id = req.params.id;
    const bid = req.params.bid;
    const form = req.body;
    const sqlCmd = 'UPDATE loans SET ? WHERE loan_id = ?';
    conn.query(sqlCmd, [form, id], (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
    const sqlCmd2 = `UPDATE books SET isBorrowed = 0 WHERE book_id = ?`;
    conn.query(sqlCmd2, bid, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
    const sqlCmd3 = `UPDATE books SET isBorrowed = 1 WHERE book_id = ?`;
    conn.query(sqlCmd3, form.book_id, (error, result) => {
        if (error)
            console.log(error);
        else
            res.end();
    });
});

module.exports = router;