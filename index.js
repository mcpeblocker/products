const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const md5 = require('md5');
const app = express();
app.use(express.urlencoded());
app.use(express.json());
const con = mysql.createConnection({
    host:'localhost',
    user:'mcpeblocker',
    password:'minecraft11004',
    database:'accounts'
});
var login_logo = "data:image/png;base64,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";
var html_head = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="icon" href="./icon.png">
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
        <html>
        <head>
        ${html_head}
        <title>Login</title>
        </head>
        <body>
            <div class="container shadow p-5" style="margin: 1% 35%; max-width: 30%">
            <img src="${login_logo}" style="width:100%">
            <form action="/login" method="POST">
                <label for="username" style="margin: 5% auto 1% auto">Username:</label>
                <input required class="form-control" type="text" placeholder="Your username..." name="user[name]">
                <label for="password" style="margin: 5% auto 1% auto">Password:</label>
                <input required class="form-control" type="password" placeholder="Your password..." name="user[password]">
                <button type="submit" class="text-white bg-primary form-control" style="margin: 15px auto">Login</button>
                <p class="text-center"><a href="/register">Register</a></p>
            </form>
            </div>
        ${html_scripts}
        </body>
        </html>
    `);
});
app.post('/login', (req,res)=>{
    res.writeHead(200, {'Content-Type':'text/html'});
    var username = req.body.user.name;
    var password = req.body.user.password;
    var current_pass = md5(password);
    con.query("SELECT * FROM users WHERE login=?",[username],(err,result)=>{
        if(err) throw err;
        if(result[0]==undefined){
            res.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    ${html_head}
                    <title>Error about registration</title>
                </head>
                <body>
                    <div class="container shadow p-5" style="margin:15% auto;">
                        <h1 class="text-center text-danger">Firstly register, please!</h1>
                        <div class="row mx-5 px-5">
                        <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
                        <span class="col-8"></span>
                        <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
                        </div>
                    </div>
                ${html_scripts}
                </body>
                </html>
            `);
        } else {
        var login = result[0].login;
        var parol = result[0].parol;
        if(current_pass==parol){
            fs.writeFile(`./users/${username}.txt`, 1, (err)=>{
                if(err) throw err;
            })
            res.write(`
                <script>
                    window.location.pathname = '/user/${username}';
                </script>
            `);
        } else {
            res.write(`
                <!DOCTYPE html>
                <html>
                <head>
                ${html_head}
                <title>Error about account</title>
                </head>
                <body> 
                    <div class="container shadow p-5" style="margin:15% auto;">
                    <h1 class="text-center text-danger">Password is incorrect!</h1>
                    <div class="row mx-5 px-5">
                    <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
                    <span class="col-8"></span>
                    <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
                    </div>
                    </div>
                ${html_scripts}
                </body>
                </html>
            `);
        }
    }
        }
    )
});
app.get('/user/:username',(req,res)=>{
    var username = req.params.username;
    fs.exists(`./users/${username}.txt`, (exists)=>{
        if(exists==true){
    fs.readFile(`./users/${username}.txt`, (err,data)=>{
        if(err) throw err;
        if(data==1){
    res.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    ${html_head}
    <title>Products</title>
    <style>
        tr.page {
            display: none;
        }
        tr.page_0 {
            display:flex;
        }
    </style>
    </head>
    <body>
    <div class="container shadow" style="margin: 5% auto; padding: 3% 2%">
        <h1 class="text-primary text-center">Welcome to Products Area</h1>
        <div class="row">
        <button type="button" class="btn btn-success col-2" onclick="window.location.pathname = '/user/${username}/add'"><i class="fa fa-plus-circle"> Add new product</i></button>
        <span class="col-8"></span>
        <button type="button" class="btn btn-secondary col-2" onclick="window.location.pathname='/logout/${username}'"><i class="fas fa-sign-out-alt"></i> Log out</button>
        </div>
    <table class="table table-hover">
    <tr class="row bg-light">
        <th class="col-2 text-center">Id</th>
        <th class="col-4 text-center">Name</th>
        <th class="col-2 text-center">Show</th>
        <th class="col-2 text-center">Edit</th>
        <th class="col-2 text-center">Delete</th>
    </tr>
    `);
        con.query(`SELECT * FROM products`,(err,result)=> {
            if (err) throw err;
            if (result[0] == undefined) {
                res.write(`
                    </table>
                    <p class="text-center text-secondary">There is no item to show. You can add new item!</p>
                `)
            } else {
                let sort_num = 10;
                let page_num = Math.floor(result.length / sort_num);
                let pagination_el = '<ul class="pagination" style="margin:3% auto">';
                for (var i = 0; i <= page_num; i++) {
                    if(i<page_num) {
                        var id_now = i*sort_num;
                        for (var k = id_now; k < sort_num*(i+1); k++) {
                            if (result[k] != undefined) {
                                res.write(`
                                <tr class="row page page_${i}">
                                    <td class="col-2 text-center">${result[k].id}</td>
                                    <td class="col-4 text-center">${result[k].name}</td>
                                    <td class="col-2"><button class="btn btn-info btn-block" type="button" onclick="window.location.pathname += '/show/${result[k].id}'"><i class="fa fa-eye"></i> Show</button></td>
                                    <td class="col-2"><button class="btn btn-primary btn-block" type="button" onclick="window.location.pathname += '/edit/${result[k].id}'"><i class="fa fa-pencil"></i> Edit</button></td>
                                    <td class="col-2"><button class="btn btn-danger btn-block" type="button" onclick="window.location.pathname += '/delete/${result[k].id}'"><i class="fas fa-file-excel"></i> Delete</button></td>
                                </tr>
                                `);
                                id_now++;
                            } else {
                                console.log('Error with ' + id_now);
                            }
                        }
                    } else {
                        for (var k = page_num*sort_num; k < result.length; k++) {
                            if (result[k] != undefined) {
                                res.write(`
                                <tr class="row page page_${i}">
                                    <td class="col-2 text-center">${result[k].id}</td>
                                    <td class="col-4 text-center">${result[k].name}</td>
                                    <td class="col-2"><button class="btn btn-info btn-block" type="button" onclick="window.location.pathname += '/show/${result[k].id}'"><i class="fa fa-eye"></i> Show</button></td>
                                    <td class="col-2"><button class="btn btn-primary btn-block" type="button" onclick="window.location.pathname += '/edit/${result[k].id}'"><i class="fa fa-pencil"></i> Edit</button></td>
                                    <td class="col-2"><button class="btn btn-danger btn-block" type="button" onclick="window.location.pathname += '/delete/${result[k].id}'"><i class="fas fa-file-excel"></i> Delete</button></td>
                                </tr>
                        `);
                            }
                        }
                    }
                    if(result[i*sort_num]!=undefined){
                        pagination_el += `<li class="page-item"><a class="page-link"><button style="width:100%;height:100%; background:transparent; border:none; outline: none" type="button" onclick="show(${i})">${i+1}</button></a></li>`;
                    }
                }
                pagination_el += '</ul>'
                res.write(pagination_el);
                // for(let i=0; i<result.length; i++){
                //     res.write(`
                //         <tr class="row">
                //             <td class="col-2 text-center">${result[i].id}</td>
                //             <td class="col-4 text-center">${result[i].name}</td>
                //             <td class="col-2"><button class="btn btn-info btn-block" type="button" onclick="window.location.pathname = window.location.pathname + '/show/${result[i].id}'"><i class="fa fa-eye"></i> Show</button></td>
                //             <td class="col-2"><button class="btn btn-primary btn-block" type="button" onclick="window.location.pathname = window.location.pathname + '/edit/${result[i].id}'"><i class="fa fa-pencil"> Edit</i></button></td>
                //             <td class="col-2"><button class="btn btn-danger btn-block" type="button" onclick="window.location.pathname = window.location.pathname + '/delete/${result[i].id}'"><i class="fas fa-file-excel" ></i>Delete</button></td>
                //         </tr>
                //         <br>
                //     `);
            }
        });
    res.write(`
    </div>
    ${html_scripts}
    <script>
        var _products = document.getElementsByClassName('page');
        function show(id){
            for(let n=0; n<_products.length; n++){
                _products[n].style="display:none";
            }
            var lucky_page = document.getElementsByClassName('page_'+id);
            for(let s=0; s<lucky_page.length; s++){
                lucky_page[s].style="display:flex";
            }
        }
    </script>
    </body>
    </html>
    `)
    } else {
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Log to your account, please!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
        `);
    }
});
} else {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Please, log to your account!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
    `);
}
});

});
app.get('/logout/:username',(req,res)=>{
    var username = req.params.username;
    fs.writeFile(`./users/${username}.txt`, 0, (err)=>{
        if(err) throw err;
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(`
            <script>
                window.location.pathname = '/';
            </script>
        `);
    });
});
app.get('/user/:username/show/:id', (req,res)=>{
    var username = req.params.username;
    var id = req.params.id;
    res.writeHead(200, {'Content-type':'text/html'});
    fs.exists(`./users/${username}.txt`,(exists)=>{
        if(exists==true){
            fs.readFile(`./users/${username}.txt`,(err,data)=>{
                if(err) throw err;
                if(data==1){ 
    con.query("SELECT * FROM products WHERE id=?",[id], (err,result)=>{
        if(err) throw err;
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
                } else {       
        res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Log to your account, please!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
        `);
                }
            });

        } else {
            res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Please, log to your account!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
            `);
        }
    });
});
app.get('/user/:username/edit/:id', (req,res)=>{
    var username = req.params.username;
    var id = req.params.id;
    fs.exists(`./users/${username}.txt`,(exists)=>{
        if(exists==true){
            fs.readFile(`./users/${username}.txt`, (err,data)=>{
                if(data==1){    
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
                        <form name="edit_Form" action="confirm/${id}" method="POST">
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
                } else {
                    res.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                        ${html_head}
                        <title>Error about login</title>
                        </head>
                        <body>
                        <div class="container shadow p-5" style="margin:15% auto;">
                        <h1 class="text-center text-danger">Log to your account, please!</h1>
                        <div class="row mx-5 px-5">
                        <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
                        <span class="col-8"></span>
                        <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
                        </div>
                        ${html_scripts}
                        </body>
                        </html>
                    `);
                }
            });
        } else {
            res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Please, log to your account!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
            `);
        }
    });
});
app.post('/user/:username/edit/confirm/:id',(req,res)=>{
    var id = req.params.id;
    var edit_name = req.body.edit_name;
    var edit_count = req.body.edit_count;
    var edit_dimension = req.body.edit_dimension;
    var edit_status = req.body.edit_status;
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
app.get('/user/:username/delete/:id',(req,res)=>{
    var username = req.params.username;
    var id = req.params.id;
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.exists(`./users/${username}.txt`,(exists)=>{
        if(exists==true){
            fs.readFile(`./users/${username}.txt`, (err,data)=>{
                if(data==1){
                    res.write(`
                        <script>
                            var confirmation = confirm("Are you sure to delete that products from list?");
                            if(confirmation==true){
                                window.location.pathname = '/user/${username}/del/${id}';
                            } else {
                                window.location.pathname = '/user/${username}';
                            }
                        </script>
                    `);
                } else {
                    res.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                        ${html_head}
                        <title>Error about login</title>
                        </head>
                        <body>
                        <div class="container shadow p-5" style="margin:15% auto;">
                        <h1 class="text-center text-danger">Log to your account, please!</h1>
                        <div class="row mx-5 px-5">
                        <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
                        <span class="col-8"></span>
                        <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
                        </div>
                        ${html_scripts}
                        </body>
                        </html>
                    `);
                }
            });
        } else {
            res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Please, log to your account!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
            `);
        }
    });
});
app.get('/user/:username/del/:id',(req,res)=>{
    var username = req.params.username;
    var id = req.params.id;
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.exists(`./users/${username}.txt`,(exists)=>{
        if(exists==true){
            fs.readFile(`./users/${username}.txt`, (err,data)=>{
                if(data==1){
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
                } else {
                    res.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                        ${html_head}
                        <title>Error about login</title>
                        </head>
                        <body>
                        <div class="container shadow p-5" style="margin:15% auto;">
                        <h1 class="text-center text-danger">Log to your account, please!</h1>
                        <div class="row mx-5 px-5">
                        <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
                        <span class="col-8"></span>
                        <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
                        </div>
                        ${html_scripts}
                        </body>
                        </html>
                    `);
                }
            });
        } else {
            res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Please, log to your account!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
            `);
        }
    });
});
app.get('/user/:username/add', (req,res)=>{
    var username = req.params.username;
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.exists(`./users/${username}.txt`,(exists)=>{
        if(exists==true){
            fs.readFile(`./users/${username}.txt`, (err,data)=>{
                if(data==1){
                    res.write(`
                        <html>
                            <head>
                                ${html_head}
                                <title>New product</title>
                            </head>
                            <body>
                            <div class="container shadow p-5" style="margin: 5% auto">
                                <h1 class="text-center text-success">New product</h1>
                                <form action="/user/${username}/new" method="POST">
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
                } else {
                    res.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                        ${html_head}
                        <title>Error about login</title>
                        </head>
                        <body>
                        <div class="container shadow p-5" style="margin:15% auto;">
                        <h1 class="text-center text-danger">Log to your account, please!</h1>
                        <div class="row mx-5 px-5">
                        <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
                        <span class="col-8"></span>
                        <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
                        </div>
                        ${html_scripts}
                        </body>
                        </html>
                    `);
                }
            });
        } else {
            res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Please, log to your account!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
            `);
        }
    });
});
app.post('/user/:username/new',(req,res)=>{
    var username = req.params.username;
    var name = req.body.new_name;
    var count = req.body.new_count;
    var dimension = req.body.new_dimension;
    var status = req.body.new_status;
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.exists(`./users/${username}.txt`,(exists)=>{
        if(exists==true){
            fs.readFile(`./users/${username}.txt`, (err,data)=>{
                if(data==1){
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
                } else {
                    res.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                        ${html_head}
                        <title>Error about login</title>
                        </head>
                        <body>
                        <div class="container shadow p-5" style="margin:15% auto;">
                        <h1 class="text-center text-danger">Log to your account, please!</h1>
                        <div class="row mx-5 px-5">
                        <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
                        <span class="col-8"></span>
                        <button onclick="window.location.pathname='/register'" type="button" class="float-right form-control col-2 bg-success text-white mt-5" style="">Register</button>
                        </div>
                        ${html_scripts}
                        </body>
                        </html>
                    `);
                }
            });
        } else {
            res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            ${html_head}
            <title>Error about login</title>
            </head>
            <body>
            <div class="container shadow p-5" style="margin:15% auto;">
            <h1 class="text-center text-danger">Please, log to your account!</h1>
            <div class="row mx-5 px-5">
            <button onclick="window.location.pathname='/'" type="button" class="form-control col-2 bg-primary text-white mt-5" style="">Login</button>
            <span class="col-8"></span>
            <button onclick="window.location.pathname='/register'" type="button" class="form-control col-2 bg-success text-white mt-5" style="">Register</button>
            </div>
            ${html_scripts}
            </body>
            </html>
            `);
        }
    });
});

app.get('/register',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(`
        <!DOCTYPE html>
        <html>
            <head>
                ${html_head}
                <title>Registration</title>
                <style>
                    #btn_submit:disabled {
                        cursor: not-allowed;
                    }
                </style>
            </head>
            <body>
                <div class="container shadow p-5" style="margin: 1% 25%; max-width:50%">
                    <h1 class="text-center text-success">Registration</h1>
                    <form action="/reg" method="POST">
                        <div class="form-group">
                            <label for="new_username">Username</label>
                            <input class="form-control" required id="new_username" type="text" name="new_username" placeholder="New username...">
                        </div>
                        <div class="form-group">
                            <label for="new_password">Password</label>
                            <input class="form-control" required oninput="confirm_pass()" id="new_password" type="password" name="new_password" placeholder="New password...">
                        </div>
                        <div class="form-group">
                            <label for="password_confirm">Confirm password</label>
                            <input class="form-control" required oninput="confirm_pass()" id="password_confirm" type="password" name="password_confirm" placeholder="Repeat password...">
                        </div>
                        <input class="form-control bg-success text-white" type="submit" value="Register" id="btn_submit">
                    </form>
                </div>
                ${html_scripts}
                <script>
                    function confirm_pass(){
                        var pass1 = document.getElementById('new_password');
                        var pass2 = document.getElementById('password_confirm');
                        var btn_submit = document.getElementById('btn_submit');
                        if(pass1.value==pass2.value){
                            pass1.style="border-color:green;";
                            pass2.style="border-color:green;";
                            btn_submit.disabled = false;
                        } else {
                            pass1.style="border-color:red;";
                            pass2.style="border-color:red;";
                            btn_submit.disabled = true;
                        }
                    }
                </script>
            </body>
        </html>
    `);
});
app.post('/reg',(req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'});
    var username = req.body.new_username;
    var password = md5(req.body.new_password);
    let values = [
        [username, password]
    ]
    con.query('SELECT * FROM users WHERE login=?',[username],(err,result)=>{
        if(err) throw err;
        if(result[0]==undefined){
            con.query(`INSERT INTO users (login,parol) VALUES ?`,[values],(err,result)=>{
                if(err) throw err;
                res.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            ${html_head}
                            <title>Registered!!!</title>
                        </head>
                        <body>
                            <div class="container shadow p-5" style="margin: 10% auto">
                                <h1 class="text-success text-center">Registered as:</h1>
                                <table class="table table-bordered">
                                    <tr class="bg-light row">
                                        <th class="col-6">Username</th>
                                        <th class="col-6">Password</th>
                                    </tr>
                                    <tr class="row">
                                        <td class="col-6">${username}</td>
                                        <td class="col-6">${req.body.new_password}</td>
                                    </tr>
                                </table>
                                <div class="row">
                                    <button onclick="window.location.pathname='/'" type="button" class="col-2 btn btn-success">Login</button>
                                    <span class="col-8"></span>
                                    <button onclick="window.location.pathname='/register'" type="button" class="col-2 btn btn-primary">Register</button>
                                </div>
                            </div>
                            ${html_scripts}
                        </body>
                    </html>
                `);
            });
        } else {
            res.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        ${html_head}
                        <title>Already Registered!</title>
                    </head>
                    <body>
                        <div class="container shadow p-5" style="margin: 15% auto">
                            <h1 class="text-center text-success">You have already registered!</h1>
                            <div class="row">
                                <button onclick="window.location.pathname='/'" type="button" class="col-2 btn btn-success">Login</button>
                                <span class="col-8"></span>
                                <button onclick="window.location.pathname='/register'" type="button" class="col-2 btn btn-primary">Register</button>
                            </div>
                        </div>
                        ${html_scripts}
                    </body>
                </html>
            `);
        }
    });
});
app.listen(4555);
console.log("listening at port 4555");