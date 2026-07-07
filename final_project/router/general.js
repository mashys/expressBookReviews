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
        return res.status(200).json({message: "User registered successfully."});
  } else return res.status(400).json({message: "Username already exists"}); 
} else return res.status(400).json({message: "Username and/or password not provided."});
});

// Task 10: Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
  let getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json({message: "Error fetching books"});
    });
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  let getBook = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found.");
    }
  });

  getBook
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    });
});
  
// Task 12: Get book details based on author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  let getBooksByAuthor = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for this author.");
    }
  });

  getBooksByAuthor
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    });
});

// Task 13: Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  let getBooksByTitle = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title.");
    }
  });

  getBooksByTitle
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json({message: error});
    });
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  let reviews = book.reviews;

  if (Object.keys(reviews).length > 0) {
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({message: "No reviews for this book"});
  }
});

module.exports.general = public_users;
