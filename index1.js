
const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const app = express();
const con = mysql.createConnection({
    host:'localhost',
    user:'mcpeblocker',
    password:'minecraft11004',
    database:'accounts'
})
var html_head = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="icon" href="./icon.png/">
`
var html_scripts = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/popper.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js"></script>
`
app.get('/', (req,res)=>{
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    ${html_head}
    <title>Products</title>
    </head>
    <body>
    <div class="container shadow" style="margin: 5% auto; padding: 3% 2%">
        <h1 class="text-primary text-center">Welcome to Products Area</h1>
        <form>
        <div class="form-group">
        <button style="margin:20px 5px" class="btn btn-success" type="button" onclick="window.location.pathname = window.location.pathname + 'add'"><i class="fa fa-plus-circle"> Add new product</i></button>
    <table class="table">
        <tr class="row bg-light">
            <th class="col-2 text-center">Id</th>
            <th class="col-4 text-center">Name</th>
            <th class="col-2 text-center">Show</th>
            <th class="col-2 text-center">Edit</th>
            <th class="col-2 text-center">Delete</th>
        </tr>
    </table>
    `);
        con.query(`SELECT * FROM products`,(err,result)=>{
            if(err) throw err;
            res.write('<table id="products_table" class="table table-hover">')
            for(let i=0; i<result.length; i++){
                res.write(`
                    <tr class="row">
                        <td class="col-2 text-center">${result[i].id}</td>
                        <td class="col-4 text-center">${result[i].name}</td>
                        <td class="col-2"><button class="btn btn-info btn-block" type="button" onclick="window.location.pathname = window.location.pathname + 'show/${result[i].id}'"><i class="fa fa-eye"></i> Show</button></td>
                        <td class="col-2"><button class="btn btn-primary btn-block" type="button" onclick="window.location.pathname = window.location.pathname + 'edit/${result[i].id}'"><i class="fa fa-pencil"> Edit</i></button></td>
                        <td class="col-2"><button class="btn btn-danger btn-block" type="button" onclick="window.location.pathname = window.location.pathname + 'delete/${result[i].id}'"><i class="fas fa-file-excel" ></i>Delete</button></td>
                    </tr>
                
                    <br>
                `);
            }
            res.write('</table>')
        });
    res.write(`
    </form>
    </form>
    </div>
    ${html_scripts}
    </body>
    </html>
    `)
});
app.get('/show/:id', (req,res)=>{
    var id = req.params.id;
    con.query("SELECT * FROM products WHERE id=?",[id], (err,result)=>{
        if(err) throw err;
        res.writeHead(200, {'Content-type':'text/html'});
        res.write(`
        <!DOCTYPE html>
        <html>
        <head>
        ${html_head}
        <title>${result[0].name} | Products</title>
        </head>
        <body>
        <div class="container shadow bg-light" style="margin: 5% 8%; padding: 3%;">
        <h1 class="text-info text-center">Product - <b class="text-success">${result[0].name}</b></h1>
        <div class="jumbotron bg-white" style="margin:2%">
        <table class="table table-bordered">
            <tr class="text-primary thead-dark">
                <th>Id</th>
                <th>Name</th>
                <th>Count</th>
                <th>Dimension</th>
                <th>Created-Date</th>
                <th>Updated-Date</th>
            </tr>
            <tr>
                <td>${result[0].id}</td>
                <td>${result[0].name}</td>
                <td>${result[0].count}</td>
                <td>${result[0].dimension}</td>
                <td>${result[0].created_date.getFullYear()}-${result[0].created_date.getMonth()}-${result[0].created_date.getDate()}</td>
                <td>${result[0].updated_date.getFullYear()}-${result[0].updated_date.getMonth()}-${result[0].updated_date.getDate()}</td>
            </tr>
        </table>
        </div>
        </div>
        ${html_scripts}
        </body>
        </html>
        `);
    });
});
app.get('/edit/:id', (req,res)=>{
    var id = req.params.id;
    con.query("SELECT * FROM products WHERE id=?",[id],(err,result)=>{
        if(err) throw err;
        var status_now;
        var not_status_now;
        if(result[0].status=='active'){status_now = 'active'; not_status_now = 'inactive'}
        if(result[0].status=='inactive'){status_now = 'inactive'; not_status_now = 'active'}
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>${result[0].name} | Edit</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin: 3% auto">
                <form name="edit_Form" action="confirm/${id}">
                    <label for="edit_name">Name:</label>
                    <input class="form-control" type="text" value="${result[0].name}" name="edit_name" required><br>
                    <label for="edit_count">Count:</label>
                    <input class="form-control" type="number" value="${result[0].count}" name="edit_count" required><br>
                    <label for="edit_dimension">Dimension:</label>
                    <input class="form-control" type="text" name="edit_dimension" value="${result[0].dimension}" required><br>
                    <label for="edit_status">Status:</label>
                    <select class="form-control" name="edit_status" required>
                        <option>${status_now}</option>
                        <option>${not_status_now}</option>
                    </select><br>
                    <input class="btn btn-primary" type="submit" value="Edit">
                </form>
            </div>
            ${html_scripts}
            </body>
            </html>
        `);
    });
});
app.get('/edit/confirm/:id',(req,res)=>{
    var id = req.params.id;
    var edit_name = req.query.edit_name;
    var edit_count = req.query.edit_count;
    var edit_dimension = req.query.edit_dimension;
    var edit_status = req.query.edit_status;
    var upd_date = new Date();
    var sql_req = `UPDATE products SET name=?, count=?, dimension=?, status=?, updated_date=? WHERE ID = ?`;
    con.query(sql_req, [edit_name, edit_count, edit_dimension, edit_status, upd_date, id], (err, result)=>{
        if(err) throw err;
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write(`
        <html>
            <head>
                ${html_head}
                <title>Edited!</title>    
            </head>
            <body>
            <div class="container shadow p-5" style="margin:10% auto">
                <h1 class="text-center text-success">Edited!</h1>
                <h2 class="text-info">${result.affectedRows} record(s) updated as:</h2>
                <table class="table table-bordered">
                    <tr class="thead-light">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Count</th>
                        <th>Dimension</th>
                        <th>Status</th>
                        <th>Updated date</th>
                    </tr>
                    <tr>
                        <td>${id}</td>
                        <td>${edit_name}</td>
                        <td>${edit_count}</td>
                        <td>${edit_dimension}</td>
                        <td>${edit_status}</td>
                        <td>${upd_date}</td>
                    </tr>
                </table>
            </div>
                ${html_scripts}
            </body>
        </html>
        `);
    });
});
app.get('/delete/:id',(req,res)=>{
    var id = req.params.id;
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(`
        <script>
            var confirmation = confirm("Are you sure to delete that products from list?");
            if(confirmation==true){
                window.location.pathname = '/del/${id}';
            } else {
                window.location.pathname = '/';
            }
        </script>
    `);
});
app.get('/del/:id',(req,res)=>{
    var id = req.params.id;
    res.writeHead(200, {'Content-Type':'text/html'});
    con.query("DELETE FROM products WHERE id=?", [id], (err,result)=>{
        if(err) throw err;
        res.write(`
            <html>
                <head>
                    ${html_head}
                    <title>Deleted</title>
                </head>
                <body>
                    <div class="container shadow p-5" style="margin:15% auto">
                        <h1 class="text-center text-danger">${result.affectedRows} product(s) deleted!</h1>
                    </div>
                ${html_scripts}
                </body>
            </html>
        `);
    });
});
app.get('/add', (req,res)=>{
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(`
        <html>
            <head>
                ${html_head}
                <title>New product</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin: 5% auto">
                <h1 class="text-center text-success">New product</h1>
                <form action="/new">
                    <div class="form-group">    
                    <label for="new_name">Name:</label>
                    <input class="form-control" type="text" name="new_name">
                    </div>
                    <br>
                    <div class="form-group">
                    <label for="new_count">Count:</label>
                    <input class="form-control" type="number" name="new_count">
                    </div>
                    <br>
                    <div class="form-group">
                    <label for="new_dimension">Dimension:</label>
                    <input class="form-control" type="text" name="new_dimension">
                    </div>
                    <br>
                    <div class="form-group">
                    <label for="new_status">Status:</label>
                    <select class="form-control" name="new_status">
                        <option>active</option>
                        <option>inactive</option>
                    </select>
                    </div>
                    <br>
                    <input class="btn btn-success form-control" style="height:50px" type="submit" value="Add">
                </form>
            </div>
            ${html_scripts}
            </body>
        </html>
    `);
});
app.get('/new',(req,res)=>{
    var name = req.query.new_name;
    var count = req.query.new_count;
    var dimension = req.query.new_dimension;
    var status = req.query.new_status;
    res.writeHead(200, {'Content-Type':'text/html'});
    if(name=="" || count=="" || dimension=="" || status==""){
        res.write("<script>alert('Please, fill in the blanks!') window.location.pathname = '/add'</script>");
    } else {
        var date = new Date();
        var items = [
            [name, count, dimension, status, date, date]
        ]
        var sql_req = `INSERT INTO products (name, count, dimension, status, created_date, updated_date) VALUES ?`
        con.query(sql_req, [items], (err,result)=>{
            if(err) throw err;
            res.write(`
            <html>
            <head>
            ${html_head}
            <title>Added</title>
            </head>
            <body>
                <div class="container shadow p-5" style="margin:15% auto">
                    <h1 class="text-center text-success">${result.affectedRows} product(s) added!</h1>
                </div>
            ${html_scripts}
            </body>
            </html>
            `);
        });
    }
});
app.listen(4555);
console.log("listening at port 4555");