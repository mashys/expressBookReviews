const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const userExists = users.some((user) => user.username === username);
    if (!userExists) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User registered successfully."})
  } else return res.status(400).json({message: "Username already exists"}); 
} else return res.status(400).json({message: "Username and/or password not provided."});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn]
  if (book) {
    return res.status(200).json(book);
  } else {return res.status(404).json({message: "Not found."});}
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  const keys = Object.keys(books);
  const matchingBooks = [];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (books[key].author === author) {
        matchingBooks.push(books[key])
    }
  };

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else res.status(404).json({message: "No books found."})

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const matchingBooks = [];
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (books[key].title === title) {
        matchingBooks.push(books[key]);
    }
  };

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({message: "No books found"})
  };
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  let reviews = book.reviews;

  if (Object.keys(reviews).length > 0) {
    return res.status(200).json(reviews);
  } else {return res.status(404).json({message: "No reviews for this book"})}
});

module.exports.general = public_users;
