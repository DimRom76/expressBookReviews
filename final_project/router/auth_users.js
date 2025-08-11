const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    console.log(users);
    let validusers = users.filter((user) => {
      return user.username === username && user.password === password;
    });
    return validusers.length > 0;
  };
  

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken, username
      };

      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.body.review;
    const username = req.session.authorization.username;
  
    if (!reviewText) {
      return res.status(400).json({ error: 'Review text is required' });
    }
  
    if (!username) {
      return res.status(401).json({ error: 'User not logged in' });
    }
  
    // Если книги нет — создаём пустую запись
    if (!books[isbn]) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    // Создаём объект отзывов, если его нет
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Добавляем или обновляем отзыв
    books[isbn].reviews[username] = reviewText;
  
    return res.json({
      message: 'Review added/updated successfully',
      book: books[isbn]
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!username) {
      return res.status(401).json({ error: 'User not logged in' });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ error: 'Book not found' });
    }
  
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ error: 'Review not found for this user' });
    }
  
    // Удаляем отзыв только текущего пользователя
    delete books[isbn].reviews[username];
  
    return res.json({
      message: 'Review deleted successfully',
      book: books[isbn]
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
