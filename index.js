const express = require('express')
const mysql = require('mysql')
const app = express()

const connection = mysql.createConnection({
    //connection props
    host:'localhost',
    user:'piotrek',
    password:'piotrek123',
    database: 'mojaBaza'
});


app.set('view engine', 'ejs');
app.set('views', './views');

connection.connect();


app.get('/', function (req, res) {
    connection.query('SELECT 2 + 2 AS solution', function (error, results, fields) {
        if (error) throw error;
        res.render('index', {
            title: "Sklep",
            query_result: results[0].solution
        })
    })
})


app.post( '/login', (req, res) => {
    var username = req.body.txtUser;
    var pwd = req.body.txtPwd;
    
    if ( username == pwd ) {
        // wydanie ciastka
        res.cookie('user', username);
        // przekierowanie
        var returnUrl = req.query.returnUrl;
        res.redirect(returnUrl);
    } else {
        res.render( 'login', { message : "Zła nazwa logowania lub hasło" } );
    }
});

// middleware autentykacji
function authorize(req, res, next) {
    if ( req.cookies.user ) {
        req.user = req.cookies.user;

        next();
    } else {
        res.redirect('/login?returnUrl='+req.url);
    }
}

app.listen(3011)