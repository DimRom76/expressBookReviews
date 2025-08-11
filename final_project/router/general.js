const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const body = req.body;

    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Error create user" });
    }

    if (users.find(user => user.userName === username)) {
        res.send("User exist!");
    }

    // Push a new user object into the users array based on query parameters from the request
    users.push({
        "username": username,
        "password": password,
    });

    // Send a success message as the response, indicating the user has been added
    res.send("The user " + username + " has been added!");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;
  const search = authorName.toLowerCase();
  const found_book = Object.fromEntries(
    Object.entries(books).filter(([id, book]) =>
      book.author.toLowerCase().includes(search)
    )
  );

  res.send(JSON.stringify(found_book, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const search = title.toLowerCase();
    const found_book = Object.fromEntries(
      Object.entries(books).filter(([id, book]) =>
        book.title.toLowerCase().includes(search)
      )
    );
  
    res.send(JSON.stringify(found_book, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
